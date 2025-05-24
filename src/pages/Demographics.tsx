
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
          <h3 className="text-xl font-bold mb-4 text-gray-900">Cross-tabulation Analysis</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gender vs Position */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-800">Gender vs Position</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
                      {data.cross_tabulations.gender_vs_position.columns.map((col) => (
                        <th key={col} className="border border-gray-300 px-4 py-2 text-center">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.cross_tabulations.gender_vs_position.index.map((row, rowIndex) => (
                      <tr key={row} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{row}</td>
                        {data.cross_tabulations.gender_vs_position.values[rowIndex].map((value, colIndex) => (
                          <td key={colIndex} className="border border-gray-300 px-4 py-2 text-center">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Education vs Business */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-800">Education vs Business Field</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Education</th>
                      {data.cross_tabulations.education_vs_business.columns.map((col) => (
                        <th key={col} className="border border-gray-300 px-4 py-2 text-center">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.cross_tabulations.education_vs_business.index.map((row, rowIndex) => (
                      <tr key={row} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{row}</td>
                        {data.cross_tabulations.education_vs_business.values[rowIndex].map((value, colIndex) => (
                          <td key={colIndex} className="border border-gray-300 px-4 py-2 text-center">{value}</td>
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
