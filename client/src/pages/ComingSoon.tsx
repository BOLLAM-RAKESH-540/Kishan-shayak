import { Construction } from 'lucide-react';

const ComingSoon = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
      <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
        <Construction size={48} />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 max-w-md">
        We are working hard to bring this feature to you soon. Stay tuned for updates!
      </p>
    </div>
  );
};

export default ComingSoon;
