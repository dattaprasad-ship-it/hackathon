import * as React from 'react';
import { useEmployeeDistribution } from '../hooks/useEmployeeDistribution';
import { WidgetContainer } from './WidgetContainer';

export const EmployeeDistributionWidget: React.FC = () => {
  const { data, loading, error, refetch } = useEmployeeDistribution();

  const totalEmployees = data?.reduce((sum, item) => sum + item.count, 0) || 0;

  const getPieChartSegment = (percentage: number, offset: number) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -(offset / 100) * circumference;
    return { strokeDasharray, strokeDashoffset };
  };

  let currentOffset = 0;

  return (
    <WidgetContainer
      title="Employee Distribution by Sub Unit"
      loading={loading}
      error={error}
      onRetry={refetch}
      emptyState={<p>No distribution data available</p>}
    >
      {data && data.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
              />
              {data.map((item, index) => {
                const segment = getPieChartSegment(item.percentage, currentOffset);
                currentOffset += item.percentage;
                return (
                  <circle
                    key={index}
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>

          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-gray-900">{item.subUnit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{item.count}</span>
                  <span className="text-gray-500 w-12 text-right">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>

          {totalEmployees > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Total Employees: <span className="font-semibold text-gray-900">{totalEmployees}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </WidgetContainer>
  );
};

