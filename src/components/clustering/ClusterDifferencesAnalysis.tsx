
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

      <Card className="maastricht-card">
        <CardHeader className="bg-gradient-to-r from-maastricht-blue to-maastricht-teal">
          <CardTitle className="text-white">Statistical Differences Analysis (ANOVA)</CardTitle>
          <div className="text-sm text-white/90 bg-white/10 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-white mb-2">Understanding ANOVA Results</h4>
            <p className="mb-2">
              <strong>ANOVA (Analysis of Variance)</strong> tests whether there are statistically significant 
              differences between the three business clusters for each survey variable.
            </p>
            <ul className="text-white/90 space-y-1 ml-4">
              <li>• <strong>F-Statistic:</strong> Measures the ratio of variance between clusters to variance within clusters. Higher values suggest greater differences between clusters.</li>
              <li>• <strong>P-Value:</strong> Probability that the observed differences occurred by chance. Values below 0.05 indicate statistically significant differences.</li>
              <li>• <strong>Significant Difference:</strong> Variables marked as "Yes" show meaningful differences across the three business types.</li>
            </ul>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-maastricht-blue/20">
                  <TableHead className="font-semibold text-maastricht-blue">Survey Variable</TableHead>
                  <TableHead className="font-semibold text-center text-maastricht-blue">F-Statistic</TableHead>
                  <TableHead className="font-semibold text-center text-maastricht-blue">P-Value</TableHead>
                  <TableHead className="font-semibold text-center text-maastricht-blue">Significant Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anovaResults.map((result: AnovaResult, index: number) => (
                  <TableRow 
                    key={index}
                    className={result.significant ? 'bg-gradient-to-r from-maastricht-light-blue/10 to-maastricht-cyan/10 border-l-4 border-l-maastricht-teal' : 'hover:bg-maastricht-light-gray/50'}
                  >
                    <TableCell className="font-medium text-maastricht-blue">
                      {result.variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.message ? (
                        <span className="text-maastricht-gray text-sm">{result.message}</span>
                      ) : (
                        <span className="text-maastricht-blue font-medium">
                          {formatFStatistic(result.f_statistic)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.message ? (
                        <span className="text-maastricht-gray">-</span>
                      ) : (
                        <span className={result.p_value !== null && result.p_value < 0.05 ? 'font-semibold text-maastricht-teal' : 'text-maastricht-blue'}>
                          {formatPValue(result.p_value)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.message ? (
                        <Badge variant="secondary" className="bg-maastricht-gray/20 text-maastricht-gray">Error</Badge>
                      ) : (
                        <Badge 
                          variant={result.significant ? "default" : "secondary"}
                          className={result.significant ? "bg-maastricht-teal text-white" : "bg-maastricht-light-gray text-maastricht-gray"}
                        >
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
            <div className="text-center py-8 text-maastricht-gray">
              No ANOVA results available for K=3 clustering.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="maastricht-card">
        <CardHeader className="bg-gradient-to-r from-maastricht-light-blue to-maastricht-cyan">
          <CardTitle className="text-white">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-maastricht-blue/10 to-maastricht-blue/5 p-4 rounded-lg text-center border border-maastricht-blue/20">
              <div className="text-2xl font-bold text-maastricht-blue">
                {totalCount}
              </div>
              <div className="text-sm text-maastricht-gray">Variables Analyzed</div>
            </div>
            <div className="bg-gradient-to-br from-maastricht-teal/10 to-maastricht-teal/5 p-4 rounded-lg text-center border border-maastricht-teal/20">
              <div className="text-2xl font-bold text-maastricht-teal">
                {significantCount}
              </div>
              <div className="text-sm text-maastricht-gray">Significant Differences</div>
            </div>
            <div className="bg-gradient-to-br from-maastricht-gray/10 to-maastricht-gray/5 p-4 rounded-lg text-center border border-maastricht-gray/20">
              <div className="text-2xl font-bold text-maastricht-gray">
                {totalCount - significantCount}
              </div>
              <div className="text-sm text-maastricht-gray">No Significant Difference</div>
            </div>
            <div className="bg-gradient-to-br from-maastricht-light-blue/10 to-maastricht-cyan/10 p-4 rounded-lg text-center border border-maastricht-light-blue/20">
              <div className="text-2xl font-bold text-maastricht-light-blue">
                {totalCount > 0 ? ((significantCount / totalCount) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-maastricht-gray">Significance Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClusterDifferencesAnalysis;
