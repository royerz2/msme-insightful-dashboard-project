
import React from 'react';
import Layout from '../components/layout/Layout';
import PieChart from '../components/charts/PieChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useApiData } from '../hooks/useApiData';
import { DemographicsData } from '../types';
import { apiEndpoints } from '../utils/api';

const Demographics: React.FC = () => {
  const { data, loading, error } = useApiData<DemographicsData>(apiEndpoints.demographics);

  if (loading) {
    return (
      <Layout title="Demographics Analysis">
        <LoadingSpinner message="Loading demographics data..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Demographics Analysis">
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Demographics Analysis">
        <ErrorMessage message="No data available" />
      </Layout>
    );
  }

  const createChartData = (distribution: any) => {
    return distribution.labels.map((label: string, index: number) => ({
      name: label,
      value: distribution.values[index],
      percentage: distribution.percentages[index],
    }));
  };

  const distributionCharts = [
    { key: 'gender', title: 'Gender Distribution', data: createChartData(data.distributions.gender) },
    { key: 'respondent_age', title: 'Age Distribution', data: createChartData(data.distributions.respondent_age) },
    { key: 'education', title: 'Education Level', data: createChartData(data.distributions.education) },
    { key: 'position', title: 'Position in Business', data: createChartData(data.distributions.position) },
    { key: 'business_field', title: 'Business Field', data: createChartData(data.distributions.business_field) },
    { key: 'business_age', title: 'Business Age', data: createChartData(data.distributions.business_age) },
  ];

  return (
    <Layout title="Demographics Analysis">
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Demographics Overview</h2>
          <p className="opacity-90">
            Comprehensive breakdown of survey respondent characteristics
          </p>
        </div>

        {/* Distribution Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {distributionCharts.map((chart) => (
            <div key={chart.key} className="bg-white rounded-lg shadow-lg p-4">
              <div className="h-96">
                <PieChart 
                  data={chart.data} 
                  title={chart.title}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Cross-tabulations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Cross-tabulation Analysis</h3>
          
          <div className="space-y-8">
            {/* Gender vs Position */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Gender vs Position in Business
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="px-6 py-3 text-left font-semibold">Gender</th>
                      {data.cross_tabulations.gender_vs_position.columns.map((col) => (
                        <th key={col} className="px-4 py-3 text-center font-semibold text-sm">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.cross_tabulations.gender_vs_position.index.map((row, rowIndex) => (
                      <tr key={row} className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                        <td className="px-6 py-4 font-semibold text-gray-800 border-r border-gray-200">{row}</td>
                        {data.cross_tabulations.gender_vs_position.values[rowIndex].map((value, colIndex) => (
                          <td key={colIndex} className="px-4 py-4 text-center text-gray-700 font-medium">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Education vs Business */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                Education Level vs Business Field
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="px-6 py-3 text-left font-semibold">Education Level</th>
                      {data.cross_tabulations.education_vs_business.columns.map((col) => (
                        <th key={col} className="px-4 py-3 text-center font-semibold text-sm">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.cross_tabulations.education_vs_business.index.map((row, rowIndex) => (
                      <tr key={row} className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50 transition-colors`}>
                        <td className="px-6 py-4 font-semibold text-gray-800 border-r border-gray-200">{row}</td>
                        {data.cross_tabulations.education_vs_business.values[rowIndex].map((value, colIndex) => (
                          <td key={colIndex} className="px-4 py-4 text-center text-gray-700 font-medium">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Demographics;
