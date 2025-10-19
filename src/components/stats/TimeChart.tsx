'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTime } from '@/lib/format';
import { Solve } from '@/types';

interface TimeChartProps {
  solves: Solve[];
  title: string;
  className?: string;
}

export default function TimeChart({ solves, title, className = '' }: TimeChartProps) {
  // Sort solves by timestamp to show them in chronological order
  const sortedSolves = [...solves].sort((a, b) => {
    const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
    return aTime - bTime;
  });

  const chartData = sortedSolves.map((solve, index) => ({
    solve: index + 1,
    time: solve.time + (solve.penalty === '+2' ? 2000 : 0),
    penalty: solve.penalty,
    timestamp: solve.timestamp,
  }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: { time: number; penalty?: string; timestamp: Date } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const solveDate = data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold">Solve #{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Time: {formatTime(data.time)}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {solveDate.toLocaleDateString()} {solveDate.toLocaleTimeString()}
          </p>
          {data.penalty && (
            <p className="text-red-600 dark:text-red-400">
              Penalty: {data.penalty}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="solve" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#6b7280' }}
                label={{ value: 'Solve Order (Chronological)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: 12 } }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#6b7280' }}
                tickFormatter={(value) => formatTime(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
