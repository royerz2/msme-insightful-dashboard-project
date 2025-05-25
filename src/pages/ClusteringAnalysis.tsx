import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useApiData } from '../hooks/useApiData';
import { apiEndpoints } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ClusteringData } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ClusterDifferencesAnalysis from '../components/clustering/ClusterDifferencesAnalysis';

const ClusteringAnalysis: React.FC = () => {
  const [selectedK, setSelectedK] = useState<'k_3' | 'k_4'>('k_4');
  const { data, loading, error, useDummyData } = useApiData<ClusteringData>(apiEndpoints.clustering);

  // Format PCA data for scatter plot
  const formatPcaData = (data?: ClusteringData) => {
    if (!data || !data.visualization || !data.visualization.pca_components) return [];
    
    return data.visualization.pca_components.map((point, idx) => ({
      x: point[0],
      y: point[1],
      cluster: data.visualization.cluster_labels ? data.visualization.cluster_labels[idx] : 0,
    }));
  };

  // Format cluster size data for bar chart
  const formatClusterSizeData = (data?: ClusteringData, k: 'k_3' | 'k_4' = 'k_3') => {
    if (!data || !data.clustering_results || !data.clustering_results[k]) return [];
    
    const clusterNames = getClusterNames(k);
    return data.clustering_results[k].clusters.map((cluster, index) => ({
      cluster: clusterNames[index] || `Group ${cluster.cluster_id}`,
      size: cluster.size
    }));
  };

  // Get meaningful cluster names based on business context
  const getClusterNames = (k: 'k_3' | 'k_4') => {
    if (k === 'k_3') {
      return ['Traditional Businesses', 'Innovation Leaders', 'Moderate SMEs'];
    } else {
      return ['Conservative Enterprises', 'Digital Adopters', 'Steady Growth Firms', 'Innovation Champions'];
    }
  };

  const pcaData = formatPcaData(data);
  const clusterSizeData = formatClusterSizeData(data, selectedK);
  
  // Create radar chart data from cluster profiles
  const getClusterProfileVariables = (data?: ClusteringData, k: 'k_3' | 'k_4' = 'k_3') => {
    if (!data || !data.clustering_results || !data.clustering_results[k] || !data.clustering_results[k].clusters[0]) 
      return [];
      
    return Object.keys(data.clustering_results[k].clusters[0].profile);
  };

  const clusterProfileVariables = getClusterProfileVariables(data, selectedK);
  
  if (loading) {
    return (
      <Layout title="Clustering Analysis">
        <LoadingSpinner message="Loading clustering data..." />
      </Layout>
    );
  }

  // Custom tooltip for cluster visualization
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const clusterNames = getClusterNames(selectedK);
      const clusterName = clusterNames[payload[0].payload.cluster] || `Group ${payload[0].payload.cluster}`;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="text-sm font-medium text-gray-900">{clusterName}</p>
          <p className="text-xs text-gray-600">Digital Readiness: {payload[0].value.toFixed(2)}</p>
          <p className="text-xs text-gray-600">Business Performance: {payload[1].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Cluster colors with better contrast
  const clusterColors = ['#F59E0B', '#10B981', '#8B5CF6', '#3B82F6'];

  return (
    <Layout title="Clustering Analysis">
      <div className="space-y-6 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <Tabs defaultValue="visualization" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visualization">Cluster Visualization</TabsTrigger>
            <TabsTrigger value="analysis">Cluster Analysis</TabsTrigger>
            <TabsTrigger value="differences">Cluster Differences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Business Cluster Visualization</h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Understanding the Visualization</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  This scatter plot shows how businesses cluster based on their characteristics using Principal Component Analysis (PCA). 
                  Each point represents a business, and businesses with similar traits are grouped together and colored the same.
                  The two axes represent the most important factors that distinguish different types of businesses:
                </p>
                <ul className="text-blue-800 text-sm mt-2 ml-4 space-y-1">
                  <li>• <strong>Digital Readiness:</strong> How well businesses adopt and use technology</li>
                  <li>• <strong>Business Performance:</strong> Overall business capabilities and growth orientation</li>
                </ul>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 80, left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Digital Readiness" 
                      domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                      label={{ value: 'Digital Readiness', position: 'insideBottom', offset: -10 }}
                      tickFormatter={value => typeof value === 'number' ? value.toFixed(1) : value}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Business Performance" 
                      domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                      label={{ value: 'Business Performance', angle: -90, position: 'left'}}
                      tickFormatter={value => typeof value === 'number' ? value.toFixed(1) : value}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center" 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                    {[...new Set(pcaData.map(item => item.cluster))].map(cluster => {
                      const clusterNames = getClusterNames(selectedK);
                      const clusterName = clusterNames[Number(cluster)] || `Group ${cluster}`;
                      return (
                        <Scatter 
                          key={cluster} 
                          name={clusterName}
                          data={pcaData.filter(item => item.cluster === cluster)} 
                          fill={clusterColors[Number(cluster) % clusterColors.length]}
                        />
                      );
                    })}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              {data?.visualization?.explained_variance_ratio && (
                <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Technical Note:</strong> This visualization captures {((data.visualization.explained_variance_ratio[0] + data.visualization.explained_variance_ratio[1]) * 100).toFixed(1)}% 
                  of the total variation in the data (Digital Readiness: {(data.visualization.explained_variance_ratio[0] * 100).toFixed(1)}%, 
                  Business Performance: {(data.visualization.explained_variance_ratio[1] * 100).toFixed(1)}%)
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Business Cluster Analysis</h2>
              
              <Tabs value={selectedK} onValueChange={(value) => setSelectedK(value as 'k_3' | 'k_4')}>
                <TabsList className="mb-4">
                  <TabsTrigger value="k_4">4 Business Types</TabsTrigger>
                </TabsList>
                
                <TabsContent value="k_4" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Type Distribution (4 Groups)</CardTitle>
                      <p className="text-sm text-gray-600">Number of businesses in each category</p>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={clusterSizeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="cluster" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              fontSize={12}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="size" name="Number of Businesses" fill="#F59E0B" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Type Characteristics (4 Groups)</CardTitle>
                      <p className="text-sm text-gray-600">Average scores for each business characteristic by group</p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Characteristic</th>
                              {data?.clustering_results?.k_4?.clusters.map((cluster, index) => {
                                const clusterNames = getClusterNames('k_4');
                                return (
                                  <th key={cluster.cluster_id} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {clusterNames[index]}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {clusterProfileVariables.map((variable) => (
                              <tr key={variable}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </td>
                                {data?.clustering_results?.k_4?.clusters.map((cluster) => (
                                  <td key={`${variable}-${cluster.cluster_id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cluster.profile[variable]?.toFixed(2)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="differences" className="space-y-6">
            <ClusterDifferencesAnalysis data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClusteringAnalysis;
