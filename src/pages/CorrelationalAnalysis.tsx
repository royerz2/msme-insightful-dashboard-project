
import React from 'react';
import Layout from '../components/layout/Layout';
import { useApiData } from '../hooks/useApiData';
import { apiEndpoints } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { CorrelationalAnalysisData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap';

const CorrelationalAnalysis: React.FC = () => {
  const { data, loading, error, useDummyData } = useApiData<CorrelationalAnalysisData>(apiEndpoints.correlationalAnalysis);

  if (loading) {
    return (
      <Layout title="Correlational Analysis">
        <LoadingSpinner message="Loading correlation data..." />
      </Layout>
    );
  }

  return (
    <Layout title="Correlational Analysis">
      <div className="space-y-6 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Correlation Analysis Overview</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 text-sm leading-relaxed">
              This analysis shows how different business factors relate to each other. Correlation values range from -1 to +1:
            </p>
            <ul className="text-blue-800 text-sm mt-2 ml-4 space-y-1">
              <li>• <strong>Positive correlations (0 to +1):</strong> When one factor increases, the other tends to increase</li>
              <li>• <strong>Negative correlations (-1 to 0):</strong> When one factor increases, the other tends to decrease</li>
              <li>• <strong>Values near 0:</strong> Little to no relationship between factors</li>
              <li>• <strong>Values above 0.5 or below -0.5:</strong> Moderate to strong relationships</li>
            </ul>
          </div>
        </div>

        {data?.it_survey_correlation && (
          <Card>
            <CardHeader>
              <CardTitle>IT Adoption vs Business Performance Correlation</CardTitle>
              <p className="text-sm text-gray-600">
                How technology adoption correlates with various business performance indicators
              </p>
            </CardHeader>
            <CardContent>
              <CorrelationHeatmap
                rowVariables={data.it_survey_correlation.it_variables || []}
                columnVariables={data.it_survey_correlation.survey_variables}
                matrix={data.it_survey_correlation.matrix}
                title="Technology Adoption Impact on Business Performance"
              />
            </CardContent>
          </Card>
        )}

        {data?.partnership_survey_correlation && (
          <Card>
            <CardHeader>
              <CardTitle>Partnership Strategy vs Business Performance Correlation</CardTitle>
              <p className="text-sm text-gray-600">
                How partnership strategies correlate with various business performance indicators
              </p>
            </CardHeader>
            <CardContent>
              {data.partnership_survey_correlation.message ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md">
                  <p className="font-semibold">⚠️ Limited Data Available</p>
                  <p className="text-sm">{data.partnership_survey_correlation.message}</p>
                </div>
              ) : (
                <CorrelationHeatmap
                  rowVariables={data.partnership_survey_correlation.partnership_variables || []}
                  columnVariables={data.partnership_survey_correlation.survey_variables}
                  matrix={data.partnership_survey_correlation.matrix}
                  title="Partnership Strategy Impact on Business Performance"
                />
              )}
            </CardContent>
          </Card>
        )}

        {!data?.it_survey_correlation && !data?.partnership_survey_correlation && !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No correlation data available at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CorrelationalAnalysis;
