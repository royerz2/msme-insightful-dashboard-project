// API Response types
export interface ApiResponse<T> {
  data?: T;
  loading: boolean;
  error: string | null;
  useDummyData?: boolean;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
}

// UI Component types
export interface MetricCardData {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface HealthResponse {
  status: string;
  total_records: number;
}

export interface Distribution {
  labels: string[];
  values: number[];
  percentages: number[];
}

export interface CrossTabulation {
  index: string[];
  columns: string[];
  values: number[][];
}

export interface DemographicsData {
  distributions: {
    gender: Distribution;
    respondent_age: Distribution;
    education: Distribution;
    [key: string]: Distribution;
  };
  cross_tabulations: {
    gender_vs_position: CrossTabulation;
    education_vs_business: CrossTabulation;
    [key: string]: CrossTabulation;
  };
}

export interface BasicStatistic {
  mean: number;
  median: number;
  std: number;
  min?: number;
  max?: number;
  distribution: { [key: string]: number };
}

export interface SurveyAnalysisData {
  basic_statistics: {
    [variable: string]: BasicStatistic;
  };
  correlation_matrix: {
    variables: string[];
    matrix: number[][];
  };
  top_correlations: {
    var1: string;
    var2: string;
    correlation: number;
  }[];
}

export interface GenderComparison {
  male_mean: number;
  female_mean: number;
  male_std: number;
  female_std: number;
  t_statistic: number;
  p_value: number;
  significant: boolean;
}

export interface AgeGroup {
  age_group: string;
  mean: number;
  std: number;
  count: number;
}

export interface BusinessField {
  business_field: string;
  mean: number;
  std: number;
  count: number;
}

export interface ComparativeAnalysisData {
  gender: {
    [variable: string]: GenderComparison;
  };
  age_groups: {
    [variable: string]: AgeGroup[];
  };
  business_fields: {
    [variable: string]: BusinessField[];
  };
}

export interface Cluster {
  cluster_id: number;
  size: number;
  profile: { [variable: string]: number };
}

export interface ClusterResult {
  clusters: Cluster[];
  inertia: number;
  anova_results?: AnovaResult[];
  performance_anova_results?: AnovaResult[];
}

export interface AnovaResult {
  variable: string;
  f_statistic: number | null;
  p_value: number | null;
  significant: boolean;
  message?: string;
}

export interface ClusteringData {
  clustering_results: {
    k_3: ClusterResult;
    k_4: ClusterResult;
    k_5?: ClusterResult;
  };
  visualization: {
    pca_components: number[][];
    cluster_labels: number[];
    explained_variance_ratio: number[];
  };
}

export interface TechnologyStatistic extends BasicStatistic {
  distribution: { [key: string]: number };
}

export interface TechnologyAnalysisData {
  technology_statistics: {
    [technology: string]: TechnologyStatistic;
  };
  technology_by_demographics: {
    gender: {
      [technology: string]: {
        male: number;
        female: number;
      };
    };
    business_fields: {
      [businessField: string]: {
        [technology: string]: number;
      };
    };
  };
  technology_performance_correlation: {
    [technology: string]: {
      [performanceVariable: string]: number;
    };
  };
}

export interface PartnershipImpact {
  partnership_type: string;
  mean_score: number;
  count: number;
}

export interface PartnershipAnalysisData {
  partnership_distribution: {
    double_partnership_dp: Distribution;
    triple_partnership_tp: Distribution;
  };
  partnership_impact: {
    double_partnership_dp: {
      [variable: string]: PartnershipImpact[];
    };
  };
}

export interface KeyFinding {
  category: string;
  finding: string;
}

export interface ComprehensiveReportData {
  sample_info: {
    total_respondents: number;
    complete_responses: number;
    survey_variables: number;
    technology_variables: number;
  };
  key_findings: KeyFinding[];
}

export interface CorrelationMatrix {
  it_variables?: string[];
  partnership_variables?: string[];
  survey_variables: string[];
  matrix: number[][];
}

export interface CorrelationalAnalysisData {
  it_survey_correlation?: CorrelationMatrix;
  partnership_survey_correlation?: CorrelationMatrix & {
    message?: string;
  };
}
