import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { LoginButton } from './LoginButton';
import { ErrorMessage } from './ErrorMessage';
import { ForgotPasswordLink } from './ForgotPasswordLink';
import { useLogin } from '../hooks/useLogin';
import { cn } from '@/utils/utils';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { handleLogin, isLoading, error } = useLogin();
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const username = watch('username');
  const password = watch('password');

  React.useEffect(() => {
    if (error) {
      setApiError(error);
    }
  }, [error]);

  React.useEffect(() => {
    if (username || password) {
      setApiError(null);
    }
  }, [username, password]);

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    await handleLogin(data.username, data.password);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && username && password) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <ErrorMessage message={apiError} />

      <div className="w-full">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          autoComplete="username"
          aria-required="true"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
          className={cn(
            errors.username && 'border-red-500 focus-visible:ring-red-500'
          )}
          {...register('username')}
        />
        {errors.username && (
          <p
            id="username-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="w-full">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className={cn(
            errors.password && 'border-red-500 focus-visible:ring-red-500'
          )}
          onKeyDown={handleKeyDown}
          {...register('password')}
        />
        {errors.password && (
          <p
            id="password-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <ForgotPasswordLink />
      </div>

      <LoginButton isLoading={isLoading} disabled={isLoading}>
        Login
      </LoginButton>
    </form>
  );
};

