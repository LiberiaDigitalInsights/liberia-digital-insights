import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { H1, H2, Muted } from '../components/ui/Typography';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { backendApi } from '../services/backendApi';
import { useSearchParams } from 'react-router-dom';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error | already
  const [message, setMessage] = useState('');
  const [subscriberInfo, setSubscriberInfo] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Please contact support for assistance.');
      return;
    }

    handleUnsubscribe(token);
  }, [searchParams]);

  const handleUnsubscribe = async (token) => {
    try {
      const response = await backendApi.newsletters.unsubscribe(token);
      setStatus('success');
      setMessage('You have been successfully unsubscribed from our newsletter.');
      setSubscriberInfo(response.subscriber);
    } catch (subscriptionError) {
      if (subscriptionError.message.includes('Already unsubscribed')) {
        setStatus('already');
        setMessage('You are already unsubscribed from our newsletter.');
      } else if (subscriptionError.message.includes('Invalid unsubscribe token')) {
        setStatus('error');
        setMessage('Invalid or expired unsubscribe link. Please contact support for assistance.');
      } else {
        setStatus('error');
        setMessage('An error occurred while processing your request. Please try again later.');
      }
    }
  };

  const handleResubscribe = async () => {
    if (!subscriberInfo?.email) return;

    try {
      await backendApi.newsletters.subscribe({
        name: subscriberInfo.name,
        email: subscriberInfo.email,
        company: subscriberInfo.company,
        org: subscriberInfo.org,
        position: subscriberInfo.position,
      });

      setStatus('success');
      setMessage('Welcome back! You have been resubscribed to our newsletter.');
    } catch {
      setStatus('error');
      setMessage('Failed to resubscribe. Please use the newsletter signup form.');
    }
  };

  return (
    <>
      <SEO
        title="Unsubscribe - Liberia Digital Insights"
        description="Unsubscribe from our newsletter"
      />

      <div className="min-h-screen bg-[var(--color-background)] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center">
              {/* Status Icons */}
              {status === 'loading' && (
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {status === 'success' && (
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {status === 'error' && (
                <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}

              {status === 'already' && (
                <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              )}

              {/* Content */}
              <H1 className="mb-4">
                {status === 'loading' && 'Processing...'}
                {status === 'success' && 'Successfully Unsubscribed'}
                {status === 'error' && 'Unsubscribe Failed'}
                {status === 'already' && 'Already Unsubscribed'}
              </H1>

              <Muted className="mb-8 text-lg">{message}</Muted>

              {/* Subscriber Info */}
              {subscriberInfo && status !== 'loading' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
                  <h3 className="font-medium text-gray-900 mb-2">Subscriber Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Name:</strong> {subscriberInfo.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {subscriberInfo.email}
                    </p>
                    <p>
                      <strong>Subscribed:</strong>{' '}
                      {new Date(subscriberInfo.subscribed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {status === 'error' && (
                  <>
                    <Button as="a" href="/subscribe" variant="solid">
                      Subscribe to Newsletter
                    </Button>
                    <Button as="a" href="/contact" variant="outline">
                      Contact Support
                    </Button>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <Button onClick={handleResubscribe} variant="solid">
                      Resubscribe
                    </Button>
                    <Button as="a" href="/" variant="outline">
                      Go to Homepage
                    </Button>
                  </>
                )}

                {status === 'already' && (
                  <>
                    <Button as="a" href="/subscribe" variant="solid">
                      Update Subscription
                    </Button>
                    <Button as="a" href="/" variant="outline">
                      Go to Homepage
                    </Button>
                  </>
                )}

                {status === 'loading' && (
                  <Button disabled variant="outline">
                    Processing Request...
                  </Button>
                )}
              </div>

              {/* Additional Information */}
              {status === 'success' && (
                <div className="mt-8 text-sm text-gray-600 text-left bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">We're sorry to see you go!</h4>
                  <p className="mb-2">
                    You'll no longer receive our weekly newsletter with the latest tech insights and
                    updates from Liberia's digital ecosystem.
                  </p>
                  <p>
                    You can resubscribe at any time by clicking the "Resubscribe" button above or
                    visiting our newsletter signup page.
                  </p>
                </div>
              )}

              {/* Privacy Note */}
              <div className="mt-8 text-xs text-gray-500 text-center">
                <p>
                  We respect your privacy. Your information will be handled according to our{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Unsubscribe;
