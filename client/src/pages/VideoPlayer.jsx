import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import api, { getCurriculum, getModuleProgress, getStreamUrl, postProgress } from '../services/api';

const MOCK_CURRICULUM = [
  {
    level: 1, title: 'AI Basics', status: 'completed',
    modules: [
      { _id: 'm1', title: 'What is Artificial Intelligence?', duration: 8, isMustDo: true, status: 'completed', taskDescription: 'Explain three real-world uses of AI.' },
      { _id: 'm2', title: 'How AI thinks', duration: 6, isMustDo: false, status: 'completed', taskDescription: 'Summarize how AI processes patterns.' },
      { _id: 'm3', title: 'AI around us', duration: 7, isMustDo: false, status: 'completed', taskDescription: 'Find five AI examples around you.' },
    ],
  },
  {
    level: 2, title: 'Prompt Engineering', status: 'completed',
    modules: [
      { _id: 'm4', title: 'What is a Prompt?', duration: 9, isMustDo: true, status: 'completed', taskDescription: 'Write three useful prompts for study help.' },
      { _id: 'm5', title: 'Prompt patterns', duration: 11, isMustDo: false, status: 'completed', taskDescription: 'Compare two prompt patterns.' },
      { _id: 'm6', title: 'Advanced prompting', duration: 10, isMustDo: false, status: 'completed', taskDescription: 'Improve one bad prompt into a great one.' },
    ],
  },
  {
    level: 3, title: 'Build AI Apps', status: 'active',
    modules: [
      { _id: 'm7', title: 'Intro: What is an AI App?', duration: 8, isMustDo: false, status: 'completed', taskDescription: 'List the parts of an AI app.' },
      { _id: 'm8', title: 'Build a Chatbot UI', duration: 15, isMustDo: true, status: 'active', taskDescription: 'Build a simple chatbot interface with input and responses.' },
      { _id: 'm9', title: 'Connect to an AI API', duration: 12, isMustDo: false, status: 'available', taskDescription: 'Connect your UI to a fake or real AI API.' },
      { _id: 'm10', title: 'Add Memory to your Bot', duration: 10, isMustDo: false, status: 'available', taskDescription: 'Make your bot remember the last message.' },
      { _id: 'm11', title: 'Deploy to the Web', duration: 14, isMustDo: false, status: 'locked', taskDescription: '' },
      { _id: 'm12', title: 'Project Submission', duration: 5, isMustDo: false, status: 'locked', taskDescription: '' },
    ],
  },
  {
    level: 4, title: 'AI Automation', status: 'locked',
    modules: [
      { _id: 'm13', title: 'Intro to Automation', duration: 9, isMustDo: true, status: 'locked', taskDescription: '' },
      { _id: 'm14', title: 'Build your first workflow', duration: 13, isMustDo: false, status: 'locked', taskDescription: '' },
    ],
  },
  {
    level: 5, title: 'APIs and Tools', status: 'locked',
    modules: [
      { _id: 'm15', title: 'What is an API?', duration: 8, isMustDo: true, status: 'locked', taskDescription: '' },
    ],
  },
];

const levelAccent = {
  completed: { borderColor: 'var(--green)', background: 'rgba(76, 217, 100, 0.05)', opacity: 1 },
  active: { borderColor: 'var(--purple)', background: 'rgba(123, 63, 228, 0.10)', opacity: 1 },
  locked: { borderColor: 'transparent', background: 'transparent', opacity: 0.45 },
};

const moduleDot = {
  completed: { background: 'var(--green)', border: '1px solid var(--green)' },
  active: { background: 'var(--purple)', border: '1px solid var(--purple)' },
  available: { background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.25)' },
  locked: { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)' },
};

const getStatusIcon = (status) => {
  if (status === 'completed') return '✅';
  if (status === 'active') return '▶️';
  return '🔒';
};

const programmeNameFromLevel = (level) => (level >= 11 ? 'Senior Programme' : 'Junior Programme');

const findModuleInCurriculum = (curriculum, moduleId) => {
  for (const level of curriculum) {
    const module = level.modules.find((item) => String(item._id) === String(moduleId));
    if (module) {
      return { level, module };
    }
  }
  return null;
};

const flattenModules = (curriculum) =>
  curriculum.flatMap((level) => level.modules.map((module) => ({ ...module, levelNumber: level.level, levelTitle: level.title })));

