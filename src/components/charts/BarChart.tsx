
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  title?: string;
  xAxisKey: string;
  yAxisKey: string;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  xAxisKey, 
  yAxisKey, 
  color = '#3B82F6' 
}) => {
  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            fontSize={10}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yAxisKey} fill={color} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
