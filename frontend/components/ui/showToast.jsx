import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

const CustomToast = ({ t, title, message, icon: Icon, gradient }) => (
  <div
    className={`
      ${t.visible ? 'animate-enter' : 'animate-leave'}
      max-w-md w-full pointer-events-auto relative group
    `}
  >
    {/* Gradient background with blur effect */}
    <div
      className={`
        absolute -inset-0.5 
        ${gradient}
        rounded-2xl blur opacity-75 
        group-hover:opacity-100 transition duration-1000 
        group-hover:duration-200
      `}
    />
    
    {/* Content container with backdrop blur */}
    <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
      <div className="flex p-4">
        <div className="flex-1 flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-white">{title}</p>
            <p className="mt-1 text-sm text-slate-300">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const ToasterProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 5000,
      style: {
        background: 'transparent',
        padding: 0,
        boxShadow: 'none',
      },
    }}
  />
);

// Custom animations
const customStyles = `
  @keyframes enter {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes leave {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .animate-enter {
    animation: enter 0.35s ease-out;
  }
  
  .animate-leave {
    animation: leave 0.35s ease-in forwards;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = customStyles;
  document.head.appendChild(style);
}

export const showSuccess = (message, title = 'Success') =>
  toast.custom((t) => (
    <CustomToast
      t={t}
      title={title}
      message={message}
      icon={CheckCircle2}
      gradient="bg-gradient-to-r from-green-600 to-emerald-600"
    />
  ));

export const showError = (message, title = 'Error') =>
  toast.custom((t) => (
    <CustomToast
      t={t}
      title={title}
      message={message}
      icon={XCircle}
      gradient="bg-gradient-to-r from-red-600 to-rose-600"
    />
  ));

export const showWarning = (message, title = 'Warning') =>
  toast.custom((t) => (
    <CustomToast
      t={t}
      title={title}
      message={message}
      icon={AlertCircle}
      gradient="bg-gradient-to-r from-yellow-600 to-orange-600"
    />
  ));

export default ToasterProvider;