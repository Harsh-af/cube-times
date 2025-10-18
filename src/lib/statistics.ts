import { Solve, Statistics } from '@/types';

export function calculateStatistics(solves: Solve[]): Statistics {
  if (solves.length === 0) {
    return {
      totalSolves: 0,
      bestTime: null,
      worstTime: null,
      mean: null,
      median: null,
      ao5: null,
      ao12: null,
      ao100: null,
      currentAo5: null,
      currentAo12: null,
      currentAo100: null,
    };
  }

  const validSolves = solves.filter(solve => solve.penalty !== 'DNF');
  const times = validSolves.map(solve => solve.time + (solve.penalty === '+2' ? 2000 : 0));
  
  const totalSolves = solves.length;
  const bestTime = times.length > 0 ? Math.min(...times) : null;
  const worstTime = times.length > 0 ? Math.max(...times) : null;
  const mean = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : null;
  const median = times.length > 0 ? calculateMedian(times) : null;

  return {
    totalSolves,
    bestTime,
    worstTime,
    mean,
    median,
    ao5: calculateAverage(times, 5),
    ao12: calculateAverage(times, 12),
    ao100: calculateAverage(times, 100),
    currentAo5: calculateCurrentAverage(times, 5),
    currentAo12: calculateCurrentAverage(times, 12),
    currentAo100: calculateCurrentAverage(times, 100),
  };
}

function calculateMedian(times: number[]): number {
  const sorted = [...times].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function calculateAverage(times: number[], count: number): number | null {
  if (times.length < count) return null;
  
  const recent = times.slice(-count);
  const sorted = [...recent].sort((a, b) => a - b);
  
  // Remove best and worst times for average of 5
  if (count === 5) {
    sorted.shift(); // Remove best
    sorted.pop(); // Remove worst
    return sorted.reduce((sum, time) => sum + time, 0) / sorted.length;
  }
  
  // For ao12 and ao100, remove best and worst 5%
  const removeCount = Math.floor(count * 0.05);
  for (let i = 0; i < removeCount; i++) {
    sorted.shift(); // Remove best
    sorted.pop(); // Remove worst
  }
  
  return sorted.reduce((sum, time) => sum + time, 0) / sorted.length;
}

function calculateCurrentAverage(times: number[], count: number): number | null {
  if (times.length < count) return null;
  return calculateAverage(times, count);
}

export function getTimeDistribution(solves: Solve[], bins: number = 10): Array<{ range: string; count: number }> {
  const validSolves = solves.filter(solve => solve.penalty !== 'DNF');
  if (validSolves.length === 0) return [];

  const times = validSolves.map(solve => solve.time + (solve.penalty === '+2' ? 2000 : 0));
  const min = Math.min(...times);
  const max = Math.max(...times);
  const binSize = (max - min) / bins;

  const distribution = Array.from({ length: bins }, (_, i) => {
    const start = min + i * binSize;
    const end = min + (i + 1) * binSize;
    const count = times.filter(time => time >= start && time < end).length;
    return {
      range: `${formatTime(start)} - ${formatTime(end)}`,
      count,
    };
  });

  return distribution;
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
  return `${seconds}.${ms.toString().padStart(2, '0')}`;
}
