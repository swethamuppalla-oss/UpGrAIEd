import { Fragment, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/ui/Modal';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { getCreatorStats, getCreatorVideos, uploadVideo } from '../services/api';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'videos', icon: '🎬', label: 'My Videos' },
  { id: 'upload', icon: '📤', label: 'Upload' },
  { id: 'revenue', icon: '💰', label: 'Revenue' },
  { id: 'students', icon: '👥', label: 'Students' },
];

const MOCK_STATS = { totalStudents: 84, studentsThisWeek: 12, totalVideos: 18, totalWatchHours: 340, avgCompletion: 67 };
const MOCK_VIDEOS = [
  { _id: 'v1', title: 'Intro: What is an AI App?', level: 3, duration: 8, views: 74, avgCompletion: 92, status: 'live' },
  { _id: 'v2', title: 'Build a Chatbot UI', level: 3, duration: 15, views: 68, avgCompletion: 61, status: 'live' },
  { _id: 'v3', title: 'Connect to an AI API', level: 3, duration: 12, views: 34, avgCompletion: 45, status: 'live' },
  { _id: 'v4', title: 'AI Automation Intro', level: 4, duration: 10, views: 0, avgCompletion: 0, status: 'draft' },
];
const MOCK_STATEMENTS = [
  { month: 'March 2025', videos: 3, views: 176, watchHours: 89, status: 'sent' },
  { month: 'February 2025', videos: 2, views: 124, watchHours: 61, status: 'sent' },
];
const MOCK_CITIES = [
  { city: 'Bengaluru', count: 28 }, { city: 'Mumbai', count: 19 }, { city: 'Hyderabad', count: 14 },
  { city: 'Chennai', count: 11 }, { city: 'Delhi', count: 8 }, { city: 'Other', count: 4 },
];
const MOCK_GRADES = [
  { grade: 'Grade 8', count: 18 }, { grade: 'Grade 9', count: 16 }, { grade: 'Grade 7', count: 14 },
  { grade: 'Grade 10', count: 12 }, { grade: 'Grade 6', count: 11 }, { grade: 'Grade 11', count: 8 }, { grade: 'Grade 12', count: 5 },
];
const LEVEL_OPTIONS = Array.from({ length: 11 }, (_, i) => i + 1);

const toneStyles = {
  green: { background: 'rgba(76, 217, 100, 0.16)', color: 'var(--green)' },
  orange: { background: 'rgba(255, 92, 40, 0.16)', color: 'var(--orange)' },
  purple: { background: 'rgba(123, 63, 228, 0.16)', color: 'var(--purple)' },
  pink: { background: 'rgba(228, 57, 138, 0.16)', color: 'var(--pink)' },
  yellow: { background: 'rgba(255, 149, 0, 0.16)', color: 'var(--yellow)' },
};

const statusTone = { live: 'green', draft: 'orange', processing: 'purple', sent: 'green', pending: 'orange' };
const statusLabel = { live: 'Live', draft: 'Draft', processing: 'Processing', sent: 'Statement Sent', pending: 'Pending' };

const inputStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
  color: 'var(--text)',
  outline: 'none',
};

const getInitials = (name = 'Creator') => name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
const withPercent = (items, total) => items.map((item) => ({ ...item, percent: total ? Math.round((item.count / total) * 100) : 0 })).sort((a, b) => b.count - a.count);

const StatusPill = ({ tone, children }) => <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={toneStyles[tone] || toneStyles.purple}>{children}</span>;

