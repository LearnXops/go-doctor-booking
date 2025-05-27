import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: FieldError | string;
  size?: TextareaSize;
  fullWidth?: boolean;
  containerClassName?: string;
  rows?: number;
}

const sizeClasses: Record<TextareaSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      size = 'md',
      fullWidth = false,
      className = '',
      containerClassName = '',
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const hasError = !!error;
    const isDisabled = props.disabled;

    const textareaClasses = [
      'block w-full rounded-md shadow-sm',
      'focus:ring-1 focus:ring-opacity-50',
      'disabled:bg-gray-100 disabled:text-gray-500',
      sizeClasses[size],
      hasError
        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      className,
    ].filter(Boolean).join(' ');

    const containerClasses = [
      'space-y-1',
      fullWidth ? 'w-full' : 'max-w-2xl',
      containerClassName,
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium ${
              hasError ? 'text-red-700' : 'text-gray-700'
            }`}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="mt-1">
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            className={textareaClasses}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            disabled={isDisabled}
            {...props}
          />
        </div>
        {hasError && (
          <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
            {typeof error === 'string' ? error : error?.message}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
