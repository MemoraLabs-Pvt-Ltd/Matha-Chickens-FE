import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to admin dashboard
    if (!isLoading && user) {
      navigate('/admin/dashboard');
    }
  }, [user, isLoading, navigate]);

  // Verify the token from URL params
  const accessToken = searchParams.get('access_token');
  const type = searchParams.get('type');
  const isValidToken = accessToken && type === 'recovery';

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center w-full">
        <div className="h-[400px] relative shrink-0 w-[448px]">
          <div className="absolute bg-card border border-border flex flex-col gap-16 h-[348px] items-start left-0 p-px rounded-2xl top-[52px] w-[448px]">
            <div className="h-[120px] relative shrink-0 w-[446px]">
              <div className="flex flex-col items-center pt-6 px-6 size-full">
                <div className="h-16 relative rounded-lg shrink-0 w-[70px]">
                  <Logo className="absolute bg-clip-padding border-0 border-transparent border-solid inset-0 max-w-none object-cover pointer-events-none rounded-lg size-full" />
                </div>
                <p className="font-medium leading-4 mt-4 text-base text-foreground text-center">
                  Password Reset
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-px min-w-px relative w-[446px]">
              <div className="flex flex-col items-start px-6 size-full">
                <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                    Invalid or expired password reset link. Please request a new one.
                  </div>
                  <Button
                    className="bg-admin h-9 hover:bg-admin/90 rounded-lg text-white w-full"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Request New Link
                  </Button>
                  <p
                    className="font-normal h-5 leading-5 text-sm text-muted-foreground text-center w-full cursor-pointer hover:underline"
                    onClick={() => navigate('/admin/login')}
                  >
                    Back to Login
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center w-full">
        <div className="h-[400px] relative shrink-0 w-[448px]">
          <div className="absolute bg-card border border-border flex flex-col gap-16 h-[348px] items-start left-0 p-px rounded-2xl top-[52px] w-[448px]">
            <div className="h-[120px] relative shrink-0 w-[446px]">
              <div className="flex flex-col items-center pt-6 px-6 size-full">
                <div className="h-16 relative rounded-lg shrink-0 w-[70px]">
                  <Logo className="absolute bg-clip-padding border-0 border-transparent border-solid inset-0 max-w-none object-cover pointer-events-none rounded-lg size-full" />
                </div>
                <p className="font-medium leading-4 mt-4 text-base text-foreground text-center">
                  Password Reset Complete
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-px min-w-px relative w-[446px]">
              <div className="flex flex-col items-start px-6 size-full">
                <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                  <p className="text-sm text-muted-foreground text-center w-full">
                    Your password has been successfully reset. You can now login with your new password.
                  </p>
                  <Button
                    className="bg-admin h-9 hover:bg-admin/90 rounded-lg text-white w-full"
                    onClick={() => navigate('/admin/login')}
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <div className="h-[500px] relative shrink-0 w-[448px]">
        <form onSubmit={handleResetPassword}>
          <div className="absolute bg-card border border-border flex flex-col gap-16 h-[448px] items-start left-0 p-px rounded-2xl top-[52px] w-[448px]">
            <div className="h-[120px] relative shrink-0 w-[446px]">
              <div className="flex flex-col items-center pt-6 px-6 size-full">
                <div className="h-16 relative rounded-lg shrink-0 w-[70px]">
                  <Logo className="absolute bg-clip-padding border-0 border-transparent border-solid inset-0 max-w-none object-cover pointer-events-none rounded-lg size-full" />
                </div>

                <p className="font-medium leading-4 mt-4 text-base text-foreground text-center">
                  Set New Password
                </p>

                <p className="font-normal leading-6 mt-1 text-base text-muted-foreground text-center">
                  Enter your new password below
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-px min-w-px relative w-[446px]">
              <div className="flex flex-col items-start px-6 size-full">
                <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 h-[58px] items-start relative shrink-0 w-full">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      className="bg-input border-transparent h-9 rounded-lg"
                      id="password"
                      placeholder="Enter new password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2 h-[58px] items-start relative shrink-0 w-full">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      className="bg-input border-transparent h-9 rounded-lg"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    className="bg-admin h-9 hover:bg-admin/90 rounded-lg text-white w-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </Button>

                  <p
                    className="font-normal h-5 leading-5 text-sm text-muted-foreground text-center w-full cursor-pointer hover:underline"
                    onClick={() => navigate('/admin/login')}
                  >
                    Back to Login
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
