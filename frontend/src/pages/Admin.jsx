import React from 'react';
import SEO from '../components/SEO';
import { H1, H2 } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import TipTapEditor from '../components/ui/TipTapEditor';
import ContentRenderer from '../components/ui/ContentRenderer';
// import sanitizeHtml from '../utils/sanitizeHtml';
import { CATEGORIES } from '../constants/categories';
import { generateArticleGrid } from '../data/mockArticles';
import { getUpcomingTrainings, getUpcomingCourses } from '../data/mockTraining';
import { api } from '../services/api';
import { FaEye, FaTrash, FaClock, FaEdit, FaPlus, FaUpload, FaLink } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import Modal from '../components/ui/Modal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export default function Admin() {
  const { showToast } = useToast();
  const [role, setRole] = React.useState('viewer');
  React.useEffect(() => {
    setRole(localStorage.getItem('auth_role') || 'viewer');
  }, []);
  const canEdit = role === 'admin' || role === 'editor';
  const roleBadge =
    role === 'admin'
      ? 'border-red-200 text-red-700 bg-red-50'
      : role === 'editor'
        ? 'border-blue-200 text-blue-700 bg-blue-50'
        : 'border-gray-200 text-gray-700 bg-gray-50';
  // Seed mock lists for CRUD tables
  const [articles, setArticles] = React.useState(() =>
    generateArticleGrid(18).map((a, i) => ({
      ...a,
      status: i % 3 === 0 ? 'draft' : 'published',
      scheduledAt: '',
    })),
  );
  const [insights, setInsights] = React.useState(() =>
    generateArticleGrid(10).map((a, i) => ({
      ...a,
      category: 'Insight',
      status: i % 2 ? 'draft' : 'published',
      scheduledAt: '',
    })),
  );

  // Podcasts (mock)
  const [podcasts, setPodcasts] = React.useState(() =>
    generateArticleGrid(8).map((a, i) => ({
      id: a.id + 1000,
      title: `Podcast #${i + 1}: ${a.title}`,
      category: 'Podcast',
      status: i % 2 ? 'draft' : 'published',
      scheduledAt: '',
      image: a.image,
      date: a.date,
      duration: `${20 + (i % 4) * 10} min`,
    })),
  );

  // Talents (moderation list)
  const [talents, setTalents] = React.useState([]);

  // Trainings/Courses combined programs list
  const [programs, setPrograms] = React.useState(() => {
    const t = getUpcomingTrainings().map((x) => ({
      id: 2000 + x.id,
      title: x.title,
      category: x.category,
      type: 'Training',
      status: 'published',
      scheduledAt: '',
      date: x.date,
      duration: x.duration || '',
      location: x.location || '',
      modality: x.modality || '',
      image: x.image,
    }));
    const c = getUpcomingCourses().map((x) => ({
      id: 3000 + x.id,
      title: x.title,
      category: x.category,
      type: 'Course',
      status: 'published',
      scheduledAt: '',
      date: x.date,
      duration: x.duration || '',
      location: x.location || '',
      modality: x.modality || '',
      image: x.image,
    }));
    return [...t, ...c];
  });
  // Seed to API storage and hydrate lists on mount
  React.useEffect(() => {
    try {
      if (!localStorage.getItem('ldi_admin_ads')) {
        const legacy = localStorage.getItem('ads_list');
        if (legacy) localStorage.setItem('ldi_admin_ads', legacy);
      }
    } catch {
      /* empty */
    }
    api.initList('articles', articles);
    api.initList('insights', insights);
    api.initList('podcasts', podcasts);
    api.initList('talents', []);
    api.initList('programs', programs);
    api.initList('ads', ads);
    (async () => {
      const [la, li, lp, lpr, lad, lt] = await Promise.all([
        api.list('articles'),
        api.list('insights'),
        api.list('podcasts'),
        api.list('programs'),
        api.list('ads'),
        api.list('talents'),
      ]);
      setArticles(la);
      setInsights(li);
      setPodcasts(lp);
      setPrograms(lpr);
      setAds(lad);
      setTalents(lt);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Advertisements list (persisted in localStorage)
  const [ads, setAds] = React.useState(() => {
    const saved = localStorage.getItem('ads_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* empty */
      }
    }
    return [
      {
        id: 9001,
        title: 'LDI Community — Join Now',
        image: '/LDI_favicon.png',
        link: 'https://github.com/LiberiaDigitalInsights',
        position: 'inline',
        status: 'published',
        scheduledAt: '',
      },
    ];
  });
  React.useEffect(() => {
    try {
      localStorage.setItem('ads_list', JSON.stringify(ads));
    } catch {
      /* empty */
    }
  }, [ads]);

  // Stats derived from state
  const stats = {
    articles: articles.length,
    insights: insights.length,
    podcasts: podcasts.length,
    trainingsCourses: programs.length,
  };
  const setStatus = async (type, setList, id, status) => {
    let snapshot = null;
    setList((prev) => {
      snapshot = prev;
      return prev.map((x) => (x.id === id ? { ...x, status } : x));
    });
    try {
      await api.toggle(type, id, { status });
    } catch {
      if (snapshot) setList(snapshot);
      showToast({ title: 'Error', description: 'Failed to update status.', variant: 'error' });
    }
  };

  // Chart UI state: hover linkage and time range
  const [hoverArticles, setHoverArticles] = React.useState(null);
  const [hoverInsights, setHoverInsights] = React.useState(null);
  const [hoverPodcasts, setHoverPodcasts] = React.useState(null);
  const [hoverPrograms, setHoverPrograms] = React.useState(null);
  const [rangeDays, setRangeDays] = React.useState(() => {
    const saved = localStorage.getItem('admin_chart_range');
    return saved ? Number(saved) : 30; // default 30 days
  });
  React.useEffect(() => {
    localStorage.setItem('admin_chart_range', String(rangeDays));
  }, [rangeDays]);

  const statusData = React.useMemo(() => {
    const aPub = articles.filter((x) => x.status === 'published').length;
    const aDraft = articles.length - aPub;
    const iPub = insights.filter((x) => x.status === 'published').length;
    const iDraft = insights.length - iPub;
    const pPub = podcasts.filter((x) => x.status === 'published').length;
    const pDraft = podcasts.length - pPub;
    const prPub = programs.filter((x) => x.status === 'published').length;
    const prDraft = programs.length - prPub;
    return [
      { name: 'Articles', published: aPub, draft: aDraft },
      { name: 'Insights', published: iPub, draft: iDraft },
      { name: 'Podcasts', published: pPub, draft: pDraft },
      { name: 'Trainings/Courses', published: prPub, draft: prDraft },
    ];
  }, [articles, insights, podcasts, programs]);

  const categoryData = React.useMemo(() => {
    const counts = new Map();
    [...articles, ...insights, ...podcasts, ...programs].forEach((x) => {
      const key = x.category || 'Other';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const arr = Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr.slice(0, 6);
  }, [articles, insights, podcasts, programs]);

  const trendData = React.useMemo(() => {
    const buckets = rangeDays; // 7/30/90 day buckets for demo
    const labels = Array.from({ length: buckets }, (_, i) => `D${i + 1}`);
    const aCounts = Array(buckets).fill(0);
    const iCounts = Array(buckets).fill(0);
    const pCounts = Array(buckets).fill(0);
    const prCounts = Array(buckets).fill(0);
    articles.forEach((_, idx) => {
      aCounts[idx % buckets]++;
    });
    insights.forEach((_, idx) => {
      iCounts[idx % buckets]++;
    });
    podcasts.forEach((_, idx) => {
      pCounts[idx % buckets]++;
    });
    programs.forEach((_, idx) => {
      prCounts[idx % buckets]++;
    });
    return labels.map((name, i) => ({
      name,
      Articles: aCounts[i],
      Insights: iCounts[i],
      Podcasts: pCounts[i],
      Programs: prCounts[i],
    }));
  }, [articles, insights, podcasts, programs, rangeDays]);

  // Dark-mode-aware color tokens with fallbacks
  const CHART = {
    published: 'var(--chart-published, #22C55E)',
    draft: 'var(--chart-draft, #F59E0B)',
    articles: 'var(--chart-articles, #6366F1)',
    insights: 'var(--chart-insights, #06B6D4)',
    podcasts: 'var(--chart-podcasts, #10B981)',
    programs: 'var(--chart-programs, #F97316)',
    pie: [
      'var(--chart-1, #6366F1)',
      'var(--chart-2, #22C55E)',
      'var(--chart-3, #F59E0B)',
      'var(--chart-4, #EF4444)',
      'var(--chart-5, #06B6D4)',
      'var(--chart-6, #A855F7)',
    ],
  };
  const pieColors = CHART.pie;

  const youTubeEmbed = React.useCallback((url) => {
    try {
      const u = new URL(String(url));
      if (u.hostname.includes('youtu.be'))
        return `https://www.youtube.com/embed/${u.pathname.replace('/', '')}`;
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;
        const parts = u.pathname.split('/');
        const idx = parts.indexOf('embed');
        if (idx >= 0 && parts[idx + 1]) return `https://www.youtube.com/embed/${parts[idx + 1]}`;
        // shorts format: /shorts/<id>
        const sIdx = parts.indexOf('shorts');
        if (sIdx >= 0 && parts[sIdx + 1]) return `https://www.youtube.com/embed/${parts[sIdx + 1]}`;
      }
    } catch {
      /* empty */
    }
    return '';
  }, []);

  const safeUrl = (val) => {
    const s = String(val || '').trim();
    if (!s) return '';
    return s;
  };

  const isFacebookUrl = (val) => {
    try {
      const u = new URL(String(val));
      return u.hostname.includes('facebook.com') || u.hostname.includes('fb.com');
    } catch {
      return false;
    }
  };

  const isHttpUrl = (val) => {
    try {
      const u = new URL(String(val));
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isDataUrl = (val) =>
    String(val || '')
      .trim()
      .startsWith('data:');

  // Filters and pagination for Articles
  const [aQuery, setAQuery] = React.useState('');
  const [aStatus, setAStatus] = React.useState('all');
  const [aSort, setASort] = React.useState('title_asc');
  const [aPage, setAPage] = React.useState(1);
  const aPageSize = 5;
  const filteredArticles = articles.filter(
    (x) =>
      (aStatus === 'all' || x.status === aStatus) &&
      (!aQuery || x.title.toLowerCase().includes(aQuery.toLowerCase())),
  );
  const aSorted = React.useMemo(() => {
    const arr = [...filteredArticles];
    const titleCmp = (a, b) => a.title.localeCompare(b.title);
    const dateVal = (x) => new Date(x.date || x.scheduledAt || 0).getTime() || 0;
    if (aSort === 'title_asc') arr.sort(titleCmp);
    else if (aSort === 'title_desc') arr.sort((a, b) => -titleCmp(a, b));
    else if (aSort === 'status_pub')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'published' ? -1 : 1));
    else if (aSort === 'status_draft')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'draft' ? -1 : 1));
    else if (aSort === 'date_new') arr.sort((a, b) => dateVal(b) - dateVal(a));
    else if (aSort === 'date_old') arr.sort((a, b) => dateVal(a) - dateVal(b));
    return arr;
  }, [filteredArticles, aSort]);
  const aTotalPages = Math.max(1, Math.ceil(aSorted.length / aPageSize));
  const aPaged = aSorted.slice((aPage - 1) * aPageSize, aPage * aPageSize);

  // Filters and pagination for Insights
  const [iQuery, setIQuery] = React.useState('');
  const [iStatus, setIStatus] = React.useState('all');
  const [iSort, setISort] = React.useState('title_asc');
  const [iPage, setIPage] = React.useState(1);
  const iPageSize = 5;
  const filteredInsights = insights.filter(
    (x) =>
      (iStatus === 'all' || x.status === iStatus) &&
      (!iQuery || x.title.toLowerCase().includes(iQuery.toLowerCase())),
  );
  const iSorted = React.useMemo(() => {
    const arr = [...filteredInsights];
    const titleCmp = (a, b) => a.title.localeCompare(b.title);
    const dateVal = (x) => new Date(x.date || x.scheduledAt || 0).getTime() || 0;
    if (iSort === 'title_asc') arr.sort(titleCmp);
    else if (iSort === 'title_desc') arr.sort((a, b) => -titleCmp(a, b));
    else if (iSort === 'status_pub')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'published' ? -1 : 1));
    else if (iSort === 'status_draft')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'draft' ? -1 : 1));
    else if (iSort === 'date_new') arr.sort((a, b) => dateVal(b) - dateVal(a));
    else if (iSort === 'date_old') arr.sort((a, b) => dateVal(a) - dateVal(b));
    return arr;
  }, [filteredInsights, iSort]);
  const iTotalPages = Math.max(1, Math.ceil(iSorted.length / iPageSize));
  const iPaged = iSorted.slice((iPage - 1) * iPageSize, iPage * iPageSize);

  // Filters and pagination for Podcasts
  const [pQuery, setPQuery] = React.useState('');
  const [pStatus, setPStatus] = React.useState('all');
  const [pSort, setPSort] = React.useState('title_asc');
  const [pPage, setPPage] = React.useState(1);
  const pPageSize = 5;
  const filteredPodcasts = podcasts.filter(
    (x) =>
      (pStatus === 'all' || x.status === pStatus) &&
      (!pQuery || x.title.toLowerCase().includes(pQuery.toLowerCase())),
  );
  const pSorted = React.useMemo(() => {
    const arr = [...filteredPodcasts];
    const titleCmp = (a, b) => a.title.localeCompare(b.title);
    const dateVal = (x) => new Date(x.date || x.scheduledAt || 0).getTime() || 0;
    if (pSort === 'title_asc') arr.sort(titleCmp);
    else if (pSort === 'title_desc') arr.sort((a, b) => -titleCmp(a, b));
    else if (pSort === 'status_pub')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'published' ? -1 : 1));
    else if (pSort === 'status_draft')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'draft' ? -1 : 1));
    else if (pSort === 'date_new') arr.sort((a, b) => dateVal(b) - dateVal(a));
    else if (pSort === 'date_old') arr.sort((a, b) => dateVal(a) - dateVal(b));
    return arr;
  }, [filteredPodcasts, pSort]);
  const pTotalPages = Math.max(1, Math.ceil(pSorted.length / pPageSize));
  const pPaged = pSorted.slice((pPage - 1) * pPageSize, pPage * pPageSize);

  // Filters and pagination for Programs (Training/Courses)
  const [prQuery, setPrQuery] = React.useState('');
  const [prStatus, setPrStatus] = React.useState('all');
  const [prPage, setPrPage] = React.useState(1);
  const prPageSize = 5;
  const filteredPrograms = programs.filter(
    (x) =>
      (prStatus === 'all' || x.status === prStatus) &&
      (!prQuery || x.title.toLowerCase().includes(prQuery.toLowerCase())),
  );
  const prTotalPages = Math.max(1, Math.ceil(filteredPrograms.length / prPageSize));
  const prPaged = filteredPrograms.slice((prPage - 1) * prPageSize, prPage * prPageSize);

  // Filters and pagination for Advertisements
  const [adQuery, setAdQuery] = React.useState('');
  const [adStatus, setAdStatus] = React.useState('all');
  const [adSort, setAdSort] = React.useState('title_asc');
  const [adPage, setAdPage] = React.useState(1);
  const adPageSize = 5;
  const filteredAds = ads.filter(
    (x) =>
      (adStatus === 'all' || x.status === adStatus) &&
      (!adQuery || x.title.toLowerCase().includes(adQuery.toLowerCase())),
  );
  const adSorted = React.useMemo(() => {
    const arr = [...filteredAds];
    const titleCmp = (a, b) => a.title.localeCompare(b.title);
    if (adSort === 'title_asc') arr.sort(titleCmp);
    else if (adSort === 'title_desc') arr.sort((a, b) => -titleCmp(a, b));
    else if (adSort === 'status_pub')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'published' ? -1 : 1));
    else if (adSort === 'status_draft')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'draft' ? -1 : 1));
    return arr;
  }, [filteredAds, adSort]);
  const adTotalPages = Math.max(1, Math.ceil(adSorted.length / adPageSize));
  const adPaged = adSorted.slice((adPage - 1) * adPageSize, adPage * adPageSize);

  // Filters and pagination for Talents
  const [tQuery, setTQuery] = React.useState('');
  const [tStatus, setTStatus] = React.useState('all');
  const [tSort, setTSort] = React.useState('name_asc');
  const [tPage, setTPage] = React.useState(1);
  const tPageSize = 5;
  const filteredTalents = talents.filter(
    (x) => (tStatus === 'all' || x.status === tStatus) && (!tQuery || x.name.toLowerCase().includes(tQuery.toLowerCase())),
  );
  const tSorted = React.useMemo(() => {
    const arr = [...filteredTalents];
    const nameCmp = (a, b) => (a.name || '').localeCompare(b.name || '');
    if (tSort === 'name_asc') arr.sort(nameCmp);
    else if (tSort === 'name_desc') arr.sort((a, b) => -nameCmp(a, b));
    else if (tSort === 'status_pub')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'published' ? -1 : 1));
    else if (tSort === 'status_draft')
      arr.sort((a, b) => (a.status === b.status ? 0 : a.status === 'pending' || a.status === 'draft' ? -1 : 1));
    return arr;
  }, [filteredTalents, tSort]);
  const tTotalPages = Math.max(1, Math.ceil(tSorted.length / tPageSize));
  const tPaged = tSorted.slice((tPage - 1) * tPageSize, tPage * tPageSize);

  // Actions (per-collection type)
  const togglePublish = async (type, setList, id) => {
    let snapshot = null;
    let nextFields = null;
    setList((prev) => {
      snapshot = prev;
      const curr = prev.find((x) => x.id === id);
      if (!curr) return prev;
      nextFields = { status: curr.status === 'published' ? 'draft' : 'published' };
      return prev.map((x) => (x.id === id ? { ...x, ...nextFields } : x));
    });
    try {
      await api.toggle(type, id, nextFields || {});
    } catch {
      if (snapshot) setList(snapshot);
      showToast({ title: 'Error', description: 'Failed to update status.', variant: 'error' });
    }
  };
  const setSchedule = async (type, setList, id, value) => {
    let snapshot = null;
    setList((prev) => {
      snapshot = prev;
      return prev.map((x) => (x.id === id ? { ...x, scheduledAt: value } : x));
    });
    try {
      await api.update(type, { id, scheduledAt: value });
    } catch {
      if (snapshot) setList(snapshot);
      showToast({ title: 'Error', description: 'Failed to save schedule.', variant: 'error' });
    }
  };
  const removeItem = async (type, setList, id) => {
    let snapshot = null;
    setList((prev) => {
      snapshot = prev;
      return prev.filter((x) => x.id !== id);
    });
    try {
      await api.remove(type, id);
      showToast({ title: 'Deleted', description: 'Item was deleted.', variant: 'success' });
    } catch {
      if (snapshot) setList(snapshot);
      showToast({ title: 'Error', description: 'Failed to delete item.', variant: 'error' });
    }
  };

  // Schedule modal (for small screens)
  const [schedOpen, setSchedOpen] = React.useState(false);
  const [schedList, setSchedList] = React.useState('articles'); // 'articles' | 'insights'
  const [schedId, setSchedId] = React.useState(null);
  const [schedValue, setSchedValue] = React.useState('');
  const openSchedule = (listType, row) => {
    setSchedList(listType);
    setSchedId(row.id);
    setSchedValue(row.scheduledAt || '');
    setSchedOpen(true);
  };
  const saveSchedule = () => {
    if (schedId == null) return;
    if (schedList === 'articles') setSchedule('articles', setArticles, schedId, schedValue);
    else setSchedule('insights', setInsights, schedId, schedValue);
    setSchedOpen(false);
    showToast({ title: 'Scheduled', description: 'Publication time saved.', variant: 'success' });
  };

  // Create/Edit modal
  const emptyForm = {
    id: null,
    title: '',
    category: '',
    type: '',
    date: '',
    duration: '',
    location: '',
    modality: '',
    excerpt: '',
    content: '',
    readTime: 3,
    image: '/LDI_favicon.png',
    link: '',
    position: 'inline',
    status: 'draft',
    scheduledAt: '',
    tags: [],
    rotateSeconds: '', // ads global rotation override (stored in localStorage)
    audioUrl: '',
    videoUrl: '',
    embedYouTube: '',
    embedFacebook: '',
    embedOther: '',
  };
  const [editOpen, setEditOpen] = React.useState(false);
  const [editList, setEditList] = React.useState('articles');
  const [form, setForm] = React.useState(emptyForm);
  const [isEdit, setIsEdit] = React.useState(false);
  const [contentTab, setContentTab] = React.useState(
    () => localStorage.getItem('admin_editor_tab') || 'edit',
  ); // 'edit' | 'preview'
  React.useEffect(() => {
    localStorage.setItem('admin_editor_tab', contentTab);
  }, [contentTab]);
  const openCreate = (listType) => {
    setEditList(listType);
    setIsEdit(false);
    setForm({ ...emptyForm, id: null });
    setContentTab(localStorage.getItem('admin_editor_tab') || 'edit');
    setEditOpen(true);
  };
  const openEdit = (listType, row) => {
    setEditList(listType);
    setIsEdit(true);
    setForm({
      id: row.id,
      title: row.title || '',
      category: row.category || '',
      type: row.type || (listType === 'programs' ? 'Training' : ''),
      date: row.date || '',
      duration: row.duration || '',
      location: row.location || '',
      modality: row.modality || '',
      excerpt: row.excerpt || '',
      content: row.content || '',
      readTime: row.readTime || 3,
      image: row.image || '/LDI_favicon.png',
      link: row.link || '',
      position: row.position || 'inline',
      status: row.status || 'draft',
      scheduledAt: row.scheduledAt || '',
      tags: Array.isArray(row.tags) ? row.tags : [],
      rotateSeconds: (() => {
        try {
          const v = localStorage.getItem('ads_rotate_seconds');
          return v ?? '';
        } catch {
          return '';
        }
      })(),
      audioUrl: row.audioUrl || '',
      videoUrl: row.videoUrl || '',
      embedYouTube: row.embedYouTube || '',
      embedFacebook: row.embedFacebook || '',
      embedOther: row.embedOther || '',
    });
    setContentTab(localStorage.getItem('admin_editor_tab') || 'edit');
    setEditOpen(true);
  };
  const saveForm = async () => {
    if (!canEdit) return;
    // basic validation
    if (!String(form.title || '').trim()) {
      showToast({ title: 'Validation', description: 'Title is required.', variant: 'error' });
      return;
    }
    if (
      (editList === 'articles' || editList === 'insights') &&
      !String(form.category || '').trim()
    ) {
      showToast({ title: 'Validation', description: 'Category is required.', variant: 'error' });
      return;
    }
    if (editList === 'podcasts') {
      const hasMedia = [
        form.audioUrl,
        form.videoUrl,
        form.embedYouTube,
        form.embedFacebook,
        form.embedOther,
      ].some((v) => String(v || '').trim());
      if (!hasMedia) {
        showToast({
          title: 'Validation',
          description: 'Provide at least one podcast media source (audio, video, or embed).',
          variant: 'error',
        });
        return;
      }
    }
    // normalize tags as array
    const norm = {
      ...form,
      tags: Array.isArray(form.tags)
        ? form.tags.filter(Boolean)
        : String(form.tags || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
    };

    // persist ads rotation setting if provided
    if (editList === 'ads') {
      const n = Number(norm.rotateSeconds);
      if (!Number.isNaN(n) && n > 0) {
        try {
          localStorage.setItem('ads_rotate_seconds', String(n));
        } catch {
          /* Empty Comment */
        }
      }
    }

    // call mock api then update local state
    try {
      let saved;
      if (isEdit && norm.id != null) saved = await api.update(editList, norm);
      else saved = await api.create(editList, norm);

      const apply = (prev) => {
        if (isEdit && saved.id != null) {
          return prev.map((x) => (x.id === saved.id ? { ...x, ...saved } : x));
        }
        return [saved, ...prev];
      };
      if (editList === 'articles') setArticles(apply);
      else if (editList === 'insights') setInsights(apply);
      else if (editList === 'podcasts') setPodcasts(apply);
      else if (editList === 'programs') setPrograms(apply);
      else if (editList === 'ads') setAds(apply);
      setEditOpen(false);
      showToast({
        title: isEdit ? 'Updated' : 'Created',
        description: `Item ${isEdit ? 'updated' : 'created'} successfully.`,
        variant: 'success',
      });
    } catch {
      showToast({ title: 'Error', description: 'Failed to save changes.', variant: 'error' });
    }
  };

  // Confirm delete modal
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(() => () => {});
  const askConfirm = (action) => {
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [reviewItem, setReviewItem] = React.useState(null);
  const openReview = (row) => {
    setReviewItem(row);
    setReviewOpen(true);
  };
  const publishReviewed = async () => {
    if (!reviewItem) return;
    await setStatus('talents', setTalents, reviewItem.id, 'published');
    setReviewOpen(false);
    setReviewItem(null);
    showToast({ title: 'Published', description: 'Talent is now live.', variant: 'success' });
  };

  return (
    <>
      <SEO title="Admin" />
      <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <H1 className="text-3xl font-bold">Admin Dashboard</H1>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${roleBadge}`}
              title={`Current role: ${role}`}
              aria-label={`Current role: ${role}`}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-70" />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
            <select
              aria-label="Switch role"
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm"
              value={role}
              onChange={(e) => {
                const next = e.target.value;
                setRole(next);
                localStorage.setItem('auth_role', next);
                showToast({
                  title: 'Role switched',
                  description: `Now acting as ${next}.`,
                  variant: 'info',
                });
              }}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                localStorage.removeItem('auth_admin');
                localStorage.removeItem('auth_role');
                // Force a hard navigation so AuthGate re-evaluates on mount
                window.location.replace('/admin');
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="flex flex-col gap-1 text-sm">
                  <Link
                    className="rounded px-3 py-2 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                    to="/admin"
                  >
                    Overview
                  </Link>
                  <Link
                    className="rounded px-3 py-2 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                    to="/articles"
                  >
                    Articles
                  </Link>
                  <Link
                    className="rounded px-3 py-2 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                    to="/insights"
                  >
                    Insights
                  </Link>
                  <Link
                    className="rounded px-3 py-2 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                    to="/podcasts"
                  >
                    Podcasts
                  </Link>
                  <Link
                    className="rounded px-3 py-2 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
                    to="/training-courses"
                  >
                    Training & Courses
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main */}
          <main className="flex flex-col gap-8">
            {/* Stats */}
            <section className="order-10">
              <H2 className="mb-4 text-2xl">Overview</H2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Articles', value: stats.articles },
                  { label: 'Insights', value: stats.insights },
                  { label: 'Podcasts', value: stats.podcasts },
                  { label: 'Trainings/Courses', value: stats.trainingsCourses },
                ].map((s) => {
                  const val =
                    s.label === 'Articles' && hoverArticles != null
                      ? hoverArticles
                      : s.label === 'Insights' && hoverInsights != null
                        ? hoverInsights
                        : s.label === 'Podcasts' && hoverPodcasts != null
                          ? hoverPodcasts
                          : s.label === 'Trainings/Courses' && hoverPrograms != null
                            ? hoverPrograms
                            : s.value;
                  return (
                    <Card key={s.label} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>{s.label}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-extrabold">{val}</div>
                        <div className="text-sm text-[var(--color-muted)]">Total</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Advertisements CRUD table */}
            <section className="order-70">
              <Card>
                <CardHeader>
                  <CardTitle>Advertisements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Search</label>
                      <Input
                        value={adQuery}
                        onChange={(e) => {
                          setAdQuery(e.target.value);
                          setAdPage(1);
                        }}
                        placeholder="Title..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Status</label>
                      <Select
                        value={adStatus}
                        onChange={(e) => {
                          setAdStatus(e.target.value);
                          setAdPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Sort by</label>
                      <Select
                        value={adSort}
                        onChange={(e) => {
                          setAdSort(e.target.value);
                          setAdPage(1);
                        }}
                      >
                        <option value="title_asc">Title A→Z</option>
                        <option value="title_desc">Title Z→A</option>
                        <option value="status_pub">Published first</option>
                        <option value="status_draft">Draft first</option>
                      </Select>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full table-fixed text-xs sm:text-sm">
                      <thead className="text-left text-[var(--color-muted)] text-xs sm:text-sm">
                        <tr>
                          <th className="px-2 py-2 md:w-[40%]">Title</th>
                          <th className="px-2 py-2 hidden sm:table-cell md:w-[20%]">Position</th>
                          <th className="px-2 py-2 md:w-[14%]">Status</th>
                          <th className="px-2 py-2 hidden md:table-cell md:w-[16%]">Schedule</th>
                          <th className="px-2 py-2 md:w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adPaged.map((row) => (
                          <tr key={row.id} className="border-t border-[var(--color-border)]">
                            <td className="px-2 py-2 pr-4 break-words whitespace-normal">
                              <div className="flex items-center gap-2">
                                <img
                                  src={row.image}
                                  alt="ad"
                                  className="h-8 w-8 rounded object-cover"
                                />
                                <div className="line-clamp-2">{row.title}</div>
                              </div>
                            </td>
                            <td className="px-2 py-2 hidden sm:table-cell">{row.position}</td>
                            <td className="px-2 py-2">
                              <Button
                                size="sm"
                                variant={row.status === 'published' ? 'secondary' : 'solid'}
                                onClick={() =>
                                  askConfirm(() => {
                                    if (!canEdit) return;
                                    togglePublish('ads', setAds, row.id);
                                    showToast({
                                      title:
                                        row.status === 'published' ? 'Unpublished' : 'Published',
                                      description: `Item ${row.status === 'published' ? 'moved to draft' : 'is now live'}.`,
                                      variant: 'success',
                                    });
                                  })
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              >
                                {row.status === 'published' ? 'Unpublish' : 'Publish'}
                              </Button>
                            </td>
                            <td className="px-2 py-2 hidden md:table-cell">
                              <input
                                type="datetime-local"
                                className="w-40 md:w-52 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                                value={row.scheduledAt || ''}
                                onChange={(e) => setSchedule('ads', setAds, row.id, e.target.value)}
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2">
                                {/* Icon buttons on small screens */}
                                <Button
                                  size="sm"
                                  as={Link}
                                  to={row.link || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Open link"
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaLink />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => openEdit('ads', row)}
                                  aria-label="Edit"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    askConfirm(() => removeItem('ads', setAds, row.id))
                                  }
                                  aria-label="Delete"
                                  className="inline-flex items-center justify-center md:hidden"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                >
                                  <FaTrash />
                                </Button>
                                {/* Text buttons on md+ */}
                                <div className="hidden md:flex md:gap-2">
                                  <Button
                                    size="sm"
                                    as={Link}
                                    to={row.link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Open Link
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openEdit('ads', row)}
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      askConfirm(() => removeItem(ads, setAds, row.id))
                                    }
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button
                      variant="subtle"
                      onClick={() => setAdPage((p) => Math.max(1, p - 1))}
                      disabled={adPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-[var(--color-muted)]">
                      Page {adPage} of {adTotalPages}
                    </div>
                    <Button
                      variant="subtle"
                      onClick={() => setAdPage((p) => Math.min(adTotalPages, p + 1))}
                      disabled={adPage >= adTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="order-20">
              <div className="mb-4 flex items-center justify-between gap-3">
                <H2 className="text-2xl">Analytics</H2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--color-muted)]">Range</span>
                  <select
                    aria-label="Time range"
                    className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                    value={rangeDays}
                    onChange={(e) => setRangeDays(Number(e.target.value))}
                  >
                    <option value={7}>Last 7</option>
                    <option value={30}>Last 30</option>
                    <option value={90}>Last 90</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Status by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={statusData}
                          onMouseMove={(state) => {
                            const item = state?.activePayload && state.activePayload[0]?.payload;
                            if (item) {
                              const total = (item.published || 0) + (item.draft || 0);
                              if (item.name === 'Articles') setHoverArticles(total);
                              if (item.name === 'Insights') setHoverInsights(total);
                              if (item.name === 'Podcasts') setHoverPodcasts(total);
                              if (item.name === 'Trainings/Courses') setHoverPrograms(total);
                            }
                          }}
                          onMouseLeave={() => {
                            setHoverArticles(null);
                            setHoverInsights(null);
                            setHoverPodcasts(null);
                            setHoverPrograms(null);
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="published" fill={CHART.published} name="Published" />
                          <Bar dataKey="draft" fill={CHART.draft} name="Draft" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip />
                          <Legend />
                          <Pie
                            data={categoryData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label
                          >
                            {categoryData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={pieColors[index % pieColors.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Content Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={trendData}
                          onMouseMove={(state) => {
                            const p = state?.activePayload || [];
                            const a = p.find((x) => x.dataKey === 'Articles');
                            const i = p.find((x) => x.dataKey === 'Insights');
                            setHoverArticles(a ? a.value : null);
                            setHoverInsights(i ? i.value : null);
                            const pc = p.find((x) => x.dataKey === 'Podcasts');
                            const pr = p.find((x) => x.dataKey === 'Programs');
                            setHoverPodcasts(pc ? pc.value : null);
                            setHoverPrograms(pr ? pr.value : null);
                          }}
                          onMouseLeave={() => {
                            setHoverArticles(null);
                            setHoverInsights(null);
                            setHoverPodcasts(null);
                            setHoverPrograms(null);
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="Articles"
                            stroke={CHART.articles}
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="Insights"
                            stroke={CHART.insights}
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="Podcasts"
                            stroke={CHART.podcasts}
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="Programs"
                            stroke={CHART.programs}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Quick actions */}
            <section className="order-25">
              <H2 className="mb-4 text-2xl">Quick Actions</H2>
              <div className="mb-6 flex flex-wrap gap-3">
                <Button
                  onClick={() => openCreate('articles')}
                  variant="solid"
                  disabled={!canEdit}
                  title={!canEdit ? 'Insufficient role' : undefined}
                >
                  <FaPlus className="mr-2" />
                  New Article
                </Button>
                <Button
                  onClick={() => openCreate('insights')}
                  variant="secondary"
                  disabled={!canEdit}
                  title={!canEdit ? 'Insufficient role' : undefined}
                >
                  <FaPlus className="mr-2" />
                  New Insight
                </Button>
                <Button
                  onClick={() => openCreate('podcasts')}
                  variant="secondary"
                  disabled={!canEdit}
                  title={!canEdit ? 'Insufficient role' : undefined}
                >
                  <FaPlus className="mr-2" />
                  New Podcast
                </Button>
                <Button
                  onClick={() => openCreate('programs')}
                  variant="secondary"
                  disabled={!canEdit}
                  title={!canEdit ? 'Insufficient role' : undefined}
                >
                  <FaPlus className="mr-2" />
                  Create Training/Course
                </Button>
                <Button
                  onClick={() => openCreate('ads')}
                  variant="secondary"
                  disabled={!canEdit}
                  title={!canEdit ? 'Insufficient role' : undefined}
                >
                  <FaPlus className="mr-2" />
                  New Advertisement
                </Button>
              </div>
            </section>

            <section className="order-45">
              <Card>
                <CardHeader>
                  <CardTitle>Talents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Search</label>
                      <Input
                        value={tQuery}
                        onChange={(e) => {
                          setTQuery(e.target.value);
                          setTPage(1);
                        }}
                        placeholder="Name..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Status</label>
                      <Select
                        value={tStatus}
                        onChange={(e) => {
                          setTStatus(e.target.value);
                          setTPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Sort by</label>
                      <Select
                        value={tSort}
                        onChange={(e) => {
                          setTSort(e.target.value);
                          setTPage(1);
                        }}
                      >
                        <option value="name_asc">Name A→Z</option>
                        <option value="name_desc">Name Z→A</option>
                        <option value="status_pub">Published first</option>
                        <option value="status_draft">Pending first</option>
                      </Select>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full table-fixed text-xs sm:text-sm">
                      <thead className="text-left text-[var(--color-muted)] text-xs sm:text-sm">
                        <tr>
                          <th className="px-2 py-2 md:w-[32%]">Name</th>
                          <th className="px-2 py-2 md:w-[26%]">Role</th>
                          <th className="px-2 py-2 md:w-[22%]">Category</th>
                          <th className="px-2 py-2 md:w-[10%]">Status</th>
                          <th className="px-2 py-2 md:w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tPaged.map((row) => (
                          <tr key={row.id} className="border-t border-[var(--color-border)]">
                            <td className="px-2 py-2 pr-4 break-words whitespace-normal">
                              <div className="line-clamp-2">{row.name}</div>
                            </td>
                            <td className="px-2 py-2">{row.role}</td>
                            <td className="px-2 py-2">{row.category}</td>
                            <td className="px-2 py-2">
                              <Button
                                size="sm"
                                variant={row.status === 'published' ? 'secondary' : 'solid'}
                                onClick={() =>
                                  askConfirm(() => {
                                    if (!canEdit) return;
                                    const next = row.status === 'published' ? 'pending' : 'published';
                                    setStatus('talents', setTalents, row.id, next);
                                    showToast({
                                      title: next === 'published' ? 'Published' : 'Unpublished',
                                      description: `Talent ${next === 'published' ? 'is now live' : 'moved to pending'}.`,
                                      variant: 'success',
                                    });
                                  })
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              >
                                {row.status === 'published' ? 'Unpublish' : 'Publish'}
                              </Button>
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2">
                                <div className="hidden md:flex md:gap-2">
                                  <Button size="sm" onClick={() => openReview(row)}>
                                    Review
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      askConfirm(() => removeItem('talents', setTalents, row.id))
                                    }
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button
                      variant="subtle"
                      onClick={() => setTPage((p) => Math.max(1, p - 1))}
                      disabled={tPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-[var(--color-muted)]">
                      Page {tPage} of {tTotalPages}
                    </div>
                    <Button
                      variant="subtle"
                      onClick={() => setTPage((p) => Math.min(tTotalPages, p + 1))}
                      disabled={tPage >= tTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Podcasts CRUD table */}
            <section className="order-50">
              <Card>
                <CardHeader>
                  <CardTitle>Podcasts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Search</label>
                      <Input
                        value={pQuery}
                        onChange={(e) => {
                          setPQuery(e.target.value);
                          setPPage(1);
                        }}
                        placeholder="Title..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Status</label>
                      <Select
                        value={pStatus}
                        onChange={(e) => {
                          setPStatus(e.target.value);
                          setPPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Sort by</label>
                      <Select
                        value={pSort}
                        onChange={(e) => {
                          setPSort(e.target.value);
                          setPPage(1);
                        }}
                      >
                        <option value="title_asc">Title A→Z</option>
                        <option value="title_desc">Title Z→A</option>
                        <option value="status_pub">Published first</option>
                        <option value="status_draft">Draft first</option>
                        <option value="date_new">Newest first</option>
                        <option value="date_old">Oldest first</option>
                      </Select>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full table-fixed text-xs sm:text-sm">
                      <thead className="text-left text-[var(--color-muted)] text-xs sm:text-sm">
                        <tr>
                          <th className="px-2 py-2 md:w-[55%]">Title</th>
                          <th className="px-2 py-2 md:w-[15%]">Status</th>
                          <th className="px-2 py-2 hidden md:table-cell md:w-[20%]">Schedule</th>
                          <th className="px-2 py-2 md:w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pPaged.map((row) => (
                          <tr key={row.id} className="border-t border-[var(--color-border)]">
                            <td className="px-2 py-2 pr-4 break-words whitespace-normal">
                              <div className="line-clamp-2">{row.title}</div>
                            </td>
                            <td className="px-2 py-2">
                              <Button
                                size="sm"
                                variant={row.status === 'published' ? 'secondary' : 'solid'}
                                onClick={() =>
                                  askConfirm(() => {
                                    if (!canEdit) return;
                                    togglePublish('podcasts', setPodcasts, row.id);
                                    showToast({
                                      title:
                                        row.status === 'published' ? 'Unpublished' : 'Published',
                                      description: `Item ${row.status === 'published' ? 'moved to draft' : 'is now live'}.`,
                                      variant: 'success',
                                    });
                                  })
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              >
                                {row.status === 'published' ? 'Unpublish' : 'Publish'}
                              </Button>
                            </td>
                            <td className="px-2 py-2 hidden md:table-cell">
                              <input
                                type="datetime-local"
                                className="w-40 md:w-52 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                                value={row.scheduledAt || ''}
                                onChange={(e) =>
                                  setSchedule('podcasts', setPodcasts, row.id, e.target.value)
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2">
                                {/* Icon buttons on small screens */}
                                <Button
                                  size="sm"
                                  as={Link}
                                  to="/podcasts"
                                  aria-label="View"
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => openEdit('podcasts', row)}
                                  aria-label="Edit"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    askConfirm(() => removeItem(podcasts, setPodcasts, row.id))
                                  }
                                  aria-label="Delete"
                                  className="inline-flex items-center justify-center md:hidden"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                >
                                  <FaTrash />
                                </Button>
                                {/* Text buttons on md+ */}
                                <div className="hidden md:flex md:gap-2">
                                  <Button size="sm" as={Link} to="/podcasts">
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openEdit('podcasts', row)}
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      askConfirm(() => removeItem(podcasts, setPodcasts, row.id))
                                    }
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button
                      variant="subtle"
                      onClick={() => setPPage((p) => Math.max(1, p - 1))}
                      disabled={pPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-[var(--color-muted)]">
                      Page {pPage} of {pTotalPages}
                    </div>
                    <Button
                      variant="subtle"
                      onClick={() => setPPage((p) => Math.min(pTotalPages, p + 1))}
                      disabled={pPage >= pTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button
                      variant="subtle"
                      onClick={() => setPrPage((p) => Math.max(1, p - 1))}
                      disabled={prPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-[var(--color-muted)]">
                      Page {prPage} of {prTotalPages}
                    </div>
                    <Button
                      variant="subtle"
                      onClick={() => setPrPage((p) => Math.min(prTotalPages, p + 1))}
                      disabled={prPage >= prTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Training/Course CRUD table */}
            <section className="order-60">
              <Card>
                <CardHeader>
                  <CardTitle>Training & Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Search</label>
                      <Input
                        value={prQuery}
                        onChange={(e) => {
                          setPrQuery(e.target.value);
                          setPrPage(1);
                        }}
                        placeholder="Title..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Status</label>
                      <Select
                        value={prStatus}
                        onChange={(e) => {
                          setPrStatus(e.target.value);
                          setPrPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </Select>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full table-fixed text-xs sm:text-sm">
                      <thead className="text-left text-[var(--color-muted)] text-xs sm:text-sm">
                        <tr>
                          <th className="px-2 py-2 md:w-[40%]">Title</th>
                          <th className="px-2 py-2 md:w-[14%]">Type</th>
                          <th className="px-2 py-2 md:w-[14%]">Status</th>
                          <th className="px-2 py-2 hidden md:table-cell md:w-[22%]">Schedule</th>
                          <th className="px-2 py-2 md:w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prPaged.map((row) => (
                          <tr key={row.id} className="border-t border-[var(--color-border)]">
                            <td className="px-2 py-2 pr-4 break-words whitespace-normal">
                              <div className="line-clamp-2">{row.title}</div>
                            </td>
                            <td className="px-2 py-2">{row.type}</td>
                            <td className="px-2 py-2">
                              <Button
                                size="sm"
                                variant={row.status === 'published' ? 'secondary' : 'solid'}
                                onClick={() =>
                                  askConfirm(() => {
                                    if (!canEdit) return;
                                    togglePublish('programs', setPrograms, row.id);
                                    showToast({
                                      title:
                                        row.status === 'published' ? 'Unpublished' : 'Published',
                                      description: `Item ${row.status === 'published' ? 'moved to draft' : 'is now live'}.`,
                                      variant: 'success',
                                    });
                                  })
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              >
                                {row.status === 'published' ? 'Unpublish' : 'Publish'}
                              </Button>
                            </td>
                            <td className="px-2 py-2 hidden md:table-cell">
                              <input
                                type="datetime-local"
                                className="w-40 md:w-52 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                                value={row.scheduledAt || ''}
                                onChange={(e) =>
                                  setSchedule('programs', setPrograms, row.id, e.target.value)
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2">
                                {/* Icon buttons on small screens */}
                                <Button
                                  size="sm"
                                  as={Link}
                                  to="/training-courses"
                                  aria-label="View"
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => openEdit('programs', row)}
                                  aria-label="Edit"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    askConfirm(() => removeItem('programs', setPrograms, row.id))
                                  }
                                  aria-label="Delete"
                                  className="inline-flex items-center justify-center md:hidden"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                >
                                  <FaTrash />
                                </Button>
                                {/* Text buttons on md+ */}
                                <div className="hidden md:flex md:gap-2">
                                  <Button size="sm" as={Link} to="/training-courses">
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openEdit('programs', row)}
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      askConfirm(() => removeItem('programs', setPrograms, row.id))
                                    }
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Articles CRUD table */}
            <section className="order-30">
              <Card>
                <CardHeader>
                  <CardTitle>Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Search</label>
                      <Input
                        value={aQuery}
                        onChange={(e) => {
                          setAQuery(e.target.value);
                          setAPage(1);
                        }}
                        placeholder="Title..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Status</label>
                      <Select
                        value={aStatus}
                        onChange={(e) => {
                          setAStatus(e.target.value);
                          setAPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Sort by</label>
                      <Select
                        value={aSort}
                        onChange={(e) => {
                          setASort(e.target.value);
                          setAPage(1);
                        }}
                      >
                        <option value="title_asc">Title A→Z</option>
                        <option value="title_desc">Title Z→A</option>
                        <option value="status_pub">Published first</option>
                        <option value="status_draft">Draft first</option>
                        <option value="date_new">Newest first</option>
                        <option value="date_old">Oldest first</option>
                      </Select>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full table-fixed text-xs sm:text-sm">
                      <thead className="text-left text-[var(--color-muted)] text-xs sm:text-sm">
                        <tr>
                          <th className="px-2 py-2 md:w-[45%]">Title</th>
                          <th className="px-2 py-2 md:w-[15%]">Category</th>
                          <th className="px-2 py-2 md:w-[12%]">Status</th>
                          <th className="px-2 py-2 hidden md:table-cell md:w-[18%]">Schedule</th>
                          <th className="px-2 py-2 md:w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aPaged.map((row) => (
                          <tr key={row.id} className="border-t border-[var(--color-border)]">
                            <td className="px-2 py-2 pr-4 break-words whitespace-normal">
                              <div className="line-clamp-2">{row.title}</div>
                            </td>
                            <td className="px-2 py-2">{row.category}</td>
                            <td className="px-2 py-2">
                              <Button
                                size="sm"
                                variant={row.status === 'published' ? 'secondary' : 'solid'}
                                onClick={() =>
                                  askConfirm(() => {
                                    if (!canEdit) return;
                                    togglePublish('articles', setArticles, row.id);
                                    showToast({
                                      title:
                                        row.status === 'published' ? 'Unpublished' : 'Published',
                                      description: `Item ${row.status === 'published' ? 'moved to draft' : 'is now live'}.`,
                                      variant: 'success',
                                    });
                                  })
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              >
                                {row.status === 'published' ? 'Unpublish' : 'Publish'}
                              </Button>
                            </td>
                            <td className="px-2 py-2 hidden md:table-cell">
                              <input
                                type="datetime-local"
                                className="w-40 md:w-52 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                                value={row.scheduledAt || ''}
                                onChange={(e) =>
                                  setSchedule('articles', setArticles, row.id, e.target.value)
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2">
                                {/* Icon buttons on small screens */}
                                <Button
                                  size="sm"
                                  as={Link}
                                  to={`/insight/${row.id}`}
                                  aria-label="View"
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => openEdit('articles', row)}
                                  aria-label="Edit"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => openSchedule('articles', row)}
                                  aria-label="Schedule"
                                  className="inline-flex items-center justify-center md:hidden"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                >
                                  <FaClock />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    askConfirm(() => removeItem('articles', setArticles, row.id))
                                  }
                                  aria-label="Delete"
                                  className="inline-flex items-center justify-center md:hidden"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                >
                                  <FaTrash />
                                </Button>
                                {/* Text buttons on md+ */}
                                <div className="hidden md:flex md:gap-2">
                                  <Button size="sm" as={Link} to={`/insight/${row.id}`}>
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openEdit('articles', row)}
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      askConfirm(() => removeItem('articles', setArticles, row.id))
                                    }
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button
                      variant="subtle"
                      onClick={() => setAPage((p) => Math.max(1, p - 1))}
                      disabled={aPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-[var(--color-muted)]">
                      Page {aPage} of {aTotalPages}
                    </div>
                    <Button
                      variant="subtle"
                      onClick={() => setAPage((p) => Math.min(aTotalPages, p + 1))}
                      disabled={aPage >= aTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Insights CRUD table */}
            <section className="order-40">
              <Card>
                <CardHeader>
                  <CardTitle>Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-wrap items-end gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Search</label>
                      <Input
                        value={iQuery}
                        onChange={(e) => {
                          setIQuery(e.target.value);
                          setIPage(1);
                        }}
                        placeholder="Title..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Status</label>
                      <Select
                        value={iStatus}
                        onChange={(e) => {
                          setIStatus(e.target.value);
                          setIPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Sort by</label>
                      <Select
                        value={iSort}
                        onChange={(e) => {
                          setISort(e.target.value);
                          setIPage(1);
                        }}
                      >
                        <option value="title_asc">Title A→Z</option>
                        <option value="title_desc">Title Z→A</option>
                        <option value="status_pub">Published first</option>
                        <option value="status_draft">Draft first</option>
                        <option value="date_new">Newest first</option>
                        <option value="date_old">Oldest first</option>
                      </Select>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-w-full">
                    <table className="min-w-full table-fixed text-xs sm:text-sm">
                      <thead className="text-left text-[var(--color-muted)] text-xs sm:text-sm">
                        <tr>
                          <th className="px-2 py-2 md:w-[45%]">Title</th>
                          <th className="px-2 py-2 md:w-[15%]">Category</th>
                          <th className="px-2 py-2 md:w-[12%]">Status</th>
                          <th className="px-2 py-2 hidden md:table-cell md:w-[18%]">Schedule</th>
                          <th className="px-2 py-2 md:w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {iPaged.map((row) => (
                          <tr key={row.id} className="border-t border-[var(--color-border)]">
                            <td className="px-2 py-2 pr-4 break-words whitespace-normal">
                              <div className="line-clamp-2">{row.title}</div>
                            </td>
                            <td className="px-2 py-2">{row.category}</td>
                            <td className="px-2 py-2">
                              <Button
                                size="sm"
                                variant={row.status === 'published' ? 'secondary' : 'solid'}
                                onClick={() =>
                                  askConfirm(() => {
                                    if (!canEdit) return;
                                    togglePublish('insights', setInsights, row.id);
                                    showToast({
                                      title:
                                        row.status === 'published' ? 'Unpublished' : 'Published',
                                      description: `Item ${row.status === 'published' ? 'moved to draft' : 'is now live'}.`,
                                      variant: 'success',
                                    });
                                  })
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              >
                                {row.status === 'published' ? 'Unpublish' : 'Publish'}
                              </Button>
                            </td>
                            <td className="px-2 py-2 hidden md:table-cell">
                              <input
                                type="datetime-local"
                                className="w-40 md:w-52 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1"
                                value={row.scheduledAt || ''}
                                onChange={(e) =>
                                  setSchedule('insights', setInsights, row.id, e.target.value)
                                }
                                disabled={!canEdit}
                                title={!canEdit ? 'Insufficient role' : undefined}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2">
                                {/* Icon buttons on small screens */}
                                <Button
                                  size="sm"
                                  as={Link}
                                  to={`/insight/${row.id}`}
                                  aria-label="View"
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => openEdit('insights', row)}
                                  aria-label="Edit"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                  className="inline-flex items-center justify-center md:hidden"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => openSchedule('insights', row)}
                                  aria-label="Schedule"
                                  className="inline-flex items-center justify-center md:hidden"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                >
                                  <FaClock />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    askConfirm(() => removeItem('insights', setInsights, row.id))
                                  }
                                  aria-label="Delete"
                                  className="inline-flex items-center justify-center md:hidden"
                                  disabled={!canEdit}
                                  title={!canEdit ? 'Insufficient role' : undefined}
                                >
                                  <FaTrash />
                                </Button>
                                {/* Text buttons on md+ */}
                                <div className="hidden md:flex md:gap-2">
                                  <Button size="sm" as={Link} to={`/insight/${row.id}`}>
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openEdit('insights', row)}
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      askConfirm(() => removeItem('insights', setInsights, row.id))
                                    }
                                    disabled={!canEdit}
                                    title={!canEdit ? 'Insufficient role' : undefined}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button
                      variant="subtle"
                      onClick={() => setIPage((p) => Math.max(1, p - 1))}
                      disabled={iPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-[var(--color-muted)]">
                      Page {iPage} of {iTotalPages}
                    </div>
                    <Button
                      variant="subtle"
                      onClick={() => setIPage((p) => Math.min(iTotalPages, p + 1))}
                      disabled={iPage >= iTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>

      {/* Schedule modal */}
      {schedOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSchedOpen(false)} />
          <div className="relative w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="mb-2 text-lg font-semibold">Schedule Publication</h3>
            <div className="mb-4 text-sm text-[var(--color-muted)]">
              Choose a date and time to publish.
            </div>
            <input
              type="datetime-local"
              className="mb-4 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2"
              value={schedValue}
              onChange={(e) => setSchedValue(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSchedOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveSchedule}
                disabled={!canEdit}
                title={!canEdit ? 'Insufficient role' : undefined}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review talent modal */}
      <Modal
        open={reviewOpen}
        onClose={() => {
          setReviewOpen(false);
          setReviewItem(null);
        }}
        title={reviewItem ? `Review: ${reviewItem.name}` : 'Review'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setReviewOpen(false);
                setReviewItem(null);
              }}
            >
              Close
            </Button>
            <Button onClick={publishReviewed} disabled={!canEdit} title={!canEdit ? 'Insufficient role' : undefined}>
              Publish
            </Button>
          </>
        }
      >
        {reviewItem && (
          <div className="space-y-2">
            <div>
              <div className="text-xs text-[var(--color-muted)]">Name</div>
              <div>{reviewItem.name}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-muted)]">Role</div>
              <div>{reviewItem.role || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-muted)]">Category</div>
              <div>{reviewItem.category || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-muted)]">Bio</div>
              <div className="whitespace-pre-wrap break-words">{reviewItem.bio || '-'}</div>
            </div>
            {reviewItem.links && (
              <div>
                <div className="text-xs text-[var(--color-muted)]">Links</div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {Object.entries(reviewItem.links).map(([k, url]) => (
                    <a key={k} href={url} target="_blank" rel="noreferrer" className="text-brand-500 underline-offset-2 hover:underline">
                      {k}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs text-[var(--color-muted)]">Current status</div>
              <div className="inline-block rounded-full border px-2 py-0.5 text-xs">{reviewItem.status}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditOpen(false)} />
          <div className="relative w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="mb-2 text-lg font-semibold">
              {isEdit ? 'Edit' : 'Create'}{' '}
              {editList === 'articles'
                ? 'Article'
                : editList === 'insights'
                  ? 'Insight'
                  : editList === 'podcasts'
                    ? 'Podcast'
                    : editList === 'programs'
                      ? 'Program'
                      : editList === 'ads'
                        ? 'Advertisement'
                        : 'Item'}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <Select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  disabled={!canEdit}
                >
                  {/* Ensure current value remains selectable if not in list */}
                  {form.category && !CATEGORIES.includes(form.category) && (
                    <option value={form.category}>{form.category}</option>
                  )}
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              {editList === 'programs' && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Type</label>
                  <Select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    disabled={!canEdit}
                  >
                    <option value="Training">Training</option>
                    <option value="Course">Course</option>
                  </Select>
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium">Date</label>
                <Input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  disabled={!canEdit}
                  placeholder="e.g. Feb 17, 2025"
                />
              </div>
              {editList === 'programs' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Duration</label>
                    <Input
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Location</label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Modality</label>
                    <Input
                      value={form.modality}
                      onChange={(e) => setForm({ ...form, modality: e.target.value })}
                      disabled={!canEdit}
                    />
                  </div>
                </>
              )}
              {editList === 'podcasts' && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Duration</label>
                  <Input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    disabled={!canEdit}
                  />
                </div>
              )}
              {editList === 'podcasts' && (
                <>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Audio URL</label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={form.audioUrl}
                        onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                        placeholder="https://...mp3 or streaming URL"
                        disabled={!canEdit}
                      />
                      {form.audioUrl && !(isHttpUrl(form.audioUrl) || isDataUrl(form.audioUrl)) ? (
                        <div className="text-xs text-red-500 self-center">Invalid URL format</div>
                      ) : null}
                      <label className="inline-flex items-center gap-2 self-start rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] cursor-pointer">
                        <FaUpload /> Upload Audio
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () =>
                              setForm({ ...form, audioUrl: String(reader.result) });
                            reader.readAsDataURL(file);
                          }}
                          disabled={!canEdit}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Video URL</label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={form.videoUrl}
                        onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                        placeholder="https://...mp4 or streaming URL"
                        disabled={!canEdit}
                      />
                      {form.videoUrl && !(isHttpUrl(form.videoUrl) || isDataUrl(form.videoUrl)) ? (
                        <div className="text-xs text-red-500 self-center">Invalid URL format</div>
                      ) : null}
                      <label className="inline-flex items-center gap-2 self-start rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] cursor-pointer">
                        <FaUpload /> Upload Video
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () =>
                              setForm({ ...form, videoUrl: String(reader.result) });
                            reader.readAsDataURL(file);
                          }}
                          disabled={!canEdit}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Embed (YouTube)</label>
                      <Input
                        value={form.embedYouTube}
                        onChange={(e) => setForm({ ...form, embedYouTube: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        disabled={!canEdit}
                      />
                      {form.embedYouTube && !youTubeEmbed(form.embedYouTube) ? (
                        <div className="mt-1 text-xs text-amber-600">Unrecognized YouTube link</div>
                      ) : null}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Embed (Facebook)</label>
                      <Input
                        value={form.embedFacebook}
                        onChange={(e) => setForm({ ...form, embedFacebook: e.target.value })}
                        placeholder="https://www.facebook.com/..."
                        disabled={!canEdit}
                      />
                      {form.embedFacebook && !isFacebookUrl(form.embedFacebook) ? (
                        <div className="mt-1 text-xs text-amber-600">
                          This doesn't look like a Facebook link
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Embed (Other)</label>
                      <Input
                        value={form.embedOther}
                        onChange={(e) => setForm({ ...form, embedOther: e.target.value })}
                        placeholder="Any oEmbed/iframe link"
                        disabled={!canEdit}
                      />
                      {form.embedOther && !isHttpUrl(form.embedOther) ? (
                        <div className="mt-1 text-xs text-amber-600">Enter a valid http(s) URL</div>
                      ) : null}
                    </div>
                  </div>
                  {/* Media previews */}
                  <div className="sm:col-span-2 grid grid-cols-1 gap-3">
                    {safeUrl(form.audioUrl) ? (
                      <div>
                        <label className="mb-1 block text-sm font-medium">Audio Preview</label>
                        <audio controls src={safeUrl(form.audioUrl)} className="w-full" />
                      </div>
                    ) : null}
                    {safeUrl(form.videoUrl) ? (
                      <div>
                        <label className="mb-1 block text-sm font-medium">Video Preview</label>
                        <video controls src={safeUrl(form.videoUrl)} className="w-full max-h-60" />
                      </div>
                    ) : null}
                    {youTubeEmbed(form.embedYouTube) ? (
                      <div>
                        <label className="mb-1 block text-sm font-medium">YouTube Preview</label>
                        <div className="aspect-video w-full">
                          <iframe
                            title="YouTube embed"
                            src={youTubeEmbed(form.embedYouTube)}
                            className="h-full w-full rounded border border-[var(--color-border)]"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : null}
                    {safeUrl(form.embedFacebook) ? (
                      <div>
                        <label className="mb-1 block text-sm font-medium">Facebook Preview</label>
                        <div className="aspect-video w-full">
                          <iframe
                            title="Facebook embed"
                            src={safeUrl(form.embedFacebook)}
                            className="h-full w-full rounded border border-[var(--color-border)]"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : null}
                    {safeUrl(form.embedOther) ? (
                      <div>
                        <label className="mb-1 block text-sm font-medium">Embed Preview</label>
                        <div className="aspect-video w-full">
                          <iframe
                            title="External embed"
                            src={safeUrl(form.embedOther)}
                            className="h-full w-full rounded border border-[var(--color-border)]"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
              {(editList === 'articles' || editList === 'insights') && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Read Time (mins)</label>
                  <Input
                    type="number"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })}
                    disabled={!canEdit}
                  />
                </div>
              )}
              {(editList === 'articles' || editList === 'insights') && (
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Excerpt</label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    disabled={!canEdit}
                  />
                </div>
              )}
              {(editList === 'articles' || editList === 'insights') && (
                <div className="sm:col-span-2">
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm font-medium">Content</label>
                    <div className="flex gap-1 text-xs">
                      <button
                        type="button"
                        className={`rounded px-2 py-1 ${contentTab === 'edit' ? 'bg-[color-mix(in_oklab,var(--color-surface),white_8%)]' : ''}`}
                        onClick={() => setContentTab('edit')}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`rounded px-2 py-1 ${contentTab === 'preview' ? 'bg-[color-mix(in_oklab,var(--color-surface),white_8%)]' : ''}`}
                        onClick={() => setContentTab('preview')}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  {contentTab === 'edit' ? (
                    <TipTapEditor
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      disabled={!canEdit}
                      placeholder="Write content here..."
                    />
                  ) : (
                    <ContentRenderer html={form.content} className="min-h-[160px]" />
                  )}
                </div>
              )}
              {(editList === 'articles' || editList === 'insights' || editList === 'podcasts') && (
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
                  <Input
                    value={
                      Array.isArray(form.tags) ? form.tags.join(', ') : String(form.tags || '')
                    }
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g. InsightTechThursdays, AI, Policy"
                    disabled={!canEdit}
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Cover Image</label>
                {form.image ? (
                  <img
                    src={form.image}
                    alt="preview"
                    className="mb-2 max-h-40 w-auto rounded border border-[var(--color-border)] object-cover"
                  />
                ) : null}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://... or data:image/..."
                    disabled={!canEdit}
                  />
                  <label className="inline-flex items-center gap-2 self-start rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] cursor-pointer">
                    <FaUpload /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setForm({ ...form, image: String(reader.result) });
                        reader.readAsDataURL(file);
                      }}
                      disabled={!canEdit}
                    />
                  </label>
                </div>
              </div>

              {editList === 'ads' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Target Link</label>
                    <Input
                      value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      placeholder="https://..."
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Position</label>
                    <Select
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      disabled={!canEdit}
                    >
                      <option value="inline">Inline</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="hero">Hero</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Rotate Seconds (global)
                    </label>
                    <Input
                      type="number"
                      value={form.rotateSeconds}
                      onChange={(e) => setForm({ ...form, rotateSeconds: e.target.value })}
                      placeholder="9"
                      disabled={!canEdit}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  disabled={!canEdit}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Schedule</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2"
                  value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  disabled={!canEdit}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveForm}
                disabled={!canEdit}
                title={!canEdit ? 'Insufficient role' : undefined}
              >
                {isEdit ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmOpen(false)} />
          <div className="relative w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="mb-2 text-lg font-semibold">Delete item?</h3>
            <div className="mb-4 text-sm text-[var(--color-muted)]">
              This action cannot be undone.
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="solid"
                onClick={() => {
                  setConfirmOpen(false);
                  confirmAction();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
