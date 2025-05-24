import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const ABBREVIATION_MAPPINGS: Record<string, string> = {
  AU: 'Autonomy',
  INN: 'Innovation',
  RT: 'Risk Taking',
  PA: 'Proactiveness',
  CA: 'Competitive Aggressiveness',
  OEO: 'Organizational Entrepreneurial Orientation',
  OPC: 'Organizational Performance and Capabilities',
  RC: 'Resource Capabilities',
  CCC: 'Customer and Channel Capabilities',
  ORC: 'Operational Capabilities',
  STC: 'Strategic Capabilities',
  CMC: 'Change Management Capabilities',
  OEC: 'Organizational Excellence Capabilities',
  SU: 'Sustainability',
  SY: 'Synergy',
  CO: 'Collaboration',
  REO: 'Resource Efficiency and Optimization',
  OSRS: 'Organizational Structure and Resource Sharing',
  IA: 'Innovation Adoption',
  II: 'Innovation Implementation',
  IT_SM: 'IT Social Media',
  IT_CS: 'IT Customer Service',
  IT_PD: 'IT Product Development',
  IT_DM: 'IT Decision Making',
  IT_KM: 'IT Knowledge Management',
  IT_SCM: 'IT Supply Chain Management',
  ODTA: 'Organizational Digital Technology Adoption',
  DP: 'Double Partnership',
  TP: 'Triple Partnership',
  'F&B': 'Food & Beverage',
};

type AbbrTooltipProps = {
  abbr: string;
  children?: React.ReactNode;
};

const AbbrTooltip: React.FC<AbbrTooltipProps> = ({ abbr, children }) => {
  const full = ABBREVIATION_MAPPINGS[abbr];
  if (!full) return <>{children || abbr}</>;
  return (
    <Tooltip title={full} arrow>
      <span style={{ borderBottom: '1px dotted #888', cursor: 'help' }}>
        {children || abbr}
      </span>
    </Tooltip>
  );
};

export default AbbrTooltip; 