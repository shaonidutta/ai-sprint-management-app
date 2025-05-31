import { createBrowserRouter } from 'react-router-dom';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import LandingPage from '../pages/landing/LandingPage';
import RootLayout from '../components/Layout/RootLayout';
import Login from '../pages/auth/Login';
import EmailVerificationPending from '../pages/auth/EmailVerificationPending';

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
      }
    ]
  }
];

export const router = createBrowserRouter(routes);

export default router; 