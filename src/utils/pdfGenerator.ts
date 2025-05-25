
import { ComprehensiveReportData } from '../types';

interface ReportData {
  comprehensiveData?: ComprehensiveReportData;
  charts?: {
    performanceChart?: string;
    distributionChart?: string;
    clusterChart?: string;
  };
}

export const generatePDFReport = async (data: ReportData, reportType: 'full' | 'executive' | 'data') => {
  // Create a comprehensive HTML report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>MSME Analytics Report - ${reportType.toUpperCase()}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #3B82F6; }
        .metric-label { color: #6b7280; margin-top: 8px; }
        .findings-section { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .finding-item { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #3B82F6; }
        .chart-placeholder { width: 100%; height: 300px; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
        th { background-color: #f3f4f6; font-weight: bold; }
        .page-break { page-break-before: always; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>MSME Analytics Report</h1>
        <h2>${reportType === 'full' ? 'Comprehensive Analysis' : reportType === 'executive' ? 'Executive Summary' : 'Data Export'}</h2>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Survey Overview</h2>
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-value">${data.comprehensiveData?.sample_info.total_respondents || 'N/A'}</div>
            <div class="metric-label">Total Respondents</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.comprehensiveData?.sample_info.complete_responses || 'N/A'}</div>
            <div class="metric-label">Complete Responses</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.comprehensiveData?.sample_info.survey_variables || 'N/A'}</div>
            <div class="metric-label">Survey Variables</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.comprehensiveData?.sample_info.technology_variables || 'N/A'}</div>
            <div class="metric-label">Technology Variables</div>
          </div>
        </div>
      </div>

      ${reportType !== 'data' ? `
      <div class="section">
        <h2>Key Findings</h2>
        <div class="findings-section">
          ${data.comprehensiveData?.key_findings?.map(finding => `
            <div class="finding-item">
              <strong>${finding.category}:</strong> ${finding.finding}
            </div>
          `).join('') || '<p>No key findings available</p>'}
        </div>
      </div>

      <div class="section">
        <h2>Performance Analysis</h2>
        <div class="chart-placeholder">
          <p>Performance Chart (Chart visualization would be embedded here in actual implementation)</p>
        </div>
        <p>This section would contain detailed analysis of business performance metrics across different segments.</p>
      </div>

      ${reportType === 'full' ? `
      <div class="page-break"></div>
      <div class="section">
        <h2>Cluster Analysis</h2>
        <div class="chart-placeholder">
          <p>Business Cluster Visualization (PCA Plot would be embedded here)</p>
        </div>
        <p>Detailed cluster analysis showing how businesses group based on their characteristics and performance metrics.</p>
      </div>

      <div class="section">
        <h2>Technology Adoption</h2>
        <div class="chart-placeholder">
          <p>Technology Usage Distribution (Chart would be embedded here)</p>
        </div>
        <p>Analysis of technology adoption patterns across different business types and demographics.</p>
      </div>

      <div class="section">
        <h2>Recommendations</h2>
        <ul>
          <li>Focus on digital transformation initiatives for traditional businesses</li>
          <li>Leverage innovation leaders as mentors for other business segments</li>
          <li>Develop targeted support programs based on cluster characteristics</li>
          <li>Enhance technology adoption through training and support</li>
        </ul>
      </div>
      ` : ''}
      ` : `
      <div class="section">
        <h2>Data Summary</h2>
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Total Respondents</td><td>${data.comprehensiveData?.sample_info.total_respondents || 'N/A'}</td></tr>
          <tr><td>Complete Responses</td><td>${data.comprehensiveData?.sample_info.complete_responses || 'N/A'}</td></tr>
          <tr><td>Survey Variables</td><td>${data.comprehensiveData?.sample_info.survey_variables || 'N/A'}</td></tr>
          <tr><td>Technology Variables</td><td>${data.comprehensiveData?.sample_info.technology_variables || 'N/A'}</td></tr>
        </table>
      </div>
      `}

      <div class="footer">
        <p>This report was automatically generated by the MSME Analytics Dashboard</p>
        <p>For more information, visit the interactive dashboard</p>
      </div>
    </body>
    </html>
  `;

  // Convert HTML to PDF using the browser's print functionality
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  }
};

export const generateCSVReport = (data: ComprehensiveReportData): string => {
  const csvContent = [
    'MSME Analytics Data Export',
    `Generated on: ${new Date().toLocaleDateString()}`,
    '',
    'Sample Information',
    'Metric,Value',
    `Total Respondents,${data.sample_info.total_respondents}`,
    `Complete Responses,${data.sample_info.complete_responses}`,
    `Survey Variables,${data.sample_info.survey_variables}`,
    `Technology Variables,${data.sample_info.technology_variables}`,
    '',
    'Key Findings',
    'Category,Finding',
    ...data.key_findings.map(finding => `"${finding.category}","${finding.finding}"`)
  ].join('\n');
  
  return csvContent;
};
