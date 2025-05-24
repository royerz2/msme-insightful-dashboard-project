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

const ClusteringAnalysis: React.FC = () => {
  const [selectedK, setSelectedK] = useState<'k_3' | 'k_4'>('k_3');
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
    
    return data.clustering_results[k].clusters.map((cluster) => ({
      cluster: `Cluster ${cluster.cluster_id}`,
      size: cluster.size
    }));
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
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded">
          <p className="text-sm font-medium">Cluster: {payload[0].payload.cluster}</p>
          <p className="text-xs">x: {payload[0].value.toFixed(2)}</p>
          <p className="text-xs">y: {payload[1].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Cluster colors
  const clusterColors = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'];

  return (
    <Layout title="Clustering Analysis">
      <div className="space-y-6 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Clustering Visualization</h2>
          <p className="mb-4 text-gray-600">
            PCA visualization of clusters. Each point represents a respondent, colored by their cluster assignment.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Component 1" 
                  domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                  label={{ value: 'Component 1', position: 'bottom' }}
                  tickFormatter={value => typeof value === 'number' ? value.toFixed(2) : value}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Component 2" 
                  domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                  label={{ value: 'Component 2', angle: -90, position: 'left' }}
                  tickFormatter={value => typeof value === 'number' ? value.toFixed(2) : value}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" align="center" />
                {[...new Set(pcaData.map(item => item.cluster))].map(cluster => (
                  <Scatter 
                    key={cluster} 
                    name={`Cluster ${cluster}`} 
                    data={pcaData.filter(item => item.cluster === cluster)} 
                    fill={clusterColors[Number(cluster) % clusterColors.length]} 
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          {data?.visualization?.explained_variance_ratio && (
            <p className="mt-2 text-sm text-gray-500">
              Explained variance: 
              Component 1 ({(data.visualization.explained_variance_ratio[0] * 100).toFixed(1)}%), 
              Component 2 ({(data.visualization.explained_variance_ratio[1] * 100).toFixed(1)}%)
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Cluster Analysis</h2>
          
          <Tabs value={selectedK} onValueChange={(value) => setSelectedK(value as 'k_3' | 'k_4')}>
            <TabsList className="mb-4">
              <TabsTrigger value="k_3">K = 3 Clusters</TabsTrigger>
              <TabsTrigger value="k_4">K = 4 Clusters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="k_3" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cluster Sizes (K=3)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clusterSizeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cluster" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="size" name="Count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cluster Profiles (K=3)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable</th>
                          {data?.clustering_results?.k_3?.clusters.map((cluster) => (
                            <th key={cluster.cluster_id} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cluster {cluster.cluster_id}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clusterProfileVariables.map((variable) => (
                          <tr key={variable}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {variable}
                            </td>
                            {data?.clustering_results?.k_3?.clusters.map((cluster) => (
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
            
            <TabsContent value="k_4" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cluster Sizes (K=4)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clusterSizeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cluster" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="size" name="Count" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cluster Profiles (K=4)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable</th>
                          {data?.clustering_results?.k_4?.clusters.map((cluster) => (
                            <th key={cluster.cluster_id} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cluster {cluster.cluster_id}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clusterProfileVariables.map((variable) => (
                          <tr key={variable}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {variable}
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
      </div>
    </Layout>
  );
};

export default ClusteringAnalysis;
