'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InputScreen from '@/components/InputScreen/InputScreen';
import RouteDisplay from '@/components/RouteDisplay/RouteDisplay';
import { getRouteData } from '@/services/ai-service';
import { RouteData } from '@/types/route';
import styles from './page.module.css';

function HomeContent() {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const start = searchParams.get('start');
    const dest = searchParams.get('dest');
    if (start && dest) {
      handleRouteRequest(start, dest);
    }
  }, [searchParams]);

  const handleRouteRequest = async (startStation: string, destinationStation: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRouteData({
        start_station: startStation,
        destination_station: destinationStation
      });

      if (data) {
        setRouteData(data);
      } else {
        setError('I am not sure. Please ask a station staff member.');
      }
    } catch (err) {
      setError('I am not sure. Please ask a station staff member.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setRouteData(null);
    setError(null);
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Finding your route...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <h2>{error}</h2>
          <button onClick={handleBack} className={styles.errorButton}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (routeData) {
    return (
      <main className={styles.main}>
        <RouteDisplay routeData={routeData} onBack={handleBack} />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <InputScreen onSubmit={handleRouteRequest} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
