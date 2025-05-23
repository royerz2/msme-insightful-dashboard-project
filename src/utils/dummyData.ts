
import { apiEndpoints } from './api';

// Dummy data for when the API calls fail
export const getDummyData = <T>(endpoint: string): T => {
  switch (endpoint) {
    case apiEndpoints.health:
      return {
        status: "healthy",
        total_records: 380
      } as unknown as T;
      
    case apiEndpoints.demographics:
      return {
        distributions: {
          gender: {
            labels: ["Male", "Female"],
            values: [150, 230],
            percentages: [39.47, 60.53]
          },
          respondent_age: {
            labels: ["<= 30 years", "31-40 years", "41-50 years", "> 50 years"],
            values: [45, 120, 180, 35],
            percentages: [11.84, 31.58, 47.37, 9.21]
          },
          education: {
            labels: ["Senior High School", "Bachelor", "Master", "Doctor"],
            values: [180, 150, 35, 15],
            percentages: [47.37, 39.47, 9.21, 3.95]
          }
        },
        cross_tabulations: {
          gender_vs_position: {
            index: ["Male", "Female"],
            columns: ["Owner", "Others"],
            values: [[120, 30], [200, 30]]
          },
          education_vs_business: {
            index: ["Senior High School", "Bachelor", "Master", "Doctor"],
            columns: ["F&B", "Trading", "Online shop", "Jasa"],
            values: [[90, 45, 30, 15], [80, 40, 20, 10], [15, 10, 7, 3], [8, 4, 2, 1]]
          }
        }
      } as unknown as T;
      
    case apiEndpoints.surveyAnalysis:
      return {
        basic_statistics: {
          AU: {
            mean: 5.67,
            median: 6.0,
            std: 1.23,
            min: 1,
            max: 7,
            distribution: {"1": 5, "2": 10, "3": 15, "4": 25, "5": 45, "6": 120, "7": 160}
          },
          INN: {
            mean: 5.85,
            median: 6.0,
            std: 1.15,
            min: 2,
            max: 7,
            distribution: {"1": 0, "2": 5, "3": 15, "4": 30, "5": 50, "6": 125, "7": 155}
          }
        },
        correlation_matrix: {
          variables: ["AU", "INN", "RT", "PA"],
          matrix: [
            [1.0, 0.65, 0.43, 0.38],
            [0.65, 1.0, 0.52, 0.48],
            [0.43, 0.52, 1.0, 0.56],
            [0.38, 0.48, 0.56, 1.0]
          ]
        },
        top_correlations: [
          {"var1": "AU", "var2": "INN", "correlation": 0.78},
          {"var1": "OEO", "var2": "OPC", "correlation": 0.72}
        ]
      } as unknown as T;
      
    case apiEndpoints.comparativeAnalysis:
      return {
        gender: {
          AU: {
            male_mean: 5.45,
            female_mean: 5.82,
            male_std: 1.21,
            female_std: 1.15,
            t_statistic: -2.34,
            p_value: 0.019,
            significant: true
          },
          INN: {
            male_mean: 5.32,
            female_mean: 5.94,
            male_std: 1.18,
            female_std: 1.09,
            t_statistic: -3.12,
            p_value: 0.002,
            significant: true
          }
        },
        age_groups: {
          AU: [
            {"age_group": "<= 30 years", "mean": 5.2, "std": 1.3, "count": 45},
            {"age_group": "31-40 years", "mean": 5.7, "std": 1.1, "count": 120},
            {"age_group": "41-50 years", "mean": 5.9, "std": 1.0, "count": 180},
            {"age_group": "> 50 years", "mean": 6.1, "std": 0.9, "count": 35}
          ]
        },
        business_fields: {
          AU: [
            {"business_field": "F&B", "mean": 5.8, "std": 1.2, "count": 200},
            {"business_field": "Trading", "mean": 5.4, "std": 1.3, "count": 100},
            {"business_field": "Online shop", "mean": 5.9, "std": 1.1, "count": 50},
            {"business_field": "Jasa", "mean": 5.6, "std": 1.2, "count": 30}
          ]
        }
      } as unknown as T;
      
    case apiEndpoints.clustering:
      return {
        clustering_results: {
          k_3: {
            clusters: [
              {
                cluster_id: 0,
                size: 125,
                profile: {"AU": 6.2, "INN": 5.8, "RT": 5.5}
              },
              {
                cluster_id: 1,
                size: 150,
                profile: {"AU": 4.8, "INN": 4.2, "RT": 4.6}
              },
              {
                cluster_id: 2,
                size: 105,
                profile: {"AU": 7.0, "INN": 6.8, "RT": 6.5}
              }
            ],
            inertia: 1245.67
          },
          k_4: {
            clusters: [
              {
                cluster_id: 0,
                size: 95,
                profile: {"AU": 6.4, "INN": 6.0, "RT": 5.7}
              },
              {
                cluster_id: 1,
                size: 120,
                profile: {"AU": 4.5, "INN": 4.0, "RT": 4.3}
              },
              {
                cluster_id: 2,
                size: 85,
                profile: {"AU": 7.0, "INN": 6.9, "RT": 6.7}
              },
              {
                cluster_id: 3,
                size: 80,
                profile: {"AU": 5.2, "INN": 5.0, "RT": 4.9}
              }
            ],
            inertia: 985.42
          }
        },
        visualization: {
          pca_components: [
            [-0.5, 1.2], [0.8, -0.3], [1.1, 0.7], [-1.2, -0.5], 
            [0.3, 1.5], [-0.7, -1.1], [1.4, 0.2], [-0.1, -0.9]
          ],
          cluster_labels: [0, 1, 2, 0, 1, 2, 0, 1],
          explained_variance_ratio: [0.35, 0.28]
        }
      } as unknown as T;
      
    case apiEndpoints.technologyAnalysis:
      return {
        technology_statistics: {
          IT_SM: {
            mean: 4.2,
            median: 4.0,
            std: 1.1,
            distribution: {"1": 15, "2": 25, "3": 45, "4": 80, "5": 120, "6": 70, "7": 25}
          },
          IT_CS: {
            mean: 3.8,
            median: 4.0,
            std: 1.3,
            distribution: {"1": 25, "2": 35, "3": 60, "4": 75, "5": 100, "6": 65, "7": 20}
          }
        },
        technology_by_demographics: {
          gender: {
            IT_SM: {"male": 4.1, "female": 4.3},
            IT_CS: {"male": 3.8, "female": 4.0}
          },
          business_fields: {
            F_B: {"IT_SM": 4.5, "IT_CS": 4.2},
            Trading: {"IT_SM": 3.8, "IT_CS": 3.5}
          }
        },
        technology_performance_correlation: {
          IT_SM: {"AU": 0.45, "INN": 0.52, "OEO": 0.38, "OPC": 0.41},
          IT_CS: {"AU": 0.38, "INN": 0.44, "OEO": 0.33, "OPC": 0.36}
        }
      } as unknown as T;
      
    case apiEndpoints.partnershipAnalysis:
      return {
        partnership_distribution: {
          double_partnership_dp: {
            labels: ["Never partnered", "MSME-Government", "MSME-University", "MSME-Corporation"],
            values: [300, 45, 25, 10],
            percentages: [78.95, 11.84, 6.58, 2.63]
          },
          triple_partnership_tp: {
            labels: ["Never partnered", "MSME-Gov-Uni", "MSME-Gov-Corp"],
            values: [350, 20, 10],
            percentages: [92.11, 5.26, 2.63]
          }
        },
        partnership_impact: {
          double_partnership_dp: {
            AU: [
              {"partnership_type": "Never partnered", "mean_score": 5.4, "count": 300},
              {"partnership_type": "MSME-Government", "mean_score": 6.2, "count": 45},
              {"partnership_type": "MSME-University", "mean_score": 6.0, "count": 25},
              {"partnership_type": "MSME-Corporation", "mean_score": 6.5, "count": 10}
            ]
          }
        }
      } as unknown as T;
      
    case apiEndpoints.comprehensiveReport:
      return {
        sample_info: {
          total_respondents: 380,
          complete_responses: 365,
          survey_variables: 20,
          technology_variables: 7
        },
        key_findings: [
          {
            category: "Demographics",
            finding: "Gender distribution: 230 Female (60.5%), 150 Male (39.5%)"
          },
          {
            category: "Business",
            finding: "Top business fields: F&B (200 businesses), Trading (100 businesses)"
          },
          {
            category: "Survey",
            finding: "Highest scoring variables: AU (6.20), INN (5.85)"
          },
          {
            category: "Technology",
            finding: "Highest technology adoption: IT_SM (4.20), IT_CS (3.80)"
          }
        ]
      } as unknown as T;

    default:
      console.warn(`No dummy data available for endpoint: ${endpoint}`);
      return {} as T;
  }
};
