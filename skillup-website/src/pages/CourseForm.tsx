import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { instructorCoursesApi } from '../api/courses';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';
import type { Course, CreateCourseData, UpdateCourseData } from '../types';

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnailUrl: ''
  });

  const isEditing = Boolean(courseId);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const response = await instructorCoursesApi.getCourseDetails(parseInt(courseId));
      setCourse(response);
      setFormData({
        title: response.title,
        description: response.description,
        category: response.category,
        thumbnailUrl: response.thumbnailUrl || ''
      });
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'INSTRUCTOR') {
      navigate('/login');
      return;
    }

    if (isEditing && courseId) {
      fetchCourse();
    }
  }, [isAuthenticated, user, navigate, isEditing, courseId, fetchCourse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (isEditing && courseId) {
        const updateData: UpdateCourseData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          thumbnailUrl: formData.thumbnailUrl.trim() || undefined
        };
        await instructorCoursesApi.updateCourse(parseInt(courseId), updateData);
      } else {
        const createData: CreateCourseData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          thumbnailUrl: formData.thumbnailUrl.trim() || undefined
        };
        await instructorCoursesApi.createCourse(createData);
      }

      navigate('/instructor/courses');
    } catch (err) {
      console.error('Error saving course:', err);
      setError(`Failed to ${isEditing ? 'update' : 'create'} course`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const categories = [
    'Programming',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'Machine Learning',
    'Database',
    'DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Project Management',
    'Business',
    'Marketing',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-lg text-gray-600">
            {isEditing ? 'Update your course information' : 'Share your knowledge with the world'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Title */}
            <div>
              <Input
                label="Course Title *"
                type="text"
                required
                value={formData.title}
                onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                placeholder="Enter course title"
              />
            </div>

            {/* Course Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what students will learn in this course"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Thumbnail URL */}
            <div>
              <Input
                label="Course Thumbnail URL"
                type="url"
                value={formData.thumbnailUrl}
                onChange={(value) => setFormData(prev => ({ ...prev, thumbnailUrl: value }))}
                placeholder="https://example.com/thumbnail.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional: Add a thumbnail image for your course
              </p>
            </div>

            {/* Thumbnail Preview */}
            {formData.thumbnailUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Preview
                </label>
                <div className="w-64 h-36 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Course thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/instructor/courses')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditing ? 'Update Course' : 'Create Course'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Next Steps */}
        {isEditing && course && (
          <Card className="mt-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/instructor/courses/${course.id}/content`)}
                className="justify-start"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Manage Content
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/instructor/courses/${course.id}/analytics`)}
                className="justify-start"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Course Analytics
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseForm;
