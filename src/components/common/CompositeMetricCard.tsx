
import React from 'react';

interface CompositeMetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  description: string;
}

const CompositeMetricCard: React.FC<CompositeMetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  description 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold text-primary">{value}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default CompositeMetricCard;
