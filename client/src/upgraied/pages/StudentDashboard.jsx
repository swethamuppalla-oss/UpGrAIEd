import { useEffect, useMemo, useState } from 'react';
import './StudentDashboard.scss';
import DashHeader from '../components/dashboard/DashHeader';
import ConceptCard from '../components/dashboard/ConceptCard';
import StatsRow from '../components/dashboard/StatsRow';
import WeakAreas from '../components/dashboard/WeakAreas';
import BloomStatus from '../components/dashboard/BloomStatus';
import { getStudentDashboard } from '../../services/dashboardService';
import { getBloomState } from '../utils/bloomUtils';

const BLOOM_STAGE_NUMBER = {
  bloom: 1,
  bloomy: 2,
  bloomio: 3,
  bloomix: 4,
  bloomax: 5,
};

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        const data = await getStudentDashboard();
        if (!ignore) setStudentData(data);
      } catch (err) {
        console.error(err);
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  const dashboardData = useMemo(() => {
    if (!studentData) return null;

    const progress = studentData.progress ?? studentData.progressData?.overallPercent ?? 0;
    const completed = studentData.completed ?? studentData.stats?.completed ?? studentData.stats?.modulesCompleted ?? 0;
    const bloomVariant = getBloomState(studentData);
    const weakAreas = studentData.weakAreas ?? studentData.stats?.weakAreas ?? [];

    return {
      student: {
        name: studentData.name || 'Student',
        grade: studentData.grade,
        streak: studentData.streak ?? studentData.stats?.streak ?? 0,
      },
      concept: {
        title: studentData.currentConcept || studentData.stats?.currentConcept || studentData.progressData?.currentModule?.title || 'Current lesson',
        chapter: studentData.chapter || studentData.stats?.chapter || '',
        progress,
        day: studentData.day ?? 1,
        totalDays: studentData.totalDays ?? 1,
      },
      stats: {
        accuracy: studentData.accuracy ?? studentData.stats?.accuracy ?? 0,
        timeSpent: studentData.timeSpent ?? studentData.stats?.timeSpent ?? '0h 00m',
        conceptsDone: completed,
      },
      weakAreas: weakAreas.map((area) => (
        typeof area === 'string'
          ? { topic: area, severity: 'medium' }
          : { topic: area.topic, severity: area.severity || 'medium' }
      )),
      bloom: {
        stage: BLOOM_STAGE_NUMBER[bloomVariant] || 1,
        xp: studentData.xp ?? studentData.robXP ?? completed * 100,
        xpToNext: studentData.xpToNext ?? 1000,
      },
    };
  }, [studentData]);

  if (loading) return <div className="sd"><div className="sd__inner">Loading...</div></div>;
  if (error || !dashboardData) return <div className="sd"><div className="sd__inner">Error loading data</div></div>;

  return (
    <div className="sd">
      <div className="sd__inner">
        <DashHeader
          name={dashboardData.student.name}
          grade={dashboardData.student.grade}
          streak={dashboardData.student.streak}
        />

        <div className="sd__grid">
          <div className="sd__col">
            <ConceptCard concept={dashboardData.concept} />
          </div>
          <div className="sd__col">
            <StatsRow stats={dashboardData.stats} />
            <WeakAreas areas={dashboardData.weakAreas} />
          </div>
        </div>

        <BloomStatus bloom={dashboardData.bloom} />
      </div>
    </div>
  );
}
