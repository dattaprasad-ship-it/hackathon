import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CreateEmployeeRequest, UpdateEmployeeRequest } from '../types/employees.types';

const employeeSchema = z
  .object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    createLoginDetails: z.boolean().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    loginStatus: z.enum(['Enabled', 'Disabled']).optional(),
  })
  .refine(
    (data) => {
      if (data.createLoginDetails) {
        return data.username && data.password && data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Username, password, and confirm password are required when creating login details',
      path: ['username'],
    }
  )
  .refine(
    (data) => {
      if (data.createLoginDetails && data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Password and confirm password do not match',
      path: ['confirmPassword'],
    }
  );

interface EmployeeFormProps {
  initialData?: Partial<CreateEmployeeRequest | UpdateEmployeeRequest>;
  onSubmit: (data: CreateEmployeeRequest | UpdateEmployeeRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [createLoginDetails, setCreateLoginDetails] = React.useState(
    initialData?.createLoginDetails || false
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateEmployeeRequest | UpdateEmployeeRequest>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeId: initialData?.employeeId || '',
      firstName: initialData?.firstName || '',
      middleName: initialData?.middleName || '',
      lastName: initialData?.lastName || '',
      createLoginDetails: (initialData as any)?.createLoginDetails || false,
      username: initialData?.username || '',
      loginStatus: initialData?.loginStatus || 'Enabled',
    },
  });

  const watchedCreateLogin = watch('createLoginDetails');

  React.useEffect(() => {
    setCreateLoginDetails(watchedCreateLogin || false);
  }, [watchedCreateLogin]);

  const onFormSubmit = async (data: CreateEmployeeRequest | UpdateEmployeeRequest) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Full Name*</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <Input
              id="firstName"
              {...register('firstName')}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <Input id="middleName" {...register('middleName')} />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <Input
              id="lastName"
              {...register('lastName')}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
            Employee Id
          </label>
          <Input
            id="employeeId"
            {...register('employeeId')}
            placeholder="0445"
            className={errors.employeeId ? 'border-red-500' : ''}
          />
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="createLoginDetails"
            {...register('createLoginDetails')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="createLoginDetails" className="text-sm font-medium text-gray-700">
            Create Login Details
          </label>
        </div>

        {createLoginDetails && (
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <Input
                id="username"
                {...register('username')}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                For a strong password, please use a hard to guess combination of text with upper and
                lower case characters, symbols and numbers
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password *
              </label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Enabled"
                    {...register('loginStatus')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Disabled"
                    {...register('loginStatus')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Disabled</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

