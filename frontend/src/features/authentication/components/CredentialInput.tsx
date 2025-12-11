import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';

export interface CredentialInputProps {
  type: 'text' | 'password';
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  required?: boolean;
  autoComplete?: string;
  icon?: React.ReactNode;
}

export const CredentialInput = React.forwardRef<HTMLInputElement, CredentialInputProps>(
  (
    {
      type,
      label,
      placeholder,
      value,
      onChange,
      error,
      required = false,
      autoComplete,
      icon,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    const inputId = `credential-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <Input
            id={inputId}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            autoComplete={autoComplete}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              icon && 'pl-10',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

CredentialInput.displayName = 'CredentialInput';

