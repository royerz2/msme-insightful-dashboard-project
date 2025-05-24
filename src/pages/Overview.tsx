import React from 'react';
import Layout from '../components/layout/Layout';
import MetricCard from '../components/common/MetricCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useApiData } from '../hooks/useApiData';
import { HealthResponse, ComprehensiveReportData } from '../types';
import { apiEndpoints } from '../utils/api';
import AbbrTooltip from '../components/AbbrTooltip';

const ABBREVIATIONS = [
  'AU', 'INN', 'RT', 'PA', 'CA', 'OEO', 'OPC', 'RC', 'CCC', 'ORC', 'STC', 'CMC', 'OEC', 'SU', 'SY', 'CO', 'REO', 'OSRS', 'IA', 'II',
  'IT_SM', 'IT_CS', 'IT_PD', 'IT_DM', 'IT_KM', 'IT_SCM', 'ODTA', 'DP', 'TP', 'F&B'
];

function wrapAbbreviations(text: string) {
  const parts = text.split(/(\b[A-Z_&]{2,}\b)/g);
  return parts.map((part, i) => {
    if (ABBREVIATIONS.includes(part)) {
      return <AbbrTooltip abbr={part} key={i} />;
    }
    return part;
  });
}

const Overview: React.FC = () => {
  const { data: healthData, loading: healthLoading, error: healthError } = useApiData<HealthResponse>(apiEndpoints.health);
  const { data: reportData, loading: reportLoading, error: reportError } = useApiData<ComprehensiveReportData>(apiEndpoints.comprehensiveReport);

  const loading = healthLoading || reportLoading;
  const error = healthError || reportError;

  if (loading) {
    return (
      <Layout title="Dashboard Overview">
        <LoadingSpinner message="Loading dashboard data..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard Overview">
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  const metrics = [
    {
      title: 'Total Respondents',
      value: reportData?.sample_info.total_respondents || healthData?.total_records || 0,
      icon: '👥',
      trend: 'neutral' as const,
    },
    {
      title: 'Complete Responses',
      value: reportData?.sample_info.complete_responses || 0,
      icon: '✅',
      trend: 'up' as const,
      change: '96%',
    },
    {
      title: 'Survey Variables',
      value: reportData?.sample_info.survey_variables || 0,
      icon: '📊',
      trend: 'neutral' as const,
    },
    {
      title: 'Technology Variables',
      value: reportData?.sample_info.technology_variables || 0,
      icon: '💻',
      trend: 'neutral' as const,
    },
  ];

  return (
    <Layout title="Dashboard Overview">
      <div className="space-y-6 fade-in">
        {/* Welcome Section */}
        <div className="dashboard-gradient rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to MSME Analytics</h2>
          <p className="text-lg opacity-90">
            Comprehensive insights into Micro, Small, and Medium Enterprise data
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} data={metric} />
          ))}
        </div>

        {/* Key Findings */}
        {reportData?.key_findings && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Key Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.key_findings.map((finding, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-primary">{finding.category}</h4>
                  <p className="text-gray-700 mt-1">{wrapAbbreviations(finding.finding)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Demographics', path: '/demographics', icon: '👥', color: 'bg-blue-500' },
              { name: 'Survey Analysis', path: '/survey', icon: '📋', color: 'bg-green-500' },
              { name: 'Clustering', path: '/clustering', icon: '🎯', color: 'bg-purple-500' },
              { name: 'Technology', path: '/technology', icon: '💻', color: 'bg-orange-500' },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-2xl mb-2`}>
                  {item.icon}
                </div>
                <span className="font-medium text-gray-900">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Overview;
