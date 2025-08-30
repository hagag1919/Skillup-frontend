import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { instructorCoursesApi } from '../api/courses';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import type { Course, Module, Lesson, CreateModuleData, CreateLessonData, UpdateModuleData, UpdateLessonData } from '../types';

const CourseContentManager: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  
  // Form states
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    moduleOrder: 1
  });
  
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    videoUrl: '',
    durationSeconds: 0,
    lessonOrder: 1
  });
  
  const [saving, setSaving] = useState(false);

  const fetchCourseContent = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await instructorCoursesApi.getCourseDetails(parseInt(courseId));
      setCourse(courseResponse);
      
      // Fetch modules for this course
      const modulesResponse = await instructorCoursesApi.getCourseModules(parseInt(courseId));
      
      // Fetch lessons for each module
      const modulesWithLessons = await Promise.all(
        modulesResponse.map(async (module) => {
          try {
            const lessons = await instructorCoursesApi.getModuleLessons(module.id);
            return { ...module, lessons };
          } catch (err) {
            console.error(`Error fetching lessons for module ${module.id}:`, err);
            return { ...module, lessons: [] };
          }
        })
      );
      
      setModules(modulesWithLessons);
      
    } catch (err) {
      console.error('Error fetching course content:', err);
      setError('Failed to load course content');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'INSTRUCTOR') {
      navigate('/login');
      return;
    }

    if (courseId) {
      fetchCourseContent();
    }
  }, [isAuthenticated, user, navigate, courseId, fetchCourseContent]);

  // Module functions
  const openModuleModal = (module?: Module) => {
    if (module) {
      setEditingModule(module);
      setModuleFormData({
        title: module.title,
        moduleOrder: module.moduleOrder
      });
    } else {
      setEditingModule(null);
      setModuleFormData({
        title: '',
        moduleOrder: modules.length + 1
      });
    }
    setModuleModalOpen(true);
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    try {
      setSaving(true);
      
      if (editingModule) {
        // Update module
        const updateData: UpdateModuleData = {
          title: moduleFormData.title,
          moduleOrder: moduleFormData.moduleOrder,
          courseId: parseInt(courseId)
        };
        await instructorCoursesApi.updateModule(editingModule.id, updateData);
      } else {
        // Create new module
        const createData: CreateModuleData = {
          title: moduleFormData.title,
          courseId: parseInt(courseId),
          moduleOrder: moduleFormData.moduleOrder
        };
        await instructorCoursesApi.createModule(parseInt(courseId), createData);
      }
      
      setModuleModalOpen(false);
      setEditingModule(null);
      await fetchCourseContent();
      
    } catch (err) {
      console.error('Error saving module:', err);
      setError(`Failed to ${editingModule ? 'update' : 'create'} module`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!window.confirm('Are you sure you want to delete this module? This will also delete all lessons in this module.')) {
      return;
    }

    try {
      await instructorCoursesApi.deleteModule(moduleId);
      await fetchCourseContent();
    } catch (err) {
      console.error('Error deleting module:', err);
      setError('Failed to delete module');
    }
  };

  // Lesson functions
  const openLessonModal = (moduleId: number, lesson?: Lesson) => {
    setSelectedModuleId(moduleId);
    
    if (lesson) {
      setEditingLesson(lesson);
      setLessonFormData({
        title: lesson.title,
        videoUrl: lesson.videoUrl || '',
        durationSeconds: lesson.durationSeconds || 0,
        lessonOrder: lesson.lessonOrder
      });
    } else {
      setEditingLesson(null);
      const module = modules.find(m => m.id === moduleId);
      const lessonCount = module?.lessons?.length || 0;
      setLessonFormData({
        title: '',
        videoUrl: '',
        durationSeconds: 0,
        lessonOrder: lessonCount + 1
      });
    }
    setLessonModalOpen(true);
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) return;

    try {
      setSaving(true);
      
      if (editingLesson) {
        // Update lesson
        const updateData: UpdateLessonData = {
          title: lessonFormData.title,
          moduleId: selectedModuleId,
          videoUrl: lessonFormData.videoUrl || undefined,
          durationSeconds: lessonFormData.durationSeconds || undefined,
          lessonOrder: lessonFormData.lessonOrder
        };
        await instructorCoursesApi.updateLesson(editingLesson.id, updateData);
      } else {
        // Create new lesson
        const createData: CreateLessonData = {
          title: lessonFormData.title,
          moduleId: selectedModuleId,
          videoUrl: lessonFormData.videoUrl || undefined,
          durationSeconds: lessonFormData.durationSeconds || undefined,
          lessonOrder: lessonFormData.lessonOrder
        };
        await instructorCoursesApi.createLesson(selectedModuleId, createData);
      }
      
      setLessonModalOpen(false);
      setEditingLesson(null);
      setSelectedModuleId(null);
      await fetchCourseContent();
      
    } catch (err) {
      console.error('Error saving lesson:', err);
      setError(`Failed to ${editingLesson ? 'update' : 'create'} lesson`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      await instructorCoursesApi.deleteLesson(lessonId);
      await fetchCourseContent();
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError('Failed to delete lesson');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/instructor/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/instructor/courses" className="text-blue-600 hover:text-blue-800">
                  My Courses
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-500">{course.title}</span>
              </li>
            </ol>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Content</h1>
          <p className="text-lg text-gray-600 mb-4">{course.title}</p>
          
          <div className="flex space-x-4">
            <Button onClick={() => openModuleModal()}>
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Module
            </Button>
            <Link to={`/instructor/courses/${course.id}/edit`}>
              <Button variant="outline">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Course Info
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Course Content */}
        {modules.length === 0 ? (
          <Card className="p-8 text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-500 mb-4">Start building your course by creating modules and lessons.</p>
            <Button onClick={() => openModuleModal()}>Create Your First Module</Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {modules
              .sort((a, b) => a.moduleOrder - b.moduleOrder)
              .map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Module {module.moduleOrder}: {module.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {module.lessons?.length || 0} lessons
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLessonModal(module.id)}
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Lesson
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openModuleModal(module)}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteModule(module.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Lessons */}
                  <div className="p-6">
                    {!module.lessons || module.lessons.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 mb-3">No lessons in this module yet.</p>
                        <Button variant="outline" size="sm" onClick={() => openLessonModal(module.id)}>
                          Add First Lesson
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {module.lessons
                          .sort((a, b) => a.lessonOrder - b.lessonOrder)
                          .map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                                    {lesson.lessonOrder}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    {lesson.durationSeconds && (
                                      <span>Duration: {formatDuration(lesson.durationSeconds)}</span>
                                    )}
                                    {lesson.videoUrl && (
                                      <span className="flex items-center">
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Video
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openLessonModal(module.id, lesson)}
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        )}

        {/* Module Modal */}
        <Modal
          isOpen={moduleModalOpen}
          onClose={() => setModuleModalOpen(false)}
          title={editingModule ? 'Edit Module' : 'Create New Module'}
        >
          <form onSubmit={handleModuleSubmit} className="p-6 space-y-4">
            <Input
              label="Module Title"
              type="text"
              required
              value={moduleFormData.title}
              onChange={(value) => setModuleFormData(prev => ({ ...prev, title: value }))}
              placeholder="Enter module title"
            />
            
            <Input
              label="Module Order"
              type="number"
              required
              value={moduleFormData.moduleOrder.toString()}
              onChange={(value) => setModuleFormData(prev => ({ ...prev, moduleOrder: parseInt(value) || 1 }))}
              placeholder="1"
              min="1"
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModuleModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : (editingModule ? 'Update Module' : 'Create Module')}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Lesson Modal */}
        <Modal
          isOpen={lessonModalOpen}
          onClose={() => setLessonModalOpen(false)}
          title={editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
        >
          <form onSubmit={handleLessonSubmit} className="p-6 space-y-4">
            <Input
              label="Lesson Title"
              type="text"
              required
              value={lessonFormData.title}
              onChange={(value) => setLessonFormData(prev => ({ ...prev, title: value }))}
              placeholder="Enter lesson title"
            />
            
            <Input
              label="Video URL (optional)"
              type="url"
              value={lessonFormData.videoUrl}
              onChange={(value) => setLessonFormData(prev => ({ ...prev, videoUrl: value }))}
              placeholder="https://youtube.com/watch?v=..."
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duration (minutes)"
                type="number"
                value={Math.floor(lessonFormData.durationSeconds / 60).toString()}
                onChange={(value) => setLessonFormData(prev => ({ 
                  ...prev, 
                  durationSeconds: (parseInt(value) || 0) * 60 
                }))}
                placeholder="0"
                min="0"
              />
              
              <Input
                label="Lesson Order"
                type="number"
                required
                value={lessonFormData.lessonOrder.toString()}
                onChange={(value) => setLessonFormData(prev => ({ ...prev, lessonOrder: parseInt(value) || 1 }))}
                placeholder="1"
                min="1"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLessonModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : (editingLesson ? 'Update Lesson' : 'Create Lesson')}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default CourseContentManager;
