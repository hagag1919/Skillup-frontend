import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import Layout from './components/layout/Layout.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import RoleBasedRedirect from './components/RoleBasedRedirect.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import CoursesPage from './pages/CoursesPage.js';
import CourseDetailPage from './pages/CourseDetailPage.js';
import StudentDashboard from './pages/StudentDashboard.js';
import InstructorDashboard from './pages/InstructorDashboard.js';
import InstructorCourses from './pages/InstructorCourses.js';
import InstructorAnalytics from './pages/InstructorAnalytics.js';
import CourseForm from './pages/CourseForm.js';
import CourseContentManager from './pages/CourseContentManager.js';
import ProfilePage from './pages/ProfilePage.js';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/dashboard" element={<RoleBasedRedirect />} />
                    
                    {/* Student Routes */}
                    <Route 
                      path="/student/dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                          <StudentDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Instructor Routes */}
                    <Route 
                      path="/instructor/dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                          <InstructorDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/instructor/courses" 
                      element={
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                          <InstructorCourses />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/instructor/courses/new" 
                      element={
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                          <CourseForm />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/instructor/courses/:courseId/edit" 
                      element={
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                          <CourseForm />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/instructor/courses/:courseId/content" 
                      element={
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                          <CourseContentManager />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/instructor/analytics" 
                      element={
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                          <InstructorAnalytics />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </div>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
}

export default App;
