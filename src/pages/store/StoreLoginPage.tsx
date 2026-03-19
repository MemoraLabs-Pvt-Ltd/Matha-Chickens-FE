import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/hooks/useAuth';

export default function StoreLoginPage() {
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/store/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      navigate('/store/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <div className="h-[500px] relative shrink-0 w-[448px]">
        <form onSubmit={handleLogin}>
          <div>
            <Button
              className="absolute left-0 top-0 px-6 py-4"
              onClick={() => navigate('/')}
              variant="ghost"
              type="button"
            >
              <ArrowLeft className="size-4 text-muted-foreground" />
              <span className="font-normal leading-5 ml-2 text-sm text-muted-foreground">
                Back to Home
              </span>
            </Button>

            <div className="absolute bg-card border border-border flex flex-col gap-16 h-[448px] items-start left-0 p-px rounded-2xl top-[52px] w-[448px]">
              <div className="h-[120px] relative shrink-0 w-[446px]">
                <div className="flex flex-col items-center pt-6 px-6 size-full">
                  <div className="h-16 relative rounded-lg shrink-0 w-[70px]">
                    <Logo className="absolute bg-clip-padding border-0 border-transparent border-solid inset-0 max-w-none object-cover pointer-events-none rounded-lg size-full" />
                  </div>

                  <p className="font-medium leading-4 mt-4 text-base text-foreground text-center">
                    Store Owner Login
                  </p>

                  <p className="font-normal leading-6 mt-1 text-base text-muted-foreground text-center">
                    Access your store dashboard
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
                      <Label htmlFor="email">Email</Label>
                      <Input
                        className="bg-input border-transparent h-9 rounded-lg"
                        id="email"
                        placeholder="store@mathachickens.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2 h-[58px] items-start relative shrink-0 w-full">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        className="bg-input border-transparent h-9 rounded-lg"
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      className="bg-store h-9 hover:bg-store/90 rounded-lg text-white w-full"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>

                    <p
                      className="font-normal h-5 leading-5 text-sm text-muted-foreground text-center w-full cursor-pointer hover:underline"
                      onClick={() => navigate('/forgot-password')}
                    >
                      Forgot password?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
