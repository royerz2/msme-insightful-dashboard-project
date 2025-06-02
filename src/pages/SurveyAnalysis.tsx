import React from 'react';
import Layout from '../components/layout/Layout';
import BarChart from '../components/charts/BarChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useApiData } from '../hooks/useApiData';
import { SurveyAnalysisData } from '../types';
import { apiEndpoints } from '../utils/api';

const SurveyAnalysis: React.FC = () => {
  const { data, loading, error } = useApiData<SurveyAnalysisData>(apiEndpoints.surveyAnalysis);

  if (loading) {
    return (
      <Layout title="Survey Analysis">
        <LoadingSpinner message="Loading survey analysis data..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Survey Analysis">
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Survey Analysis">
        <ErrorMessage message="No data available" />
      </Layout>
    );
  }

  // Transform statistics for chart display
  const statisticsData = Object.entries(data.basic_statistics).map(([variable, stats]) => ({
    variable,
    mean: parseFloat(stats.mean.toFixed(2)),
    median: stats.median,
    std: parseFloat(stats.std.toFixed(2)),
  }));

  return (
    <Layout title="Survey Analysis">
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Survey Variables Analysis</h2>
          <p className="opacity-90">
            Statistical analysis of survey responses across all variables
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Basic Statistics Overview</h3>
          <div className="h-[500px]">
            <BarChart
              data={statisticsData}
              title="Mean Values by Survey Variable"
              xAxisKey="variable"
              yAxisKey="mean"
              color="#10B981"
            />
          </div>
        </div>

        {/* Detailed Statistics Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Detailed Statistics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Variable</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Mean</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Median</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Std Dev</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Min</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Max</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.basic_statistics).map(([variable, stats]) => (
                  <tr key={variable} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{variable}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{stats.mean.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{stats.median.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{stats.std.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{stats.min}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{stats.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Correlations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Top Variable Correlations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.top_correlations.slice(0, 9).map((correlation, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-2 min-w-0">
                    <p className="font-semibold text-gray-900" style={{ wordBreak: 'break-word' }}>
                      {correlation.var1} ↔ {correlation.var2}
                    </p>
                    <p className="text-sm text-gray-600">Correlation</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-primary">
                      {correlation.correlation.toFixed(3)}
                    </p>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${Math.abs(correlation.correlation) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Highest Scoring Variables</h3>
            <div className="space-y-3">
              {statisticsData
                .sort((a, b) => b.mean - a.mean)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={item.variable} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-900">#{index + 1} {item.variable}</span>
                    <span className="text-lg font-bold text-green-600">{item.mean}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Most Variable Responses</h3>
            <div className="space-y-3">
              {statisticsData
                .sort((a, b) => b.std - a.std)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={item.variable} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium text-gray-900">#{index + 1} {item.variable}</span>
                    <span className="text-lg font-bold text-orange-600">{item.std}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SurveyAnalysis;
