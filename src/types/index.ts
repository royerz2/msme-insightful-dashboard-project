
export interface ApiResponse<T> {
  data?: T;
  loading: boolean;
  error: string | null;
}

export interface HealthResponse {
  status: string;
  total_records: number;
}

export interface DemographicDistribution {
  labels: string[];
  values: number[];
  percentages: number[];
}

export interface DemographicsData {
  distributions: {
    gender: DemographicDistribution;
    respondent_age: DemographicDistribution;
    education: DemographicDistribution;
    position: DemographicDistribution;
    business_field: DemographicDistribution;
    business_age: DemographicDistribution;
    business_employee: DemographicDistribution;
  };
  cross_tabulations: {
    gender_vs_position: CrossTabulation;
    education_vs_business: CrossTabulation;
  };
}

export interface CrossTabulation {
  index: string[];
  columns: string[];
  values: number[][];
}

export interface SurveyStatistics {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  distribution: { [key: string]: number };
}

export interface SurveyAnalysisData {
  basic_statistics: { [variable: string]: SurveyStatistics };
  correlation_matrix: {
    variables: string[];
    matrix: number[][];
  };
  top_correlations: Array<{
    var1: string;
    var2: string;
    correlation: number;
  }>;
}

export interface ComparativeAnalysisData {
  gender: {
    [variable: string]: {
      male_mean: number;
      female_mean: number;
      male_std: number;
      female_std: number;
      t_statistic: number;
      p_value: number;
      significant: boolean;
    };
  };
  age_groups: {
    [variable: string]: Array<{
      age_group: string;
      mean: number;
      std: number;
      count: number;
    }>;
  };
  business_fields: {
    [variable: string]: Array<{
      business_field: string;
      mean: number;
      std: number;
      count: number;
    }>;
  };
}

export interface ClusterProfile {
  cluster_id: number;
  size: number;
  profile: { [variable: string]: number };
}

export interface ClusteringData {
  clustering_results: {
    [k: string]: {
      clusters: ClusterProfile[];
      inertia: number;
    };
  };
  visualization: {
    pca_components: number[][];
    cluster_labels: number[];
    explained_variance_ratio: number[];
  };
}

export interface TechnologyAnalysisData {
  technology_statistics: { [variable: string]: SurveyStatistics };
  technology_by_demographics: {
    gender: { [variable: string]: { male: number; female: number } };
    business_fields: { [field: string]: { [variable: string]: number } };
  };
  technology_performance_correlation: {
    [techVar: string]: { [perfVar: string]: number };
  };
}

export interface PartnershipAnalysisData {
  partnership_distribution: {
    [partnershipType: string]: DemographicDistribution;
  };
  partnership_impact: {
    [partnershipType: string]: {
      [variable: string]: Array<{
        partnership_type: string;
        mean_score: number;
        count: number;
      }>;
    };
  };
}

export interface ComprehensiveReportData {
  sample_info: {
    total_respondents: number;
    complete_responses: number;
    survey_variables: number;
    technology_variables: number;
  };
  key_findings: Array<{
    category: string;
    finding: string;
  }>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}
