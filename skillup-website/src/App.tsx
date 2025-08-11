import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import Layout from './components/layout/Layout.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import CoursesPage from './pages/CoursesPage.js';
import CourseDetailPage from './pages/CourseDetailPage.js';
import StudentDashboard from './pages/StudentDashboard.js';
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
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
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
