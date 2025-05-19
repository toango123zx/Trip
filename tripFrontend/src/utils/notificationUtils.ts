import { notification } from 'antd';

const DEFAULT_DURATION = 3;

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  message?: string;
  description?: string;
  duration?: number;
}

const notify = (
  type: NotificationType,
  { message, description, duration }: NotificationOptions = {}
) => {
  notification[type]({
    message: message || defaultMessages[type].message,
    description: description || defaultMessages[type].description,
    duration: duration ?? DEFAULT_DURATION,
  });
};

const defaultMessages: Record<NotificationType, { message: string; description: string }> = {
    success: {
        message: 'Success',
        description: 'Action completed successfully',
      },
      error: {
        message: 'An error occurred',
        description: 'Unable to complete the request. Please try again.',
      },
      warning: {
        message: 'Warning',
        description: 'Please check the information again.',
      },
      info: {
        message: 'Information',
        description: 'This is a system message.',
      }
};

export const notificationUtils = {
  success: (options?: NotificationOptions) => notify('success', options),
  error: (options?: NotificationOptions) => notify('error', options),
  warning: (options?: NotificationOptions) => notify('warning', options),
  info: (options?: NotificationOptions) => notify('info', options),
};