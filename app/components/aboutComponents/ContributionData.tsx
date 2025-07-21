'use client'
import React, { useEffect, useState } from 'react';
import { ContributionGraph } from './ContributionGraph';


const ContributionsData = () => {
  const [data, setData] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch('/api/github-activity');
        if (!response.ok) {
          throw new Error('Failed to fetch contributions');
        }
        const result = await response.json();
        setData(result.data);
        setTotalContributions(result.totalContributions);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (isLoading) {
    return <div>Loading contributions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-center">GitHub Contributions</h1>
      <ContributionGraph data={data} totalContributions={totalContributions} />
    </div>
  );
};

export default ContributionsData;