const updateLevelStatuses = (levels) =>
  levels.map((level) => {
    const hasActive = level.modules.some((module) => module.status === 'active');
    const mustDo = level.modules.find((module) => module.isMustDo);
    const completedCount = level.modules.filter((module) => module.status === 'completed').length;

    let status = level.status;
    if (level.modules.every((module) => module.status === 'locked')) {
      status = 'locked';
    } else if (mustDo?.status === 'completed' || completedCount === level.modules.length) {
      status = 'completed';
    } else if (hasActive || level.modules.some((module) => module.status === 'available')) {
      status = 'active';
    }

    return { ...level, status };
  });

export default function VideoPlayer() {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const activeModuleRef = useRef(null);
  const progressRef = useRef(null);
  const watchedPercentRef = useRef(0);
  const fileInputRef = useRef(null);

  const [curriculum, setCurriculum] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [embedUrl, setEmbedUrl] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingCurriculum, setLoadingCurriculum] = useState(true);
  const [progress, setProgress] = useState(0);
  const [expandedLevels, setExpandedLevels] = useState([]);

  useEffect(() => {
    watchedPercentRef.current = progress;
  }, [progress]);

  const loadModule = async (module) => {
    if (!module) return;
    setCurrentModule(module);
    setLoadingVideo(true);
    const levelInfo = findModuleInCurriculum(curriculum, module._id);
    if (levelInfo) {
      setExpandedLevels((current) => Array.from(new Set([...current, levelInfo.level.level])));
    }

    try {
      const [streamData, progressData] = await Promise.all([
        getStreamUrl(module._id),
        getModuleProgress(module._id),
      ]);

      setEmbedUrl(streamData.embedUrl || null);
      const watched = progressData.percentWatched || module.percentWatched || 0;
      setProgress(watched);
      watchedPercentRef.current = watched;
      navigate(`/player/${module._id}`, { replace: true });
    } catch {
      setEmbedUrl(null);
      setProgress(module.percentWatched || 0);
      toast.error('Could not load this module right now');
    } finally {
      setLoadingVideo(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialise = async () => {
      try {
        const data = await getCurriculum();
        if (!mounted) return;
        setCurriculum(data?.length ? data : MOCK_CURRICULUM);
      } catch {
        if (!mounted) return;
        setCurriculum(MOCK_CURRICULUM);
        toast.error('Using fallback curriculum');
      } finally {
        if (mounted) setLoadingCurriculum(false);
      }
    };

    initialise();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loadingCurriculum || curriculum.length === 0) return;

    const selected = moduleId
      ? findModuleInCurriculum(curriculum, moduleId)?.module
      : flattenModules(curriculum).find((module) => module.status === 'active')
        || flattenModules(curriculum).find((module) => module.status === 'available');

    if (!selected) return;
    if (String(currentModule?._id) === String(selected._id)) return;

    const levelInfo = findModuleInCurriculum(curriculum, selected._id);
    if (levelInfo) {
      setExpandedLevels((current) => Array.from(new Set([...current, levelInfo.level.level])));
    }
    loadModule(selected);
  }, [loadingCurriculum, curriculum, moduleId]);

  useEffect(() => {
    if (!currentModule) return;
    progressRef.current = setInterval(async () => {
      try {
        await api.post(`/api/videos/${currentModule._id}/progress`, {
          percent: watchedPercentRef.current,
        });
      } catch {
        // Silent ping failure by design.
      }
    }, 30000);

    return () => {
      clearInterval(progressRef.current);
    };
  }, [currentModule]);

  useEffect(() => {
    if (activeModuleRef.current) {
      activeModuleRef.current.scrollIntoView({ block: 'center' });
    }
  }, [currentModule, expandedLevels]);

  const currentLevelInfo = useMemo(
    () => (currentModule ? findModuleInCurriculum(curriculum, currentModule._id) : null),
    [curriculum, currentModule]
  );

  const orderedModules = useMemo(() => flattenModules(curriculum), [curriculum]);
  const currentIndex = orderedModules.findIndex((module) => String(module._id) === String(currentModule?._id));
  const previousModule = currentIndex > 0 ? orderedModules[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 ? orderedModules[currentIndex + 1] : null;

  const handleToggleLevel = (levelNumber) => {
    setExpandedLevels((current) =>
      current.includes(levelNumber)
        ? current.filter((item) => item !== levelNumber)
        : [...current, levelNumber]
    );
  };

  const handleModuleClick = async (module) => {
    if (module.status === 'locked') {
      toast.error('Complete the MUST DO module first');
      return;
    }

    await loadModule(module);
  };

  const handleComplete = async () => {
    if (!currentModule) return;

    try {
      const response = await postProgress(currentModule._id, 100);
      const nextLevelNumber = currentLevelInfo?.level.level + 1;
      const updatedCurriculum = updateLevelStatuses(
        curriculum.map((level) => {
          if (level.level === currentLevelInfo?.level.level) {
            return {
              ...level,
              modules: level.modules.map((module) =>
                String(module._id) === String(currentModule._id)
                  ? { ...module, status: 'completed', percentWatched: 100 }
                  : module
              ),
            };
          }

          if (response.nextLevelUnlocked && level.level === nextLevelNumber) {
            return {
              ...level,
              modules: level.modules.map((module, index) => ({
                ...module,
                status: index === 0 ? 'available' : module.status === 'locked' ? 'locked' : module.status,
              })),
            };
          }

          return level;
        })
      );

      setCurriculum(updatedCurriculum);
      setProgress(100);
      watchedPercentRef.current = 100;

      if (response.nextLevelUnlocked && nextLevelNumber) {
        toast.success(`🎉 Level ${nextLevelNumber} unlocked!`);
      }

      const updatedOrdered = flattenModules(updatedCurriculum);
      const currentPos = updatedOrdered.findIndex((module) => String(module._id) === String(currentModule._id));
      const autoNext = updatedOrdered.slice(currentPos + 1).find((module) => module.status === 'active' || module.status === 'available');

      if (autoNext) {
        const nextLevel = findModuleInCurriculum(updatedCurriculum, autoNext._id)?.level?.level;
        if (nextLevel) {
          setExpandedLevels((current) => Array.from(new Set([...current, nextLevel])));
        }
        await loadModule(autoNext);
      }
    } catch {
      toast.error('Could not mark this module complete');
    }
  };

  const handleManualProgress = () => {
    setProgress((current) => {
      const next = Math.min(current + 10, 100);
      watchedPercentRef.current = next;
      return next;
    });
  };

  const handleTaskSubmit = () => {
    fileInputRef.current?.click();
  };

  const nextLabel = nextModule && nextModule.levelNumber !== currentLevelInfo?.level.level
    ? 'Next Level →'
    : 'Next Module →';

  return (
    <div
      onContextMenu={(event) => event.preventDefault()}
      style={{ minHeight: '100vh', display: 'flex', background: 'var(--dark)' }}
    >
      <aside
        style={{
          width: 280,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowY: 'auto',
          background: 'var(--dark2)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: 'var(--dark2)',
            zIndex: 2,
            padding: 20,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/dashboard/student')}
            className="mb-4 rounded-xl px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            ← Dashboard
          </button>
          <p
            style={{
              margin: 0,
              color: 'var(--text2)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            {programmeNameFromLevel(currentLevelInfo?.level.level || 1)}
          </p>
        </div>

        <div style={{ padding: 16 }}>
          {loadingCurriculum ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} width="100%" height={72} borderRadius={16} />
              ))}
            </div>
          ) : (
            curriculum.map((level) => {
              const expanded = expandedLevels.includes(level.level);
              const accent = levelAccent[level.status] || levelAccent.locked;

              return (
                <div
                  key={level.level}
                  style={{
                    marginBottom: 12,
                    borderLeft: `3px solid ${accent.borderColor}`,
                    background: accent.background,
                    opacity: accent.opacity,
                    borderRadius: 14,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleLevel(level.level)}
                    className="w-full px-4 py-3 text-left"
                    style={{ background: 'transparent', color: 'var(--text)', border: 'none' }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="m-0 font-clash text-[14px] font-semibold">Level {level.level}</p>
                        <p className="mt-1 mb-0 text-[12px]" style={{ color: 'var(--text2)' }}>{level.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{getStatusIcon(level.status)}</span>
                        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>›</span>
                      </div>
                    </div>
                  </button>

                  {expanded && (
                    <div style={{ padding: '0 10px 12px' }}>
                      {level.modules.map((module) => {
                        const isActive = String(module._id) === String(currentModule?._id);
                        return (
                          <button
                            key={module._id}
                            ref={isActive ? activeModuleRef : null}
                            type="button"
                            onClick={() => handleModuleClick(module)}
                            className="mb-2 flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors"
                            style={{
                              background: isActive ? 'rgba(123, 63, 228, 0.12)' : 'transparent',
                              color: module.status === 'locked' ? 'var(--text2)' : isActive ? 'var(--text)' : 'var(--text2)',
                              cursor: module.status === 'locked' ? 'not-allowed' : 'pointer',
                              textDecoration: module.status === 'completed' ? 'line-through' : 'none',
                              border: 'none',
                            }}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 999,
                                  display: 'inline-block',
                                  ...moduleDot[module.status],
                                }}
                              />
                              <span className="truncate" style={{ fontSize: 13 }}>
                                {module.status === 'locked' ? '🔒 ' : ''}{module.title}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <span style={{ fontSize: 11, color: 'var(--text2)' }}>{module.duration}m</span>
                              {module.isMustDo && (
                                <span
                                  className="rounded-full px-2 py-1 text-[9px] font-semibold uppercase"
                                  style={{ background: 'rgba(255, 92, 40, 0.16)', color: 'var(--orange)' }}
                                >
                                  MUST DO
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

      <main style={{ marginLeft: 280, flex: 1, minHeight: '100vh', overflowY: 'auto', padding: 32 }}>
        <div style={{ margin: '0 auto', maxWidth: 980 }}>
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--dark2)',
              marginBottom: 24,
            }}
          >
            {loadingVideo ? (
              <LoadingSkeleton width="100%" height="100%" borderRadius={0} style={{ background: 'rgba(255, 255, 255, 0.06)' }} />
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={currentModule?.title || 'Video player'}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div style={{ fontSize: 64 }}>▶️</div>
                <p className="mt-4 mb-0 text-[14px]" style={{ color: 'var(--text2)' }}>
                  Select a module to start learning
                </p>
              </div>
            )}
          </div>

          {currentModule && (
            <>
              <div className="mb-8">
                <h1 className="mb-3 font-clash text-[24px] font-semibold text-[var(--text)]">{currentModule.title}</h1>
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  {currentModule.isMustDo && <span className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase" style={{ background: 'rgba(255, 92, 40, 0.16)', color: 'var(--orange)' }}>Must Do</span>}
                  <span className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase" style={{ background: 'rgba(123, 63, 228, 0.16)', color: 'var(--purple)' }}>Level {currentLevelInfo?.level.level || 1}</span>
                  <span className="text-[13px]" style={{ color: 'var(--text2)' }}>⏱ {currentModule.duration} min</span>
                </div>

                <div>
                  <p className="mb-2 text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--text2)' }}>Your progress</p>
                  <div style={{ width: '100%', height: 8, borderRadius: 999, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ width: `${Math.min(100, Math.max(0, progress))}%`, height: '100%', background: 'var(--grad2)', borderRadius: 999 }} />
                  </div>
                  <p className="mt-3 mb-0 text-[12px]" style={{ color: 'var(--text2)' }}>
                    {progress}% watched · complete 85% to unlock next module
                  </p>
                  {progress >= 85 && progress < 100 && (
                    <p className="mt-3 mb-0 text-[14px]" style={{ color: 'var(--green)' }}>
                      ✅ Ready to complete! Click Mark Complete below.
                    </p>
                  )}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px]">
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'var(--grad2)' }}
                  >
                    Mark Complete ✓
                  </button>
                  <button
                    type="button"
                    onClick={handleManualProgress}
                    className="rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                  >
                    +10% watched
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text2)' }}>
                  📋 Practical Task
                </p>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {currentModule.taskDescription || 'Watch the video to reveal your task.'}
                </p>
                <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />
                <input ref={fileInputRef} type="file" hidden onChange={() => toast('Task submission coming soon!', { icon: 'ℹ️' })} />
                <button
                  type="button"
                  onClick={handleTaskSubmit}
                  className="rounded-xl px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  Submit Your Task
                </button>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <button
                  type="button"
                  onClick={() => previousModule && handleModuleClick(previousModule)}
                  disabled={!previousModule}
                  className="rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  ← Previous Module
                </button>
                <button
                  type="button"
                  onClick={() => nextModule && handleModuleClick(nextModule)}
                  disabled={!nextModule || nextModule.status === 'locked'}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: 'var(--grad2)' }}
                >
                  {nextLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
