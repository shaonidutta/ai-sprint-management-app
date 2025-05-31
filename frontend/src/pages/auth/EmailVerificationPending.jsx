import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const EmailVerificationPending = () => {
  const navigate = useNavigate();
  const { user, verifyEmail } = useAuth();
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => timer && clearInterval(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      await verifyEmail(user.email);
      setResendSuccess(true);
      setCountdown(60);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="Sprint Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification email to{' '}
            <span className="font-medium text-blue-600">{user?.email}</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            {/* Instructions */}
            <div className="text-sm text-gray-600">
              <p className="mb-2">Please check your email and click the verification link to continue.</p>
              <p>If you don't see the email, please:</p>
              <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                <li>Check your spam folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            {/* Success Message */}
            {resendSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-md p-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Verification email sent successfully!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Resend Button */}
            <div className="mt-4">
              <button
                onClick={handleResendEmail}
                disabled={countdown > 0 || isResending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${countdown > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
              >
                {isResending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : countdown > 0 ? (
                  `Resend email (${countdown}s)`
                ) : (
                  'Resend verification email'
                )}
              </button>
            </div>

            {/* Help Text */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Need help?{' '}
              <a href="/support" className="font-medium text-blue-600 hover:text-blue-500">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPending; 