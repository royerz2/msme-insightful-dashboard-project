import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useApiData } from '../hooks/useApiData';
import { apiEndpoints } from '../utils/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { ComparativeAnalysisData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Variable name mappings
const VARIABLE_NAMES: { [key: string]: string } = {
  'AU': 'Autonomy',
  'INN': 'Innovation',
  'RT': 'Risk Taking',
  'PA': 'Proactiveness',
  'CA': 'Competitive Aggressiveness',
  'OEO': 'Organizational Entrepreneurial Orientation',
  'OPC': 'Organizational Performance and Capabilities',
  'RC': 'Resource Capabilities',
  'CCC': 'Customer and Channel Capabilities',
  'ORC': 'Operational Capabilities',
  'STC': 'Strategic Capabilities',
  'CMC': 'Change Management Capabilities',
  'OEC': 'Organizational Excellence Capabilities',
  'SU': 'Sustainability',
  'SY': 'Synergy',
  'CO': 'Collaboration',
  'REO': 'Resource Efficiency and Optimization',
  'OSRS': 'Organizational Structure and Resource Sharing',
  'IA': 'Innovation Adoption',
  'II': 'Innovation Implementation'
};

// Custom tooltip components
const GenderTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold">{VARIABLE_NAMES[label] || label}</p>
        <p className="text-blue-600">Male: <span className="font-bold">{payload[0].value.toFixed(2)}</span></p>
        <p className="text-pink-600">Female: <span className="font-bold">{payload[1].value.toFixed(2)}</span></p>
        {payload[0].payload.significant && (
          <p className="text-sm text-red-600 mt-1">* Statistically significant difference</p>
        )}
      </div>
    );
  }
  return null;
};

const AgeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-blue-600">
          {VARIABLE_NAMES[payload[0].name.replace(' Mean', '')] || payload[0].name}: 
          <span className="font-bold"> {payload[0].value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const BusinessTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-green-600">
          {VARIABLE_NAMES[payload[0].name.replace(' Mean', '')] || payload[0].name}: 
          <span className="font-bold"> {payload[0].value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ComparativeAnalysis: React.FC = () => {
  const [selectedVariable, setSelectedVariable] = useState('AU');
  const { data, loading, error, useDummyData } = useApiData<ComparativeAnalysisData>(apiEndpoints.comparativeAnalysis);

  const formatGenderData = (data?: ComparativeAnalysisData) => {
    if (!data || !data.gender) return [];
    
    const variables = Object.keys(data.gender);
    return variables.map(variable => ({
      variable,
      male: data.gender[variable].male_mean,
      female: data.gender[variable].female_mean,
      significant: data.gender[variable].significant,
      pValue: data.gender[variable].p_value
    }));
  };

  const formatAgeData = (data?: ComparativeAnalysisData, variable: string = 'AU') => {
    if (!data || !data.age_groups || !data.age_groups[variable]) return [];
    return data.age_groups[variable].map(item => ({
      ageGroup: item.age_group,
      mean: item.mean,
      std: item.std,
      count: item.count
    }));
  };

  const formatBusinessData = (data?: ComparativeAnalysisData, variable: string = 'AU') => {
    if (!data || !data.business_fields || !data.business_fields[variable]) return [];
    return data.business_fields[variable].map(item => ({
      business: item.business_field,
      mean: item.mean,
      std: item.std,
      count: item.count
    }));
  };

  const genderData = formatGenderData(data);
  const ageData = formatAgeData(data, selectedVariable);
  const businessData = formatBusinessData(data, selectedVariable);
  
  const variables = data?.gender ? Object.keys(data.gender) : [];

  if (loading) {
    return (
      <Layout title="Comparative Analysis">
        <LoadingSpinner message="Loading comparative analysis data..." />
      </Layout>
    );
  }

  return (
    <Layout title="Comparative Analysis">
      <div className="space-y-6 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Gender Comparison</h2>
          <p className="mb-4 text-gray-600">
            Comparison of survey variable means between male and female respondents. 
            Statistically significant differences (p &lt; 0.05) are marked with an asterisk (*).
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData} layout="vertical" margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 7]} />
                <YAxis dataKey="variable" type="category" width={80} />
                <Tooltip content={<GenderTooltip />} />
                <Legend />
                <Bar dataKey="male" name="Male" fill="#3B82F6" />
                <Bar dataKey="female" name="Female" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Variable Analysis by Segment</h2>
          <div className="mb-4">
            <label className="mr-2 font-medium">Select Variable:</label>
            <select 
              value={selectedVariable} 
              onChange={(e) => setSelectedVariable(e.target.value)}
              className="border rounded-md px-2 py-1 bg-white"
            >
              {variables.map(variable => (
                <option key={variable} value={variable}>
                  {VARIABLE_NAMES[variable] || variable}
                </option>
              ))}
            </select>
          </div>

          <Tabs defaultValue="age">
            <TabsList>
              <TabsTrigger value="age">Age Groups</TabsTrigger>
              <TabsTrigger value="business">Business Fields</TabsTrigger>
            </TabsList>
            <TabsContent value="age" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Age Group Comparison: {VARIABLE_NAMES[selectedVariable] || selectedVariable}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ageGroup" />
                        <YAxis domain={[0, 7]} />
                        <Tooltip content={<AgeTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="mean" 
                          name={`${selectedVariable} Mean`} 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="business" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Field Comparison: {VARIABLE_NAMES[selectedVariable] || selectedVariable}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={businessData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="business" />
                        <YAxis domain={[0, 7]} />
                        <Tooltip content={<BusinessTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="mean" 
                          name={`${selectedVariable} Mean`} 
                          fill="#10B981" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
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

export default ComparativeAnalysis;
