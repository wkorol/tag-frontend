export const getApiBaseUrl = () => {
  const envValue = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (envValue && envValue.trim() !== '') {
    return envValue;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }

  console.warn('VITE_API_BASE_URL is not set; API calls will fail.');
  return '';
};
