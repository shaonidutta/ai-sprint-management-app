import { createBrowserRouter } from 'react-router-dom';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import LandingPage from '../pages/landing/LandingPage';
import RootLayout from '../components/Layout/RootLayout';
import Login from '../pages/auth/Login';
import EmailVerificationPending from '../pages/auth/EmailVerificationPending';
import Register from '../pages/auth/Register';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import ProjectPage from '../pages/project/ProjectPage';
import BoardPage from '../pages/board/BoardPage';
import ProfilePage from '../pages/profile/ProfilePage';


export const routes = [
  {
    element: <RootLayout />,
    children: [
      // Public Routes
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
      {
        path: '/verify-email',
        element: <EmailVerificationPending />,
      },
      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/projects/:id',
            element: <ProjectPage />,
          },
          {
            path: '/boards/:id',
            element: <BoardPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
        ]
      }
    ]
  }
];

export const router = createBrowserRouter(routes);

export default router; 