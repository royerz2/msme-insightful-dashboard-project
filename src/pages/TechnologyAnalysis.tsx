import React from 'react';
import Layout from '../components/layout/Layout';
import { useApiData } from '../hooks/useApiData';
import { apiEndpoints } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { TechnologyAnalysisData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

const TechnologyAnalysis: React.FC = () => {
  const { data, loading, error, useDummyData } = useApiData<TechnologyAnalysisData>(apiEndpoints.technologyAnalysis);

  // Format tech statistics for bar chart
  const formatTechStatistics = (data?: TechnologyAnalysisData) => {
    if (!data || !data.technology_statistics) return [];
    
    return Object.entries(data.technology_statistics).map(([tech, stats]) => ({
      technology: tech,
      mean: stats.mean,
      median: stats.median,
      std: stats.std
    }));
  };

  // Format tech by gender data
  const formatTechByGender = (data?: TechnologyAnalysisData) => {
    if (!data || !data.technology_by_demographics || !data.technology_by_demographics.gender) return [];
    
    return Object.entries(data.technology_by_demographics.gender).map(([tech, values]) => ({
      technology: tech,
      male: values.male,
      female: values.female
    }));
  };

  // Format correlation data for heatmap
  const formatTechCorrelationData = (data?: TechnologyAnalysisData) => {
    if (!data || !data.technology_performance_correlation) return [];
    
    const result: { tech: string, variable: string, correlation: number }[] = [];
    
    Object.entries(data.technology_performance_correlation).forEach(([tech, correlations]) => {
      Object.entries(correlations).forEach(([variable, value]) => {
        result.push({
          tech,
          variable,
          correlation: value
        });
      });
    });
    
    return result;
  };

  const techStatistics = formatTechStatistics(data);
  const techByGender = formatTechByGender(data);
  const techCorrelations = formatTechCorrelationData(data);
  
  // Get unique technologies and performance variables for the heatmap
  const uniqueTech = [...new Set(techCorrelations.map(item => item.tech))];
  const uniqueVariables = [...new Set(techCorrelations.map(item => item.variable))];

  if (loading) {
    return (
      <Layout title="Technology Analysis">
        <LoadingSpinner message="Loading technology analysis data..." />
      </Layout>
    );
  }

  // Get color for correlation value
  const getCorrelationColor = (value: number) => {
    if (value >= 0.6) return '#10B981'; // Strong positive - green
    if (value >= 0.3) return '#60A5FA'; // Moderate positive - blue
    if (value >= 0) return '#D1D5DB';  // Weak positive - light gray
    if (value >= -0.3) return '#F59E0B'; // Weak negative - amber
    return '#EF4444'; // Strong negative - red
  };

  return (
    <Layout title="Technology Analysis">
      <div className="space-y-6 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Technology Adoption Overview</h2>
          <p className="mb-4 text-gray-600">
            Mean adoption scores for different technology variables (scale 1-7)
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techStatistics} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="technology" />
                <YAxis domain={[0, 7]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="mean" name="Mean Adoption Score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Tabs defaultValue="demographics">
          <TabsList>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="performance">Performance Correlation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Technology Adoption by Gender</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={techByGender} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 7]} />
                      <YAxis dataKey="technology" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="male" name="Male" fill="#3B82F6" />
                      <Bar dataKey="female" name="Female" fill="#EC4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Technology-Performance Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-600">
                  Correlation between technology adoption and business performance variables.
                  Higher values (green) indicate stronger positive relationships.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr>
                        <th className="border border-gray-200 bg-gray-50 px-4 py-2">Technology / Variable</th>
                        {uniqueVariables.map(variable => (
                          <th key={variable} className="border border-gray-200 bg-gray-50 px-4 py-2">
                            {variable}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueTech.map(tech => (
                        <tr key={tech}>
                          <td className="border border-gray-200 px-4 py-2 font-medium">{tech}</td>
                          {uniqueVariables.map(variable => {
                            const correlationItem = techCorrelations.find(
                              item => item.tech === tech && item.variable === variable
                            );
                            const correlation = correlationItem ? correlationItem.correlation : 0;
                            
                            return (
                              <td 
                                key={`${tech}-${variable}`} 
                                className="border border-gray-200 px-4 py-2 text-center"
                                style={{ 
                                  backgroundColor: getCorrelationColor(correlation),
                                  color: correlation >= 0.3 ? 'white' : 'black'
                                }}
                              >
                                {correlation.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Correlation strength: &lt;0.3 weak, 0.3-0.6 moderate, &gt;0.6 strong
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TechnologyAnalysis;
