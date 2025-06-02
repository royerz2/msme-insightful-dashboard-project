
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const fetchWithErrorHandling = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const apiEndpoints = {
  health: `${API_BASE_URL}/health`,
  demographics: `${API_BASE_URL}/demographics`,
  surveyAnalysis: `${API_BASE_URL}/survey-analysis`,
  comparativeAnalysis: `${API_BASE_URL}/comparative-analysis`,
  clustering: `${API_BASE_URL}/clustering`,
  technologyAnalysis: `${API_BASE_URL}/technology-analysis`,
  partnershipAnalysis: `${API_BASE_URL}/partnership-analysis`,
  comprehensiveReport: `${API_BASE_URL}/comprehensive-report`,
  correlationalAnalysis: `${API_BASE_URL}/correlational-analysis`,
  filteredPca: `${API_BASE_URL}/filtered-pca`,
  compositeScores: `${API_BASE_URL}/composite-scores`,
};
