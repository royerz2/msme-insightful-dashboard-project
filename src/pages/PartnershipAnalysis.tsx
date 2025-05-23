
import React from 'react';
import Layout from '../components/layout/Layout';
import { useApiData } from '../hooks/useApiData';
import { apiEndpoints } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { PartnershipAnalysisData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PartnershipAnalysis: React.FC = () => {
  const { data, loading, error, useDummyData } = useApiData<PartnershipAnalysisData>(apiEndpoints.partnershipAnalysis);

  // Format partnership distribution data for pie chart
  const formatDistributionData = (data?: PartnershipAnalysisData, key: string = 'double_partnership_dp') => {
    if (!data || !data.partnership_distribution || !data.partnership_distribution[key]) return [];
    
    return data.partnership_distribution[key].labels.map((label, index) => ({
      name: label,
      value: data.partnership_distribution[key].values[index],
      percentage: data.partnership_distribution[key].percentages[index]
    }));
  };

  // Format partnership impact data for bar chart
  const formatImpactData = (data?: PartnershipAnalysisData, variable: string = 'AU') => {
    if (!data || !data.partnership_impact || !data.partnership_impact.double_partnership_dp || !data.partnership_impact.double_partnership_dp[variable]) 
      return [];
      
    return data.partnership_impact.double_partnership_dp[variable].map(item => ({
      partnership: item.partnership_type,
      score: item.mean_score,
      count: item.count
    }));
  };

  const doublePartnershipData = formatDistributionData(data, 'double_partnership_dp');
  const triplePartnershipData = formatDistributionData(data, 'triple_partnership_tp');
  const partnershipImpactData = formatImpactData(data, 'AU');
  
  // Colors for partnership types
  const PARTNERSHIP_COLORS = ['#94A3B8', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <Layout title="Partnership Analysis">
        <LoadingSpinner message="Loading partnership analysis data..." />
      </Layout>
    );
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-xs">{`Count: ${payload[0].value}`}</p>
          <p className="text-xs">{`Percentage: ${payload[0].payload.percentage.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout title="Partnership Analysis">
      <div className="space-y-6 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Double Partnership Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={doublePartnershipData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {doublePartnershipData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PARTNERSHIP_COLORS[index % PARTNERSHIP_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Distribution of MSMEs engaged in double partnerships (MSME with one other entity)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Triple Partnership Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={triplePartnershipData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {triplePartnershipData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PARTNERSHIP_COLORS[index % PARTNERSHIP_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Distribution of MSMEs engaged in triple partnerships (MSME with two other entities)
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Impact on Performance (AU)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={partnershipImpactData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="partnership" 
                    angle={-45} 
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 7]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="AU Performance Score" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Comparison of performance scores (AU) across different partnership types
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PartnershipAnalysis;
