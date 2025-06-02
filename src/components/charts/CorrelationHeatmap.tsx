import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CorrelationHeatmapProps {
  rowVariables: string[];
  columnVariables: string[];
  matrix: number[][];
  title: string;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  rowVariables,
  columnVariables,
  matrix,
  title
}) => {
  const getColorIntensity = (value: number) => {
    const absValue = Math.abs(value);
    if (value >= 0.5) return 'bg-green-600 text-white';
    if (value <= -0.5) return 'bg-red-600 text-white';
    if (value >= 0.3) return 'bg-green-400 text-white';
    if (value <= -0.3) return 'bg-red-400 text-white';
    if (value >= 0.1) return 'bg-green-200';
    if (value <= -0.1) return 'bg-red-200';
    return 'bg-gray-50';
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600"></div>
            <span>Strong Positive (≥0.7)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400"></div>
            <span>Moderate Positive (0.5-0.7)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400"></div>
            <span>Moderate Negative (-0.5 to -0.7)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600"></div>
            <span>Strong Negative (≤-0.7)</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-white border-r font-semibold min-w-48">Variables</TableHead>
              {columnVariables.map((col) => (
                <TableHead key={col} className="text-center min-w-24 text-xs">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowVariables.map((row, rowIndex) => (
              <TableRow key={row}>
                <TableCell className="sticky left-0 bg-white border-r font-medium min-w-48 text-sm">
                  {row}
                </TableCell>
                {columnVariables.map((_, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    className={`text-center text-xs font-medium ${getColorIntensity(matrix[rowIndex][colIndex])}`}
                  >
                    {matrix[rowIndex][colIndex].toFixed(3)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
