import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
          {icon}
        </span>
      )}
      <input 
        className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-4 py-2.5 rounded-full border-none bg-surface-container text-on-surface text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/50 focus:outline-none transition-all placeholder:text-outline ${className}`}
        {...props}
      />
    </div>
  );
}