const ShellCard = ({ title, right, children }) => (
  <section className="rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
    <div className="flex flex-col gap-3 border-b px-5 py-4 md:flex-row md:items-center md:justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
      <p className="m-0 font-clash text-[16px] font-semibold text-[var(--text)]">{title}</p>
      {right}
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const TableSkeleton = ({ rows = 4 }) => <div className="flex flex-col gap-3">{Array.from({ length: rows }).map((_, i) => <LoadingSkeleton key={i} width="100%" height={52} borderRadius={14} />)}</div>;

const MetricBlock = ({ label, value }) => (
  <div className="rounded-2xl p-4" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
    <p className="m-0 text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--text2)' }}>{label}</p>
    <p className="mt-2 mb-0 font-clash text-[22px] font-semibold text-[var(--text)]">{value}</p>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="mb-2 block text-[13px] font-medium text-[var(--text)]">{label}</label>
    {children}
  </div>
);

const BreakdownTable = ({ title, columns, rows }) => (
  <ShellCard title={title}>
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr style={{ color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {columns.map((column) => <th key={column} className="pb-2 text-left font-medium">{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${title}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${title}-${index}-${cellIndex}`} className={`${cellIndex === 0 ? 'rounded-l-2xl' : ''} ${cellIndex === row.length - 1 ? 'rounded-r-2xl' : ''} px-4 py-4`} style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </ShellCard>
);

const EmptyState = ({ onUpload }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div style={{ fontSize: 48 }}>🎬</div>
    <p className="mt-4 mb-1 font-clash text-[24px] font-semibold text-[var(--text)]">No videos yet</p>
    <p className="mb-6 text-[14px]" style={{ color: 'var(--text2)' }}>Upload your first video</p>
    <button type="button" onClick={onUpload} className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'var(--grad2)' }}>+ Upload Video</button>
  </div>
);

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedAnalyticsId, setExpandedAnalyticsId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [form, setForm] = useState({ title: '', programme: 'Junior (Grades 6–10)', level: '1', moduleTitle: '', isMustDo: false, taskDescription: '' });

  useEffect(() => {
    let mounted = true;

    getCreatorStats()
      .then((data) => { if (mounted) setStats(data); })
      .catch(() => { if (mounted) setStats(MOCK_STATS); toast.error('Using fallback creator stats'); })
      .finally(() => { if (mounted) setLoadingStats(false); });

    getCreatorVideos()
      .then((data) => { if (mounted) setVideos(data); })
      .catch(() => { if (mounted) setVideos(MOCK_VIDEOS); toast.error('Using fallback video list'); })
      .finally(() => { if (mounted) setLoadingVideos(false); });

    return () => { mounted = false; };
  }, []);

  const resetUploadState = () => {
    setForm({ title: '', programme: 'Junior (Grades 6–10)', level: '1', moduleTitle: '', isMustDo: false, taskDescription: '' });
    setVideoFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploading(false);
  };

  const closeUploadModal = () => {
    setIsUploadOpen(false);
    resetUploadState();
  };

  const openUploadModal = () => {
    setActiveSection('upload');
    setIsUploadOpen(true);
  };

  const handleFormChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const filteredVideos = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return videos;
    return videos.filter((item) => item.title?.toLowerCase().includes(query));
  }, [search, videos]);

  const creatorName = user?.name || 'Rahul M.';
  const totalStudents = stats?.totalStudents ?? MOCK_STATS.totalStudents;
  const totalActiveThisWeek = stats?.studentsThisWeek ?? MOCK_STATS.studentsThisWeek;
  const cityBreakdown = useMemo(() => withPercent(MOCK_CITIES, totalStudents), [totalStudents]);
  const gradeBreakdown = useMemo(() => withPercent(MOCK_GRADES, totalStudents), [totalStudents]);

  const handleUploadSubmit = async (event) => {
    event.preventDefault();
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('programme', form.programme);
    formData.append('level', form.level);
    formData.append('moduleTitle', form.moduleTitle);
    formData.append('isMustDo', String(form.isMustDo));
    formData.append('taskDescription', form.taskDescription);
    formData.append('video', videoFile);

    setUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    let simulatedProgress = 0;
    const timer = setInterval(() => {
      simulatedProgress = Math.min(simulatedProgress + 7, 92);
      setUploadProgress((current) => Math.max(current, simulatedProgress));
    }, 180);

    try {
      const result = await uploadVideo(formData, (percent) => setUploadProgress(percent));
      clearInterval(timer);
      setUploadStatus('processing');
      setUploadProgress(100);

      setVideos((current) => [{
        ...result.video,
        level: Number(result.video.level || form.level),
        duration: Number(result.video.duration || 0),
        views: 0,
        avgCompletion: 0,
        status: 'processing',
      }, ...current]);

      toast.success('Video uploaded! Bunny.net is processing it.');

      setTimeout(async () => {
        try {
          const refreshed = await getCreatorVideos();
          setVideos(refreshed);
        } catch {
          // Keep optimistic row if refresh fails.
        }
      }, 3000);

      setTimeout(() => closeUploadModal(), 700);
    } catch {
      clearInterval(timer);
      setUploadStatus('failed');
      toast.error('Upload failed');
    } finally {
      clearInterval(timer);
      setUploading(false);
    }
  };

  const renderStatsRow = () => (
    <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {loadingStats
        ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <LoadingSkeleton width={96} height={26} borderRadius={999} />
              <LoadingSkeleton width={120} height={34} borderRadius={12} style={{ marginTop: 18 }} />
              <LoadingSkeleton width={150} height={16} borderRadius={10} style={{ marginTop: 12 }} />
            </div>
          ))
        : [
            { label: 'Students', tone: 'green', value: stats?.totalStudents ?? MOCK_STATS.totalStudents, helper: 'Total enrolled', delta: `+${stats?.studentsThisWeek ?? MOCK_STATS.studentsThisWeek} this week` },
            { label: 'Videos', tone: 'orange', value: stats?.totalVideos ?? MOCK_STATS.totalVideos, helper: 'Videos published' },
            { label: 'Watch Time', tone: 'purple', value: `${stats?.totalWatchHours ?? MOCK_STATS.totalWatchHours}h`, helper: 'Total watch time' },
            { label: 'Completion', tone: 'pink', value: `${stats?.avgCompletion ?? MOCK_STATS.avgCompletion}%`, helper: 'Avg completion rate' },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <StatusPill tone={card.tone}>{card.label}</StatusPill>
              <p className="mt-4 mb-2 font-clash text-[30px] font-bold" style={{ color: 'var(--text)', lineHeight: 1 }}>{card.value}</p>
              <p className="m-0 text-[13px]" style={{ color: 'var(--text2)' }}>{card.helper}</p>
              {card.delta && <p className="mt-2 mb-0 text-[12px]" style={{ color: 'var(--green)' }}>{card.delta}</p>}
            </div>
          ))}
    </section>
  );

  const renderVideosSection = () => (
    <ShellCard
      title="My Published Videos"
      right={<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title" className="w-full rounded-xl px-4 py-2 text-sm md:w-[260px]" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} />}
    >
      {loadingVideos ? <TableSkeleton rows={5} /> : filteredVideos.length === 0 ? <EmptyState onUpload={openUploadModal} /> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr style={{ color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                <th className="pb-2 text-left font-medium">Title</th>
                <th className="pb-2 text-left font-medium">Level</th>
                <th className="pb-2 text-left font-medium">Duration</th>
                <th className="pb-2 text-left font-medium">Views</th>
                <th className="pb-2 text-left font-medium">Completion</th>
                <th className="pb-2 text-left font-medium">Status</th>
                <th className="pb-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((video) => (
                <Fragment key={video._id}>
                  <tr key={video._id}>
                    <td className="rounded-l-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}><span style={{ color: 'var(--text)', fontSize: 14 }}>{video.title}</span></td>
                    <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}><StatusPill tone="purple">Level {video.level}</StatusPill></td>
                    <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text2)' }}>{video.duration || 0} min</td>
                    <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text)' }}>{video.views || 0}</td>
                    <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 80, height: 6, borderRadius: 999, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.08)' }}>
                          <div style={{ width: `${Math.min(100, Math.max(0, video.avgCompletion || 0))}%`, height: '100%', background: 'var(--grad2)', borderRadius: 999 }} />
                        </div>
                        <span style={{ color: 'var(--text2)', fontSize: 13 }}>{video.avgCompletion || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}><StatusPill tone={statusTone[video.status] || 'purple'}>{statusLabel[video.status] || 'Processing'}</StatusPill></td>
                    <td className="rounded-r-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => toast('Video editing will be added next.', { icon: '✏️' })} className="rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-opacity hover:opacity-90" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>Edit</button>
                        <button type="button" onClick={() => setExpandedAnalyticsId((current) => current === video._id ? null : video._id)} className="rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-opacity hover:opacity-90" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>Analytics</button>
                      </div>
                    </td>
                  </tr>
                  {expandedAnalyticsId === video._id && (
                    <tr key={`${video._id}-analytics`}>
                      <td colSpan={7} className="rounded-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                        <div className="grid gap-4 md:grid-cols-3">
                          <MetricBlock label="Views" value={video.views || 0} />
                          <MetricBlock label="Completion" value={`${video.avgCompletion || 0}%`} />
                          <MetricBlock label="Status" value={statusLabel[video.status] || 'Processing'} />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ShellCard>
  );

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Sidebar
        items={SIDEBAR_ITEMS.map((item) => ({ ...item, onClick: () => item.id === 'upload' ? openUploadModal() : setActiveSection(item.id) }))}
        activeItem={activeSection === 'upload' ? 'dashboard' : activeSection}
        userName={creatorName}
        userRole="Content Creator"
        userInitials={getInitials(creatorName)}
      />

      <main className="md:ml-[240px]" style={{ minHeight: '100vh', padding: '32px 40px' }}>
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="m-0 font-clash text-[32px] font-semibold text-[var(--text)]">Creator Dashboard</h1>
            <p className="mt-2 text-[14px]" style={{ color: 'var(--text2)' }}>Welcome back, {creatorName} 👋</p>
          </div>
          <button type="button" onClick={openUploadModal} className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'var(--grad2)' }}>+ Upload Video</button>
        </header>

        {(activeSection === 'dashboard' || activeSection === 'videos' || activeSection === 'upload') && renderStatsRow()}
        {(activeSection === 'dashboard' || activeSection === 'videos' || activeSection === 'upload') && <div className="mb-8">{renderVideosSection()}</div>}

        {activeSection === 'revenue' && (
          <div className="grid gap-8">
            <ShellCard title="Retainer Information">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <p className="mb-2 font-clash text-[20px] font-semibold text-[var(--text)]">You are on a fixed retainer</p>
                <p className="mb-2 text-[14px]" style={{ color: 'var(--text2)' }}>Revenue share is managed by D Kalash (OPC) Private Limited</p>
                <p className="m-0 text-[14px]" style={{ color: 'var(--text2)' }}>Your retainer is paid monthly by D Kalash</p>
              </div>
            </ShellCard>

            <ShellCard title="Platform Performance">
              {loadingStats ? <TableSkeleton rows={4} /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricBlock label="Total students on platform" value={stats?.totalStudents ?? MOCK_STATS.totalStudents} />
                <MetricBlock label="Total watch hours" value={`${stats?.totalWatchHours ?? MOCK_STATS.totalWatchHours}h`} />
                <MetricBlock label="Your videos" value={`${stats?.totalVideos ?? MOCK_STATS.totalVideos} published`} />
                <MetricBlock label="Average completion" value={`${stats?.avgCompletion ?? MOCK_STATS.avgCompletion}%`} />
              </div>}
            </ShellCard>

            <BreakdownTable title="Monthly Statements" columns={['Month', 'Videos Published', 'Total Views', 'Watch Hours', 'Status']} rows={MOCK_STATEMENTS.map((item) => [item.month, item.videos, item.views, `${item.watchHours}h`, <StatusPill tone={statusTone[item.status] || 'orange'}>{statusLabel[item.status] || 'Pending'}</StatusPill>])} />
          </div>
        )}

        {activeSection === 'students' && (
          <div className="grid gap-8">
            <ShellCard title="Student Overview">
              {loadingStats ? <div className="grid gap-4 md:grid-cols-2"><LoadingSkeleton width="100%" height={90} borderRadius={16} /><LoadingSkeleton width="100%" height={90} borderRadius={16} /></div> : <div className="grid gap-4 md:grid-cols-2"><MetricBlock label="Total enrolled" value={totalStudents} /><MetricBlock label="Active this week" value={totalActiveThisWeek} /></div>}
            </ShellCard>
            <BreakdownTable title="Geographic Breakdown" columns={['City', 'Students', '% of Total']} rows={cityBreakdown.map((item) => [item.city, item.count, `${item.percent}%`])} />
            <BreakdownTable title="Grade Breakdown" columns={['Grade', 'Students', '% of Total']} rows={gradeBreakdown.map((item) => [item.grade, item.count, `${item.percent}%`])} />
          </div>
        )}

        <Modal open={isUploadOpen} onClose={closeUploadModal} title="Upload New Video">
          <div style={{ maxWidth: 520, width: '100%' }}>
            {uploadStatus !== 'idle' ? (
              <div className="space-y-4">
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <p className="mb-2 text-[14px] font-medium text-[var(--text)]">{videoFile?.name}</p>
                  <div style={{ width: '100%', height: 8, borderRadius: 999, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--grad2)', borderRadius: 999 }} />
                  </div>
                  <p className="mt-3 mb-0 text-[13px]" style={{ color: 'var(--text2)' }}>
                    {uploadStatus === 'uploading' && 'Uploading...'}
                    {uploadStatus === 'processing' && 'Processing...'}
                    {uploadStatus === 'failed' && 'Upload failed'}
                  </p>
                </div>
                {uploadStatus === 'failed' && (
                  <button type="button" onClick={() => { setUploadStatus('idle'); setUploadProgress(0); }} className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
                    Back to form
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <Field label="Video Title">
                  <input required value={form.title} onChange={(event) => handleFormChange('title', event.target.value)} placeholder="e.g. Build a Chatbot UI" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} />
                </Field>
                <Field label="Select Programme">
                  <select required value={form.programme} onChange={(event) => handleFormChange('programme', event.target.value)} className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}>
                    <option>Junior (Grades 6–10)</option>
                    <option>Senior (Grades 11–12)</option>
                  </select>
                </Field>
                <Field label="Select Level">
                  <select required value={form.level} onChange={(event) => handleFormChange('level', event.target.value)} className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}>
                    {LEVEL_OPTIONS.map((level) => <option key={level} value={level}>Level {level}</option>)}
                  </select>
                </Field>
                <Field label="Module Title">
                  <input required value={form.moduleTitle} onChange={(event) => handleFormChange('moduleTitle', event.target.value)} placeholder="e.g. Module 2 — Chatbot Basics" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} />
                </Field>
                <Field label="Is this a MUST DO module?">
                  <label className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div>
                      <p className="m-0 text-[14px] text-[var(--text)]">{form.isMustDo ? 'Enabled' : 'Disabled'}</p>
                      <p className="mt-1 mb-0 text-[12px]" style={{ color: 'var(--text2)' }}>MUST DO modules gate the next level</p>
                    </div>
                    <button type="button" onClick={() => handleFormChange('isMustDo', !form.isMustDo)} className="relative h-7 w-14 rounded-full transition-colors" style={{ background: form.isMustDo ? 'var(--grad2)' : 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <span style={{ position: 'absolute', top: 2, left: form.isMustDo ? 30 : 3, width: 21, height: 21, borderRadius: 999, background: 'var(--text)', transition: 'left 0.2s ease' }} />
                    </button>
                  </label>
                </Field>
                <Field label="Task Description">
                  <textarea rows={4} value={form.taskDescription} onChange={(event) => handleFormChange('taskDescription', event.target.value)} placeholder="Describe what students should build..." className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} />
                </Field>
                <Field label="Video File">
                  {!videoFile ? (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.16)', background: 'rgba(255, 255, 255, 0.02)' }}>
                      <input type="file" accept="video/mp4" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) setVideoFile(file); }} />
                      <div style={{ fontSize: 30 }}>📤</div>
                      <p className="mt-3 mb-1 text-[14px] font-medium text-[var(--text)]">Drag &amp; drop your MP4 here</p>
                      <p className="mb-2 text-[13px]" style={{ color: 'var(--text2)' }}>or click to browse</p>
                      <p className="m-0 text-[12px]" style={{ color: 'var(--text2)' }}>Max file size: 2GB · MP4 only</p>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div>
                        <p className="m-0 text-[14px] text-[var(--text)]">{videoFile.name}</p>
                        <p className="mt-1 mb-0 text-[12px]" style={{ color: 'var(--text2)' }}>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button type="button" onClick={() => setVideoFile(null)} className="text-[13px] font-semibold" style={{ color: 'var(--orange)' }}>Remove</button>
                    </div>
                  )}
                </Field>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={closeUploadModal} className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>Cancel</button>
                  <button type="submit" disabled={!videoFile || uploading} className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" style={{ background: 'var(--grad2)' }}>
                    {uploading ? 'Uploading...' : 'Upload & Publish'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      </main>
    </div>
  );
}
