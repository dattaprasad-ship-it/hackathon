import * as React from 'react';
import { useTimeAtWork } from '../hooks/useTimeAtWork';
import { WidgetContainer } from './WidgetContainer';
import { cn } from '@/utils/utils';

export const TimeAtWorkWidget: React.FC = () => {
  const { data, loading, error, refetch } = useTimeAtWork();

  const formatTime = (hours: number, minutes: number): string => {
    return `${hours}h ${minutes}m`;
  };

  const getDayAbbreviation = (day: string): string => {
    return day.substring(0, 3);
  };

  return (
    <WidgetContainer
      title="Time at Work"
      loading={loading}
      error={error}
      onRetry={refetch}
      emptyState={<p>No time tracking data available</p>}
    >
      {data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={cn(
                'text-lg font-semibold',
                data.punchedIn ? 'text-green-600' : 'text-gray-400'
              )}>
                {data.punchedIn ? 'Punched In' : 'Not Punched In'}
              </p>
            </div>
            {data.punchedIn && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Punch In Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(data.punchInTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-2">Today's Hours</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatTime(data.todayHours.hours, data.todayHours.minutes)}
            </p>
          </div>

          {data.weekData && data.weekData.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3">This Week</p>
              <div className="flex items-end justify-between gap-1 h-24">
                {data.weekData.map((day, index) => {
                  const maxHours = Math.max(...data.weekData.map((d) => d.hours + d.minutes / 60));
                  const height = maxHours > 0 ? ((day.hours + day.minutes / 60) / maxHours) * 100 : 0;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all"
                        style={{ height: `${height}%` }}
                        role="img"
                        aria-label={`${day.day}: ${formatTime(day.hours, day.minutes)}`}
                      />
                      <p className="text-xs text-gray-600 mt-1">{getDayAbbreviation(day.day)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </WidgetContainer>
  );
};

