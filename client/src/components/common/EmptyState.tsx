import React from 'react';
import { Inbox, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  actionLabel, 
  actionLink,
  icon 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300 text-center animate-fade-in">
      <div className="bg-green-50 p-6 rounded-full text-green-600 mb-6">
        {icon || <Inbox size={64} strokeWidth={1.5} />}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link 
          to={actionLink}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
        >
          <PlusCircle size={20} />
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
