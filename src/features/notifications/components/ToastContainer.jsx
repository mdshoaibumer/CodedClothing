import useToastStore from '../store/useToastStore';

/**
 * ToastContainer Component
 * Renders all active toasts in a fixed position at the bottom right
 */
export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const getStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: '❌',
          text: 'text-white',
        };
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: '✅',
          text: 'text-white',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: '⚠️',
          text: 'text-white',
        };
      default:
        return {
          bg: 'bg-blue-500',
          icon: 'ℹ️',
          text: 'text-white',
        };
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const styles = getStyles(toast.type);
        return (
          <div
            key={toast.id}
            className={`${styles.bg} ${styles.text} px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300`}
          >
            <span className="text-lg">{styles.icon}</span>
            <p className="font-medium text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-lg opacity-70 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
