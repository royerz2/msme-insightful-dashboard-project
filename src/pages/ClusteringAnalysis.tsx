
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
  const selectedK = 'k_3'; // Fixed to k=3
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
  const formatClusterSizeData = (data?: ClusteringData) => {
    if (!data || !data.clustering_results || !data.clustering_results.k_3) return [];
    
    const clusterNames = ['Traditional Businesses', 'Innovation Leaders', 'Moderate SMEs'];
    return data.clustering_results.k_3.clusters.map((cluster, index) => ({
      cluster: clusterNames[index] || `Group ${cluster.cluster_id}`,
      size: cluster.size
    }));
  };

  // Get meaningful cluster names for k=3
  const getClusterNames = () => {
    return ['Traditional Businesses', 'Innovation Leaders', 'Moderate SMEs'];
  };

  const pcaData = formatPcaData(data);
  const clusterSizeData = formatClusterSizeData(data);
  
  // Create radar chart data from cluster profiles
  const getClusterProfileVariables = (data?: ClusteringData) => {
    if (!data || !data.clustering_results || !data.clustering_results.k_3 || !data.clustering_results.k_3.clusters[0]) 
      return [];
      
    return Object.keys(data.clustering_results.k_3.clusters[0].profile);
  };

  const clusterProfileVariables = getClusterProfileVariables(data);
  
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
      const clusterNames = getClusterNames();
      const clusterName = clusterNames[payload[0].payload.cluster] || `Group ${payload[0].payload.cluster}`;
      return (
        <div className="bg-white p-3 border border-maastricht-blue/20 shadow-lg rounded-lg">
          <p className="text-sm font-medium text-maastricht-blue">{clusterName}</p>
          <p className="text-xs text-maastricht-gray">Digital Readiness: {payload[0].value.toFixed(2)}</p>
          <p className="text-xs text-maastricht-gray">Business Performance: {payload[1].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Cluster colors with Maastricht color palette
  const clusterColors = ['#0B5394', '#0EA5E9', '#22D3EE'];

  return (
    <Layout title="Clustering Analysis">
      <div className="space-y-6 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <Tabs defaultValue="visualization" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-maastricht-light-gray">
            <TabsTrigger value="visualization" className="data-[state=active]:bg-maastricht-blue data-[state=active]:text-white">Cluster Visualization</TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-maastricht-blue data-[state=active]:text-white">Cluster Analysis</TabsTrigger>
            <TabsTrigger value="differences" className="data-[state=active]:bg-maastricht-blue data-[state=active]:text-white">Cluster Differences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="space-y-6">
            <Card className="maastricht-card">
              <CardHeader className="bg-gradient-to-r from-maastricht-blue to-maastricht-teal">
                <CardTitle className="text-white">Business Cluster Visualization (3 Groups)</CardTitle>
                <div className="text-sm text-white/90 bg-white/10 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-white mb-2">Understanding the Visualization</h4>
                  <p className="mb-2">
                    This scatter plot shows how businesses cluster based on their characteristics using Principal Component Analysis (PCA). 
                    Each point represents a business, and businesses with similar traits are grouped together and colored the same.
                    The two axes represent the most important factors that distinguish different types of businesses:
                  </p>
                  <ul className="text-white/90 space-y-1 ml-4">
                    <li>• <strong>Digital Readiness:</strong> How well businesses adopt and use technology</li>
                    <li>• <strong>Business Performance:</strong> Overall business capabilities and growth orientation</li>
                  </ul>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 80, left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Digital Readiness" 
                        domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                        label={{ value: 'Digital Readiness', position: 'insideBottom', offset: -10 }}
                        tickFormatter={value => typeof value === 'number' ? value.toFixed(1) : value}
                        stroke="#374151"
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Business Performance" 
                        domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                        label={{ value: 'Business Performance', angle: -90, position: 'left'}}
                        tickFormatter={value => typeof value === 'number' ? value.toFixed(1) : value}
                        stroke="#374151"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        align="center" 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      {[...new Set(pcaData.map(item => item.cluster))].map(cluster => {
                        const clusterNames = getClusterNames();
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
                  <div className="mt-4 text-sm text-maastricht-gray bg-maastricht-light-gray p-3 rounded-lg">
                    <strong>Technical Note:</strong> This visualization captures {((data.visualization.explained_variance_ratio[0] + data.visualization.explained_variance_ratio[1]) * 100).toFixed(1)}% 
                    of the total variation in the data (Digital Readiness: {(data.visualization.explained_variance_ratio[0] * 100).toFixed(1)}%, 
                    Business Performance: {(data.visualization.explained_variance_ratio[1] * 100).toFixed(1)}%)
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="maastricht-card">
              <CardHeader className="bg-gradient-to-r from-maastricht-blue to-maastricht-teal">
                <CardTitle className="text-white">Business Cluster Analysis (3 Groups)</CardTitle>
                <div className="text-sm text-white/90">Number of businesses in each category and their characteristics</div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Card className="border-maastricht-blue/20">
                  <CardHeader>
                    <CardTitle className="text-maastricht-blue">Business Type Distribution</CardTitle>
                    <p className="text-sm text-maastricht-gray">Number of businesses in each category</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clusterSizeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis 
                            dataKey="cluster" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={12}
                            stroke="#374151"
                          />
                          <YAxis stroke="#374151" />
                          <Tooltip />
                          <Bar dataKey="size" name="Number of Businesses" fill="#0B5394" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-maastricht-blue/20">
                  <CardHeader>
                    <CardTitle className="text-maastricht-blue">Business Type Characteristics</CardTitle>
                    <p className="text-sm text-maastricht-gray">Average scores for each business characteristic by group</p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-maastricht-blue/20">
                        <thead>
                          <tr className="bg-maastricht-light-gray">
                            <th className="px-6 py-3 text-left text-xs font-medium text-maastricht-blue uppercase tracking-wider">Characteristic</th>
                            {data?.clustering_results?.k_3?.clusters.map((cluster, index) => {
                              const clusterNames = getClusterNames();
                              return (
                                <th key={cluster.cluster_id} className="px-6 py-3 text-left text-xs font-medium text-maastricht-blue uppercase tracking-wider">
                                  {clusterNames[index]}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-maastricht-blue/10">
                          {clusterProfileVariables.map((variable, idx) => (
                            <tr key={variable} className={idx % 2 === 0 ? 'bg-white' : 'bg-maastricht-light-gray/30'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-maastricht-blue">
                                {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </td>
                              {data?.clustering_results?.k_3?.clusters.map((cluster) => (
                                <td key={`${variable}-${cluster.cluster_id}`} className="px-6 py-4 whitespace-nowrap text-sm text-maastricht-gray">
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
              </CardContent>
            </Card>
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
