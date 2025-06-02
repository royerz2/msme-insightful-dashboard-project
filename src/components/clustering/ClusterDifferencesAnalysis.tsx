import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClusteringData, FilteredPcaData } from '@/types';
import ClusterBoxPlot from './ClusterBoxPlot';

interface ClusterDifferencesAnalysisProps {
  data: ClusteringData | FilteredPcaData;
}

interface AnovaResult {
  variable: string;
  f_statistic: number | null;
  p_value: number | null;
  significant: boolean;
  message?: string;
}

const ClusterDifferencesAnalysis: React.FC<ClusterDifferencesAnalysisProps> = ({ data }) => {
  const getAnovaResults = (data: ClusteringData | FilteredPcaData): AnovaResult[] => {
    if ('clustering_results' in data) {
      return data.clustering_results.k_2?.anova_results || [];
    } else {
      // For filtered PCA data, we don't have ANOVA results
      return [];
    }
  };

  const anovaResults = getAnovaResults(data);

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

  if ('clustering' in data) {
    return (
      <div className="space-y-6">
        <Card className="maastricht-card">
          <CardHeader className="bg-gradient-to-r from-maastricht-blue to-maastricht-teal">
            <CardTitle className="text-white">Filtered Analysis</CardTitle>
            <div className="text-sm text-white/90">
              Analysis for {data.filter_info.type === 'respondent_age' ? 'Respondent Age' : 'Working Period'}: {data.filter_info.value}
              <br />
              Sample Size: {data.filter_info.sample_size} businesses
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center text-maastricht-gray">
              ANOVA analysis is not available for filtered data.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Box Plot Visualization */}
      <ClusterBoxPlot data={data} />

      <Card className="maastricht-card">
        <CardHeader className="bg-gradient-to-r from-maastricht-blue to-maastricht-teal">
          <CardTitle className="text-white">Cluster Differences Analysis</CardTitle>
          <div className="text-sm text-white/90">
            Statistical analysis of differences between clusters
            {significantCount > 0 && (
              <span className="ml-2">
                ({significantCount} of {totalCount} variables show significant differences)
              </span>
            )}
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
                        <span className="text-maastricht-gray text-sm">{result.message}</span>
                      ) : (
                        <span className={result.significant ? 'text-maastricht-teal font-medium' : 'text-maastricht-gray'}>
                          {formatPValue(result.p_value)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.message ? (
                        <span className="text-maastricht-gray text-sm">{result.message}</span>
                      ) : (
                        <span className={result.significant ? 'text-maastricht-teal font-medium' : 'text-maastricht-gray'}>
                          {result.significant ? 'Yes' : 'No'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
