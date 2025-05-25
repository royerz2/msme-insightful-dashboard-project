
import React from 'react';
import { ClusteringData, AnovaResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ClusterBoxPlot from './ClusterBoxPlot';

interface ClusterDifferencesAnalysisProps {
  data?: ClusteringData;
}

const ClusterDifferencesAnalysis: React.FC<ClusterDifferencesAnalysisProps> = ({ data }) => {
  const anovaResults = data?.clustering_results?.k_3?.anova_results || [];

  const formatPValue = (pValue: number | null): string => {
    if (pValue === null || pValue === undefined) return 'N/A';
    if (pValue === 0) return '< 0.001';
    if (pValue < 0.001) return '< 0.001';
    if (pValue < 0.01) return pValue.toFixed(4);
    return pValue.toFixed(3);
  };

  const formatFStatistic = (fStat: number | null): string => {
    if (fStat === null || fStat === undefined) return 'N/A';
    return fStat.toFixed(3);
  };

  const significantCount = anovaResults.filter(r => r.significant && !r.message).length;
  const totalCount = anovaResults.filter(r => !r.message).length;

  return (
    <div className="space-y-6">
      {/* Box Plot Visualization */}
      <ClusterBoxPlot data={data} />

      <Card>
        <CardHeader>
          <CardTitle>Statistical Differences Analysis (ANOVA)</CardTitle>
          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Understanding ANOVA Results</h4>
            <p className="mb-2">
              <strong>ANOVA (Analysis of Variance)</strong> tests whether there are statistically significant 
              differences between the three business clusters for each survey variable.
            </p>
            <ul className="text-blue-800 space-y-1 ml-4">
              <li>• <strong>F-Statistic:</strong> Measures the ratio of variance between clusters to variance within clusters. Higher values suggest greater differences between clusters.</li>
              <li>• <strong>P-Value:</strong> Probability that the observed differences occurred by chance. Values below 0.05 indicate statistically significant differences.</li>
              <li>• <strong>Significant Difference:</strong> Variables marked as "Yes" show meaningful differences across the three business types.</li>
            </ul>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Survey Variable</TableHead>
                  <TableHead className="font-semibold text-center">F-Statistic</TableHead>
                  <TableHead className="font-semibold text-center">P-Value</TableHead>
                  <TableHead className="font-semibold text-center">Significant Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anovaResults.map((result: AnovaResult, index: number) => (
                  <TableRow 
                    key={index}
                    className={result.significant ? 'bg-green-50 border-l-4 border-l-green-500' : ''}
                  >
                    <TableCell className="font-medium">
                      {result.variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.message ? (
                        <span className="text-gray-500 text-sm">{result.message}</span>
                      ) : (
                        formatFStatistic(result.f_statistic)
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.message ? (
                        <span className="text-gray-500">-</span>
                      ) : (
                        <span className={result.p_value !== null && result.p_value < 0.05 ? 'font-semibold text-green-700' : ''}>
                          {formatPValue(result.p_value)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.message ? (
                        <Badge variant="secondary">Error</Badge>
                      ) : (
                        <Badge variant={result.significant ? "default" : "secondary"}>
                          {result.significant ? "Yes" : "No"}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {anovaResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ANOVA results available for K=3 clustering.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalCount}
              </div>
              <div className="text-sm text-gray-600">Variables Analyzed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {significantCount}
              </div>
              <div className="text-sm text-gray-600">Significant Differences</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-600">
                {totalCount - significantCount}
              </div>
              <div className="text-sm text-gray-600">No Significant Difference</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalCount > 0 ? ((significantCount / totalCount) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Significance Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClusterDifferencesAnalysis;
