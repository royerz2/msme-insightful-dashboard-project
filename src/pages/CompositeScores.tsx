import React from 'react';
import Layout from '../components/layout/Layout';
import CompositeMetricCard from '../components/common/CompositeMetricCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap';
import { useApiData } from '../hooks/useApiData';
import { apiEndpoints } from '../utils/api';

// Define the structure of the composite scores data
interface Scores {
  EO_Score?: { mean: number; std: number };
  Capabilities_Score?: { mean: number; std: number };
  Collaboration_Score?: { mean: number; std: number };
  IT_Score?: { mean: number; std: number };
}

// Define the structure for correlation data
interface CorrelationData {
  variables: string[];
  matrix: number[][];
}

// Define the main data structure for the composite scores page
interface CompositeScoresData {
  scores: Scores;
  correlations: CorrelationData;
  gpt_analysis: string;
}

const CompositeScores: React.FC = () => {
  const { data, loading, error, useDummyData } = useApiData<CompositeScoresData>(apiEndpoints.compositeScores);

  if (loading) {
    return (
      <Layout title="Composite Scores Analysis">
        <LoadingSpinner message="Loading composite scores data..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Composite Scores Analysis">
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Composite Scores Analysis">
        <ErrorMessage message="No data available" />
      </Layout>
    );
  }

  const scoreCards = [
    {
      title: 'EO Score',
      value: data.scores.EO_Score?.mean?.toFixed(2) || 'N/A',
      subtitle: `Std: ${data.scores.EO_Score?.std?.toFixed(2) || 'N/A'}`,
      description: 'Entrepreneurial Orientation composite score'
    },
    {
      title: 'Capabilities Score',
      value: data.scores.Capabilities_Score?.mean?.toFixed(2) || 'N/A',
      subtitle: `Std: ${data.scores.Capabilities_Score?.std?.toFixed(2) || 'N/A'}`,
      description: 'Organizational capabilities composite score'
    },
    {
      title: 'Collaboration Score',
      value: data.scores.Collaboration_Score?.mean?.toFixed(2) || 'N/A',
      subtitle: `Std: ${data.scores.Collaboration_Score?.std?.toFixed(2) || 'N/A'}`,
      description: 'Collaboration effectiveness composite score'
    },
    {
      title: 'IT Score',
      value: data.scores.IT_Score?.mean?.toFixed(2) || 'N/A',
      subtitle: `Std: ${data.scores.IT_Score?.std?.toFixed(2) || 'N/A'}`,
      description: 'Information Technology adoption composite score'
    }
  ];

  return (
    <Layout title="Composite Scores Analysis">
      <div className="space-y-6 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Composite Scores Overview</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Analysis of key composite scores derived from survey responses
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scoreCards.map((card, index) => (
            <CompositeMetricCard
              key={index}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              description={card.description}
            />
          ))}
        </div>

        {/* GPT Insights */}
        {data.gpt_analysis && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🤖 AI Insights</h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.gpt_analysis}
              </p>
            </div>
          </div>
        )}

        {/* Correlation Matrix */}
        {data.correlations && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <CorrelationHeatmap
              rowVariables={data.correlations.variables}
              columnVariables={data.correlations.variables}
              matrix={data.correlations.matrix}
              title="Composite Scores Correlation Matrix"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CompositeScores;
