
import React from 'react';
import Layout from '../components/layout/Layout';
import { useApiData } from '../hooks/useApiData';
import { apiEndpoints } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ComprehensiveReportData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Reports: React.FC = () => {
  const { data, loading, error, useDummyData } = useApiData<ComprehensiveReportData>(apiEndpoints.comprehensiveReport);

  // Format key findings by category
  const groupFindingsByCategory = (data?: ComprehensiveReportData) => {
    if (!data || !data.key_findings) return {};
    
    return data.key_findings.reduce<Record<string, string[]>>((acc, finding) => {
      if (!acc[finding.category]) {
        acc[finding.category] = [];
      }
      acc[finding.category].push(finding.finding);
      return acc;
    }, {});
  };

  const keyFindingsByCategory = groupFindingsByCategory(data);
  const categories = Object.keys(keyFindingsByCategory);

  // Prepare mock data for sample chart
  const sampleChartData = [
    { variable: 'AU', score: 6.20 },
    { variable: 'INN', score: 5.85 },
    { variable: 'RT', score: 5.65 },
    { variable: 'PA', score: 5.45 },
    { variable: 'CA', score: 5.30 },
  ];

  if (loading) {
    return (
      <Layout title="Reports">
        <LoadingSpinner message="Loading comprehensive report..." />
      </Layout>
    );
  }

  return (
    <Layout title="Reports">
      <div className="space-y-8 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-2">MSME Analytics: Executive Summary</h2>
          <p className="text-lg text-gray-600 mb-6">
            Comprehensive analysis of survey data from {data?.sample_info.total_respondents} respondents
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">{data?.sample_info.total_respondents}</div>
                <p className="text-sm text-gray-500 mt-2">Total Respondents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">{data?.sample_info.complete_responses}</div>
                <p className="text-sm text-gray-500 mt-2">Complete Responses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">{data?.sample_info.survey_variables}</div>
                <p className="text-sm text-gray-500 mt-2">Survey Variables</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">{data?.sample_info.technology_variables}</div>
                <p className="text-sm text-gray-500 mt-2">Technology Variables</p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-2xl font-semibold mb-6">Key Findings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {categories.map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {keyFindingsByCategory[category].map((finding, index) => (
                        <li key={index} className="text-gray-700">{finding}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performance Variables</CardTitle>
                  <CardDescription>Highest scoring survey variables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sampleChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="variable" />
                        <YAxis domain={[0, 7]} />
                        <Tooltip />
                        <Bar dataKey="score" name="Average Score" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Report Downloads</CardTitle>
                  <CardDescription>Download comprehensive analysis reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m-9 4V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
                    </svg>
                    Full Report (PDF)
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m-9 4V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
                    </svg>
                    Executive Summary (PDF)
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m-9 4V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
                    </svg>
                    Raw Data (CSV)
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
