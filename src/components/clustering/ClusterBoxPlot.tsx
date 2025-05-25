
import React from 'react';
import { ClusteringData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from 'recharts';

interface ClusterBoxPlotProps {
  data?: ClusteringData;
}

const ClusterBoxPlot: React.FC<ClusterBoxPlotProps> = ({ data }) => {
  // Format data for box plot visualization
  const formatBoxPlotData = () => {
    if (!data?.clustering_results?.k_3?.clusters) return [];
    
    const clusters = data.clustering_results.k_3.clusters;
    const variables = Object.keys(clusters[0]?.profile || {});
    
    return variables.slice(0, 8).map(variable => {
      const clusterData = clusters.map((cluster, index) => ({
        cluster: `Cluster ${index + 1}`,
        value: cluster.profile[variable] || 0,
        variable
      }));
      
      const values = clusterData.map(d => d.value);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      
      return {
        variable: variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        cluster1: clusterData[0]?.value || 0,
        cluster2: clusterData[1]?.value || 0,
        cluster3: clusterData[2]?.value || 0,
        mean: mean,
        variance: variance
      };
    });
  };

  const boxPlotData = formatBoxPlotData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="text-sm font-medium text-maastricht-blue">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(3)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-maastricht-blue/20">
      <CardHeader className="bg-gradient-to-r from-maastricht-blue to-maastricht-teal">
        <CardTitle className="text-white">Cluster Value Distribution by Variable</CardTitle>
        <div className="text-sm text-white/90">
          Distribution of survey variable values across the three business clusters
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={boxPlotData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="variable" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={11}
                interval={0}
                stroke="#374151"
              />
              <YAxis fontSize={11} stroke="#374151" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="cluster1" name="Traditional Businesses" fill="#0B5394" opacity={0.8} />
              <Bar dataKey="cluster2" name="Innovation Leaders" fill="#0EA5E9" opacity={0.8} />
              <Bar dataKey="cluster3" name="Moderate SMEs" fill="#22D3EE" opacity={0.8} />
              <Line 
                type="monotone" 
                dataKey="mean" 
                stroke="#DC2626" 
                strokeWidth={2}
                name="Overall Mean"
                dot={{ fill: '#DC2626', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClusterBoxPlot;
