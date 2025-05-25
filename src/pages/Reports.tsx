
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useApiData } from '../hooks/useApiData';
import { apiEndpoints } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ComprehensiveReportData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, FileText, BarChart3, Database } from 'lucide-react';
import { generatePDFReport, generateCSVReport } from '../utils/pdfGenerator';
import { toast } from 'sonner';
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

const Reports: React.FC = () => {
  const { data, loading, error, useDummyData } = useApiData<ComprehensiveReportData>(apiEndpoints.comprehensiveReport);
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

  // Handle report downloads with PDF generation
  const handleDownload = async (reportType: 'full' | 'executive' | 'data') => {
    setDownloadingReport(reportType);
    console.log(`Generating ${reportType} report...`);
    
    try {
      if (reportType === 'data') {
        // Generate CSV for data export
        if (data) {
          const csvContent = generateCSVReport(data);
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `msme-data-export-${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success('CSV data export downloaded successfully!');
        }
      } else {
        // Generate PDF reports
        await generatePDFReport({ comprehensiveData: data }, reportType);
        toast.success(`${reportType === 'full' ? 'Full' : 'Executive'} PDF report generated successfully!`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setDownloadingReport(null);
    }
  };

  // Format key findings by category
  const groupFindingsByCategory = (data?: ComprehensiveReportData) => {
    if (!data || !data.key_findings) return {};
    
    return data.key_findings.reduce<Record<string, string[]>>((acc, finding) => {
      if (!acc[finding.category]) {
        acc[finding.category] = [];
      }
      acc[finding.category].push(finding.finding);
      return acc;
    }, {});
  };

  const keyFindingsByCategory = groupFindingsByCategory(data);
  const categories = Object.keys(keyFindingsByCategory);

  // Enhanced sample chart data
  const performanceData = [
    { variable: 'AU', score: 6.20, category: 'Leadership' },
    { variable: 'INN', score: 5.85, category: 'Innovation' },
    { variable: 'RT', score: 5.65, category: 'Risk Taking' },
    { variable: 'PA', score: 5.45, category: 'Proactiveness' },
    { variable: 'CA', score: 5.30, category: 'Competitive Aggressiveness' },
    { variable: 'OEO', score: 5.10, category: 'Opportunity Recognition' },
  ];

  const distributionData = [
    { name: 'Traditional Businesses', value: 35, color: '#F59E0B' },
    { name: 'Innovation Leaders', value: 25, color: '#10B981' },
    { name: 'Moderate SMEs', value: 40, color: '#8B5CF6' },
  ];

  if (loading) {
    return (
      <Layout title="Reports">
        <LoadingSpinner message="Loading comprehensive report..." />
      </Layout>
    );
  }

  return (
    <Layout title="Reports">
      <div className="space-y-8 fade-in">
        {error && <ErrorMessage message={error} useDummyData={useDummyData} />}
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">MSME Analytics: Executive Summary</h2>
              <p className="text-lg text-gray-600">
                Comprehensive analysis of survey data from {data?.sample_info.total_respondents} respondents
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDownload('executive')}
                disabled={downloadingReport === 'executive'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {downloadingReport === 'executive' ? 'Generating...' : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Quick Report
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">{data?.sample_info.total_respondents}</div>
                <p className="text-sm text-gray-500 mt-2">Total Respondents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">{data?.sample_info.complete_responses}</div>
                <p className="text-sm text-gray-500 mt-2">Complete Responses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">{data?.sample_info.survey_variables}</div>
                <p className="text-sm text-gray-500 mt-2">Survey Variables</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">{data?.sample_info.technology_variables}</div>
                <p className="text-sm text-gray-500 mt-2">Technology Variables</p>
              </CardContent>
            </Card>
          </div>

          {/* Key Findings and Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Key Findings</h3>
              {categories.map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {keyFindingsByCategory[category].map((finding, index) => (
                        <li key={index} className="text-gray-700 text-sm">{wrapAbbreviations(finding)}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Performance Overview</CardTitle>
                  <CardDescription>Average scores across key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="variable" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                        />
                        <YAxis domain={[0, 7]} />
                        <Tooltip />
                        <Bar dataKey="score" name="Average Score" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Business Type Distribution</CardTitle>
                  <CardDescription>Clustering analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Download Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Report Downloads
              </CardTitle>
              <CardDescription>
                Download comprehensive analysis reports in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleDownload('full')}
                  disabled={downloadingReport === 'full'}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {downloadingReport === 'full' ? 'Generating...' : (
                    <>
                      <FileText className="w-6 h-6" />
                      <span className="text-sm">Full Report (PDF)</span>
                      <span className="text-xs opacity-80">Complete analysis with charts</span>
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => handleDownload('executive')}
                  disabled={downloadingReport === 'executive'}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  {downloadingReport === 'executive' ? 'Generating...' : (
                    <>
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-sm">Executive Summary</span>
                      <span className="text-xs opacity-80">Key insights overview</span>
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => handleDownload('data')}
                  disabled={downloadingReport === 'data'}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {downloadingReport === 'data' ? 'Generating...' : (
                    <>
                      <Database className="w-6 h-6" />
                      <span className="text-sm">Raw Data (CSV)</span>
                      <span className="text-xs opacity-80">Data export for analysis</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
