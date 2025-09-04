// components/ContributionGraph.tsx (example component)
import React from "react";
import { AnimatedNumber } from "../AnimatedNumber";

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

const getLevelColor = (level: number): string => {
  // Tailwind classes for different contribution levels
  // Adjust colors to match your site's theme
  switch (level) {
    case 0:
      return "bg-gray-100 dark:bg-gray-800"; // No contributions
    case 1:
      return "bg-red-200 dark:bg-green-900"; // Low
    case 2:
      return "bg-red-400 dark:bg-green-700"; // Medium
    case 3:
      return "bg-red-600 dark:bg-green-500"; // High
    case 4:
      return "bg-red-800 dark:bg-green-300"; // Very high
    default:
      return "bg-red-100 dark:bg-gray-800";
  }
};

interface ContributionGraphProps {
  data: ContributionDay[];
  totalContributions: number;
  isLoading?: boolean;
}

export function ContributionGraph({
  data,
  totalContributions,
  isLoading,
}: ContributionGraphProps) {
  if (isLoading) {
    // Optional: Add a loading skeleton state
    return <div className="p-2">Loading contributions...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-2">Could not load contribution data.</div>;
  }

  return (
    <div>
      <p className="text-sm text-white mb-2">
        <AnimatedNumber value={totalContributions} />
        contributions in the last year
      </p>
      <div className="grid grid-flow-col grid-rows-7 gap-1 p-2 border rounded-md dark:border-gray-700 overflow-x-auto bg-white dark:bg-gray-900/50">
        {data.map((day) => (
          <div
            key={day.date}
            className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)}`}
            title={`${day.count} contribution${day.count !== 1 ? "s" : ""} on ${
              day.date
            }`} // Tooltip
          />
        ))}
      </div>
    </div>
  );
}
