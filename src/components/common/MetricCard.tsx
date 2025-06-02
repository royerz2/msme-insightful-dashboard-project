
import React from 'react';
import { MetricCardData } from '../../types';

interface MetricCardProps {
  data: MetricCardData;
}

const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  // Handle undefined data gracefully
  if (!data) {
    return (
      <div className="metric-card rounded-lg p-6 bg-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const { title, value, change, trend, icon } = data;

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className="metric-card rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <span className={`ml-2 text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()} {change}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="ml-4 p-3 bg-primary/10 rounded-lg">
            <span className="text-2xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
