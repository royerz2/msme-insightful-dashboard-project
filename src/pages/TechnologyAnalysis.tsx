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

  const techStatistics = formatTechStatistics(data);
  const techByGender = formatTechByGender(data);
  
  if (loading) {
    return (
      <Layout title="Technology Analysis">
        <LoadingSpinner message="Loading technology analysis data..." />
      </Layout>
    );
  }

  // Get color for correlation value
  const getCorrelationColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-600 text-white'; // Strong positive
    if (value >= 0.5) return 'bg-green-500 text-white'; // Moderate to strong positive
    if (value >= 0.3) return 'bg-green-400'; // Moderate positive
    if (value >= 0.1) return 'bg-green-200'; // Weak positive
    if (value <= -0.7) return 'bg-red-600 text-white'; // Strong negative
    if (value <= -0.5) return 'bg-red-500 text-white'; // Moderate to strong negative
    if (value <= -0.3) return 'bg-red-400'; // Moderate negative
    if (value <= -0.1) return 'bg-red-200'; // Weak negative
    return 'bg-gray-200';  // Very weak or no correlation
  };

  // Custom tooltip for Technology Adoption Overview
  const TechOverviewTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Mean Adoption Score : <span className="font-bold">{payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
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
              <BarChart data={techStatistics} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="technology" 
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  tickFormatter={value => typeof value === 'number' ? value.toFixed(2) : value}
                />
                <YAxis domain={[0, 7]} />
                <Tooltip content={<TechOverviewTooltip />} />
                <Legend verticalAlign="top" align="center" />
                <Bar dataKey="mean" name="Mean Adoption Score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Tabs defaultValue="demographics">
          <TabsList>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
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
                      <YAxis 
                        dataKey="technology" 
                        type="category" 
                        tick={{ fontSize: 11 }}
                        width={120}
                      />
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default TechnologyAnalysis;
