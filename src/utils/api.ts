
const API_BASE_URL = 'http://localhost:5001/api';

export const fetchWithErrorHandling = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
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
  health: '/health',
  demographics: '/demographics',
  surveyAnalysis: '/survey-analysis',
  comparativeAnalysis: '/comparative-analysis',
  clustering: '/clustering',
  technologyAnalysis: '/technology-analysis',
  partnershipAnalysis: '/partnership-analysis',
  comprehensiveReport: '/comprehensive-report',
};
