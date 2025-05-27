import React, { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastProps {
  id: string | number;
  title?: string;
  message: string | React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  isOpen?: boolean;
  onClose?: (id: string | number) => void;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
  showIcon?: boolean;
  showCloseButton?: boolean;
  pauseOnHover?: boolean;
}

const variantIcons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  default: InformationCircleIcon,
};

const variantColors = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    icon: 'text-green-400',
    border: 'border-green-100',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    icon: 'text-red-400',
    border: 'border-red-100',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    icon: 'text-yellow-400',
    border: 'border-yellow-100',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    icon: 'text-blue-400',
    border: 'border-blue-100',
  },
  default: {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    icon: 'text-gray-400',
    border: 'border-gray-100',
  },
};

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  variant = 'default',
  duration = 5000,
  isOpen: isOpenProp = true,
  onClose,
  position = 'top-right',
  className = '',
  showIcon = true,
  showCloseButton = true,
  pauseOnHover = true,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenProp);
  const [isPaused, setIsPaused] = useState(false);
  const Icon = variantIcons[variant];
  const colors = variantColors[variant] || variantColors.default;

  // Handle auto-dismiss
  useEffect(() => {
    if (!isOpen || duration === 0 || isPaused) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, isPaused]);

  // Sync with parent controlled isOpen prop
  useEffect(() => {
    setIsOpen(isOpenProp);
  }, [isOpenProp]);

  const handleClose = () => {
    setIsOpen(false);
    // Give time for the exit animation before calling onClose
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <Transition
      show={isOpen}
      enter="transform ease-out duration-300 transition"
      enterFrom={position.includes('right') ? 'translate-x-full' : position.includes('left') ? '-translate-x-full' : 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'}
      enterTo={position.includes('right') || position.includes('left') ? 'translate-x-0' : 'translate-y-0 opacity-100 sm:translate-x-0'}
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
      leaveTo="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
      className={clsx(
        'fixed z-50 w-full max-w-sm',
        positionClasses[position],
        className
      )}
    >
      <div
        className={clsx(
          'rounded-lg shadow-lg overflow-hidden',
          'border',
          colors.bg,
          colors.border,
          colors.text,
          'w-full',
          'transform transition-all',
          'pointer-events-auto',
          'max-w-xs sm:max-w-sm md:max-w-md'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="alert"
        aria-live={variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'}
        aria-atomic="true"
      >
        <div className="p-4">
          <div className="flex items-start">
            {showIcon && (
              <div className="flex-shrink-0">
                <Icon className={clsx('h-5 w-5', colors.icon)} aria-hidden="true" />
              </div>
            )}
            <div className={clsx('flex-1', { 'ml-3': showIcon })}>
              {title && (
                <h3 className="text-sm font-medium">
                  {title}
                </h3>
              )}
              <div className={clsx('text-sm', { 'mt-1': title })}>
                {typeof message === 'string' ? <p>{message}</p> : message}
              </div>
            </div>
            {showCloseButton && (
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  className={clsx(
                    'inline-flex rounded-md focus:outline-none',
                    'focus:ring-2 focus:ring-offset-2',
                    'transition-colors duration-150',
                    'text-gray-400 hover:text-gray-500',
                    'focus:ring-gray-400',
                    'dark:text-gray-500 dark:hover:text-gray-400',
                    'dark:focus:ring-gray-500',
                  )}
                  onClick={handleClose}
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
        {duration > 0 && (
          <div className={clsx('h-1 w-full', colors.bg)}>
            <div
              className={clsx('h-full', {
                'bg-green-500': variant === 'success',
                'bg-red-500': variant === 'error',
                'bg-yellow-500': variant === 'warning',
                'bg-blue-500': variant === 'info',
                'bg-gray-500': variant === 'default',
                'animate-progress': !isPaused,
              })}
              style={{
                animationDuration: `${duration}ms`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            />
          </div>
        )}
      </div>
    </Transition>
  );
};

export default Toast;
