import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Select, Modal, Confirm } from "@/components/admin/ui";
import { Plus, Pencil, Trash2, Briefcase, Users, CheckCircle, XCircle, Loader2, Filter, Search, Eye, UserCheck, UserX, Award, Download, FileText, Calendar, MapPin, Phone, Mail, Building, Clock, ChevronRight, ChevronLeft, Save, MessageSquare, Linkedin, FileDown, FileEdit } from "lucide-react";
import { toast } from "sonner";
import CareerContentTab from "@/components/admin/CareerContentTab";

interface CareerJob {
  _id?: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Internship';
  experienceRequired?: string;
  salaryRange?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  numberOfOpenings?: number;
  applicationDeadline?: string;
  status: 'Open' | 'Closed';
  createdAt?: string;
  updatedAt?: string;
}

interface JobApplication {
  _id?: string;
  jobId: string;
  jobTitle?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  linkedinUrl?: string;
  currentLocation?: string;
  totalExperience?: string;
  currentCompany?: string;
  currentDesignation?: string;
  expectedSalary?: string;
  resumeUrl?: string;
  resumePublicId?: string;
  coverLetter?: string;
  applicationStatus: 'Pending' | 'Shortlisted' | 'Interview Scheduled' | 'Interview Completed' | 'Selected' | 'Hired' | 'Rejected';
  recruiterNotes?: string;
  lastEmailSent?: string;
  lastEmailSentAt?: string;
  activityTimeline?: Array<{
    action: string;
    date: string;
    notes?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

type JobStatusFilter = 'all' | 'Open' | 'Closed';
type ApplicationStatusFilter = 'all' | 'Pending' | 'Shortlisted' | 'Interview Scheduled' | 'Interview Completed' | 'Selected' | 'Hired' | 'Rejected';
type TabType = 'jobs' | 'applications' | 'career_content';

interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  interviewScheduled: number;
  interviewCompleted: number;
  selectedCandidates: number;
  hiredCandidates: number;
  rejectedCandidates: number;
  applicationsToday: number;
  applicationsThisWeek: number;
  applicationsThisMonth: number;
}

export default function AdminCareersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobFilter, setJobFilter] = useState<JobStatusFilter>('all');
  const [applicationFilter, setApplicationFilter] = useState<ApplicationStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Job form state
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CareerJob | null>(null);
  const [jobForm, setJobForm] = useState<{
    title: string;
    department: string;
    location: string;
    employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Internship';
    experienceRequired: string;
    salaryRange: string;
    description: string;
    responsibilities: string;
    requirements: string;
    skills: string;
    numberOfOpenings: number;
    applicationDeadline: string;
    status: 'Open' | 'Closed';
  }>({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full Time',
    experienceRequired: '',
    salaryRange: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    numberOfOpenings: 1,
    applicationDeadline: '',
    status: 'Open',
  });
  
  // Application detail modal
  const [applicationDetailOpen, setApplicationDetailOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs...');
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (jobFilter && jobFilter !== 'all') params.append('status', jobFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const url = `/api/careers${params.toString() ? '?' + params.toString() : ''}`;
      
      const res = await fetch(url);
      const data = await res.json();
      console.log('Jobs API response:', data);
      
      if (data.success) {
        setJobs(data.data);
      } else {
        setError(data.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications...');
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (applicationFilter && applicationFilter !== 'all') params.append('applicationStatus', applicationFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const url = `/api/careers/applications${params.toString() ? '?' + params.toString() : ''}`;
      
      const res = await fetch(url);
      const data = await res.json();
      console.log('Applications API response:', data);
      
      if (data.success) {
        setApplications(data.data);
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const jobsRes = await fetch('/api/careers');
      const jobsData = await jobsRes.json();
      const applicationsRes = await fetch('/api/careers/applications');
      const applicationsData = await applicationsRes.json();
      
      if (jobsData.success && applicationsData.success) {
        const allJobs = jobsData.data || [];
        const allApplications = applicationsData.data || [];
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        setStats({
          totalJobs: allJobs.length,
          openJobs: allJobs.filter((j: CareerJob) => j.status === 'Open').length,
          closedJobs: allJobs.filter((j: CareerJob) => j.status === 'Closed').length,
          totalApplications: allApplications.length,
          pendingApplications: allApplications.filter((a: JobApplication) => a.applicationStatus === 'Pending').length,
          shortlistedApplications: allApplications.filter((a: JobApplication) => a.applicationStatus === 'Shortlisted').length,
          interviewScheduled: allApplications.filter((a: JobApplication) => a.applicationStatus === 'Interview Scheduled').length,
          interviewCompleted: allApplications.filter((a: JobApplication) => a.applicationStatus === 'Interview Completed').length,
          selectedCandidates: allApplications.filter((a: JobApplication) => a.applicationStatus === 'Selected').length,
          hiredCandidates: allApplications.filter((a: JobApplication) => a.applicationStatus === 'Hired').length,
          rejectedCandidates: allApplications.filter((a: JobApplication) => a.applicationStatus === 'Rejected').length,
          applicationsToday: allApplications.filter((a: JobApplication) => new Date(a.createdAt || '') >= today).length,
          applicationsThisWeek: allApplications.filter((a: JobApplication) => new Date(a.createdAt || '') >= weekAgo).length,
          applicationsThisMonth: allApplications.filter((a: JobApplication) => new Date(a.createdAt || '') >= monthAgo).length,
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    } else {
      fetchApplications();
    }
  }, [activeTab, jobFilter, applicationFilter, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSaveJob = async () => {
    try {
      setUpdating('job');
      setError(null);
      
      // Validation
      if (!jobForm.title || !jobForm.department || !jobForm.location || !jobForm.employmentType) {
        setError('Please fill in all required fields');
        toast.error('Please fill in all required fields');
        return;
      }

      const payload = {
        ...jobForm,
        responsibilities: jobForm.responsibilities.split('\n').filter(Boolean),
        requirements: jobForm.requirements.split('\n').filter(Boolean),
        skills: jobForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      };

      const url = editingJob?._id ? `/api/careers/${editingJob._id}` : '/api/careers';
      const method = editingJob?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Save job response:', data);

      if (data.success) {
        toast.success(editingJob?._id ? 'Job updated successfully' : 'Job created successfully');
        setJobModalOpen(false);
        setEditingJob(null);
        setJobForm({
          title: '',
          department: '',
          location: '',
          employmentType: 'Full Time',
          experienceRequired: '',
          salaryRange: '',
          description: '',
          responsibilities: '',
          requirements: '',
          skills: '',
          numberOfOpenings: 1,
          applicationDeadline: '',
          status: 'Open',
        });
        await fetchJobs();
        await fetchStats();
      } else {
        setError(data.message || 'Failed to save job');
        toast.error(data.message || 'Failed to save job');
      }
    } catch (err) {
      console.error('Error saving job:', err);
      setError('Failed to save job');
      toast.error('Failed to save job');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      console.log('Deleting job:', id);
      
      const res = await fetch(`/api/careers/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log('Delete job response:', data);

      if (data.success) {
        toast.success('Job deleted successfully');
        await fetchJobs();
        await fetchStats();
        setDel(null);
      } else {
        setError(data.message || 'Failed to delete job');
        toast.error(data.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job');
      toast.error('Failed to delete job');
    }
  };

  const handleToggleJobStatus = async (id: string, currentStatus: string) => {
    try {
      setUpdating(id);
      const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
      
      const res = await fetch(`/api/careers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Job ${newStatus} successfully`);
        await fetchJobs();
        await fetchStats();
      } else {
        toast.error(data.message || 'Failed to update job status');
      }
    } catch (err) {
      toast.error('Failed to update job status');
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateApplicationStatus = async (id: string, newStatus: 'Pending' | 'Shortlisted' | 'Interview Scheduled' | 'Interview Completed' | 'Selected' | 'Hired' | 'Rejected') => {
    try {
      setUpdating(id);
      
      const res = await fetch(`/api/careers/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationStatus: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Application ${newStatus} successfully`);
        await fetchApplications();
        await fetchStats();
      } else {
        toast.error(data.message || 'Failed to update application status');
      }
    } catch (err) {
      toast.error('Failed to update application status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      console.log('Deleting application:', id);
      
      const res = await fetch(`/api/careers/applications/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log('Delete application response:', data);

      if (data.success) {
        toast.success('Application deleted successfully');
        await fetchApplications();
        await fetchStats();
        setDel(null);
      } else {
        setError(data.message || 'Failed to delete application');
        toast.error(data.message || 'Failed to delete application');
      }
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Failed to delete application');
      toast.error('Failed to delete application');
    }
  };

  const handleSaveRecruiterNotes = async () => {
    if (!selectedApplication) return;

    try {
      setSavingNotes(true);
      
      const res = await fetch(`/api/careers/applications/${selectedApplication._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recruiterNotes }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Recruiter notes saved successfully');
        await fetchApplications();
      } else {
        toast.error(data.message || 'Failed to save notes');
      }
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const getResumeExtension = (url?: string) => {
    if (!url) return '';
    const parts = url.split('.');
    return parts[parts.length - 1].toLowerCase();
  };

  const openResume = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const downloadResume = (url?: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_${selectedApplication?.fullName.replace(/\s+/g, '_')}.${getResumeExtension(url)}`;
    link.click();
  };

  const getTimelineStage = (status: string) => {
    const stages = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Hired'];
    const currentIndex = stages.indexOf(status);
    return currentIndex >= 0 ? currentIndex : -1;
  };

  const exportToCSV = () => {
    if (applications.length === 0) {
      toast.error('No applications to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Position', 'Status', 'Experience', 'Company', 'Applied Date'];
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        `"${app.fullName}"`,
        `"${app.email}"`,
        `"${app.phoneNumber}"`,
        `"${app.jobTitle || 'N/A'}"`,
        `"${app.applicationStatus}"`,
        `"${app.totalExperience || 'N/A'}"`,
        `"${app.currentCompany || 'N/A'}"`,
        `"${formatDate(app.createdAt)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Applications exported successfully');
  };

  const openEditJob = (job: CareerJob) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      experienceRequired: job.experienceRequired || '',
      salaryRange: job.salaryRange || '',
      description: job.description || '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
      numberOfOpenings: job.numberOfOpenings || 1,
      applicationDeadline: job.applicationDeadline || '',
      status: job.status,
    });
    setJobModalOpen(true);
  };

  const getJobStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Open: 'bg-green-100 text-green-800',
      Closed: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Open}`}>
        {status}
      </span>
    );
  };

  const getApplicationStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Shortlisted: 'bg-blue-100 text-blue-800',
      'Interview Scheduled': 'bg-purple-100 text-purple-800',
      'Interview Completed': 'bg-indigo-100 text-indigo-800',
      Selected: 'bg-emerald-100 text-emerald-800',
      Hired: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Pending}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const jobCounters = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'Open').length,
    closed: jobs.filter(j => j.status === 'Closed').length,
  };

  const applicationCounters = {
    total: applications.length,
    pending: applications.filter(a => a.applicationStatus === 'Pending').length,
    shortlisted: applications.filter(a => a.applicationStatus === 'Shortlisted').length,
    interviewScheduled: applications.filter(a => a.applicationStatus === 'Interview Scheduled').length,
    interviewCompleted: applications.filter(a => a.applicationStatus === 'Interview Completed').length,
    selected: applications.filter(a => a.applicationStatus === 'Selected').length,
    hired: applications.filter(a => a.applicationStatus === 'Hired').length,
    rejected: applications.filter(a => a.applicationStatus === 'Rejected').length,
  };

  return (
    <AdminShell title="Career Management">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Dashboard Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-slate-600" />
              <div className="text-2xl font-bold text-slate-900">{stats.totalJobs}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Total Jobs</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{stats.openJobs}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Open Jobs</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{stats.closedJobs}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Closed Jobs</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Total Applications</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Pending</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{stats.shortlistedApplications}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Shortlisted</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{stats.interviewScheduled}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Interview Scheduled</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div className="text-2xl font-bold text-emerald-600">{stats.selectedCandidates}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Selected</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{stats.hiredCandidates}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Hired</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{stats.rejectedCandidates}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Rejected</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{stats.applicationsToday}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">Today</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <div className="text-2xl font-bold text-indigo-600">{stats.applicationsThisWeek}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">This Week</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              <div className="text-2xl font-bold text-teal-600">{stats.applicationsThisMonth}</div>
            </div>
            <div className="text-xs text-slate-500 tracking-wider mt-1">This Month</div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <Button
          variant={activeTab === 'jobs' ? 'primary' : 'ghost'}
          onClick={() => { setActiveTab('jobs'); setSearchQuery(''); }}
          className="rounded-b-none"
        >
          <Briefcase className="h-4 w-4" /> Jobs
        </Button>
        <Button
          variant={activeTab === 'applications' ? 'primary' : 'ghost'}
          onClick={() => { setActiveTab('applications'); setSearchQuery(''); }}
          className="rounded-b-none"
        >
          <Users className="h-4 w-4" /> Applications
        </Button>
        <Button
          variant={activeTab === 'career_content' ? 'primary' : 'ghost'}
          onClick={() => { setActiveTab('career_content'); setSearchQuery(''); }}
          className="rounded-b-none"
        >
          <FileEdit className="h-4 w-4" /> Career Content
        </Button>
      </div>

      {/* Search */}
      {activeTab !== 'career_content' && (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={activeTab === 'jobs' ? "Search jobs by title, department..." : "Search applications by name, email, phone, company, designation..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === 'jobs' && (
            <Button onClick={() => { setEditingJob(null); setJobForm({ title: '', department: '', location: '', employmentType: 'Full Time', experienceRequired: '', salaryRange: '', description: '', responsibilities: '', requirements: '', skills: '', numberOfOpenings: 1, applicationDeadline: '', status: 'Open' }); setJobModalOpen(true); }}>
              <Plus className="h-4 w-4" /> Add New Job
            </Button>
          )}
          {activeTab === 'applications' && (
            <Button variant="secondary" onClick={exportToCSV}>
              <FileDown className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          )}
        </div>
      )}

      {/* Filters */}
      {activeTab !== 'career_content' && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-slate-500" />
        {activeTab === 'jobs' ? (
          <>
            <Button
              variant={jobFilter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setJobFilter('all')}
              className="text-xs"
            >
              All ({jobCounters.total})
            </Button>
            <Button
              variant={jobFilter === 'Open' ? 'primary' : 'secondary'}
              onClick={() => setJobFilter('Open')}
              className="text-xs"
            >
              Open ({jobCounters.open})
            </Button>
            <Button
              variant={jobFilter === 'Closed' ? 'primary' : 'secondary'}
              onClick={() => setJobFilter('Closed')}
              className="text-xs"
            >
              Closed ({jobCounters.closed})
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={applicationFilter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setApplicationFilter('all')}
              className="text-xs"
            >
              All ({applicationCounters.total})
            </Button>
            <Button
              variant={applicationFilter === 'Pending' ? 'primary' : 'secondary'}
              onClick={() => setApplicationFilter('Pending')}
              className="text-xs"
            >
              Pending ({applicationCounters.pending})
            </Button>
            <Button
              variant={applicationFilter === 'Shortlisted' ? 'primary' : 'secondary'}
              onClick={() => setApplicationFilter('Shortlisted')}
              className="text-xs"
            >
              Shortlisted ({applicationCounters.shortlisted})
            </Button>
            <Button
              variant={applicationFilter === 'Interview Scheduled' ? 'primary' : 'secondary'}
              onClick={() => setApplicationFilter('Interview Scheduled')}
              className="text-xs"
            >
              Interview Scheduled ({applicationCounters.interviewScheduled})
            </Button>
            <Button
              variant={applicationFilter === 'Interview Completed' ? 'primary' : 'secondary'}
              onClick={() => setApplicationFilter('Interview Completed')}
              className="text-xs"
            >
              Interview Completed ({applicationCounters.interviewCompleted})
            </Button>
            <Button
              variant={applicationFilter === 'Selected' ? 'primary' : 'secondary'}
              onClick={() => setApplicationFilter('Selected')}
              className="text-xs"
            >
              Selected ({applicationCounters.selected})
            </Button>
            <Button
              variant={applicationFilter === 'Hired' ? 'primary' : 'secondary'}
              onClick={() => setApplicationFilter('Hired')}
              className="text-xs"
            >
              Hired ({applicationCounters.hired})
            </Button>
            <Button
              variant={applicationFilter === 'Rejected' ? 'primary' : 'secondary'}
              onClick={() => setApplicationFilter('Rejected')}
              className="text-xs"
            >
              Rejected ({applicationCounters.rejected})
            </Button>
          </>
        )}
      </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : activeTab === 'career_content' ? (
        <CareerContentTab />
      ) : activeTab === 'jobs' ? (
        jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">No jobs found</p>
            <p className="text-slate-400 text-sm mt-2">
              {searchQuery ? 'No jobs match your search' : 'Create your first job opening to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Location</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Created</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4 font-medium">{job.title}</td>
                    <td className="py-3 pr-4 text-sm text-slate-600">{job.department}</td>
                    <td className="py-3 pr-4 text-sm text-slate-600">{job.location}</td>
                    <td className="py-3 pr-4 text-sm text-slate-600">{job.employmentType}</td>
                    <td className="py-3 pr-4">{getJobStatusBadge(job.status)}</td>
                    <td className="py-3 pr-4 text-sm text-slate-500">{formatDate(job.createdAt)}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          onClick={() => handleToggleJobStatus(job._id!, job.status)}
                          disabled={updating === job._id}
                          className="text-xs"
                          title={job.status === 'Open' ? 'Close Job' : 'Open Job'}
                        >
                          {updating === job._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : job.status === 'Open' ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => openEditJob(job)}
                          className="text-xs"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setDel(job._id!)}
                          className="text-xs"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No applications found</p>
          <p className="text-slate-400 text-sm mt-2">
            {searchQuery ? 'No applications match your search' : 'Job applications will appear here'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                <th className="pb-3 pr-4">Candidate</th>
                <th className="pb-3 pr-4">Position</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3 pr-4">Experience</th>
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-4 font-medium">{app.fullName}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{app.jobTitle || 'N/A'}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{app.email}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{app.phoneNumber}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{app.totalExperience || 'N/A'}</td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{app.currentCompany || 'N/A'}</td>
                  <td className="py-3 pr-4">{getApplicationStatusBadge(app.applicationStatus)}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => { setSelectedApplication(app); setRecruiterNotes(app.recruiterNotes || ''); setApplicationDetailOpen(true); }}
                        className="text-xs"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {app.applicationStatus === 'Pending' && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Shortlisted')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Shortlist"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Award className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Rejected')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Reject"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                          </Button>
                        </>
                      )}
                      {app.applicationStatus === 'Shortlisted' && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Interview Scheduled')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Schedule Interview"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Rejected')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Reject"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                          </Button>
                        </>
                      )}
                      {app.applicationStatus === 'Interview Scheduled' && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Interview Completed')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Complete Interview"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Rejected')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Reject"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                          </Button>
                        </>
                      )}
                      {app.applicationStatus === 'Interview Completed' && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Selected')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Select"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Award className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Rejected')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Reject"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                          </Button>
                        </>
                      )}
                      {app.applicationStatus === 'Selected' && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Hired')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Hire"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateApplicationStatus(app._id!, 'Rejected')}
                            disabled={updating === app._id}
                            className="text-xs"
                            title="Reject"
                          >
                            {updating === app._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => setDel(app._id!)}
                        className="text-xs"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Job Form Modal */}
      <Modal open={jobModalOpen} onClose={() => setJobModalOpen(false)} title={editingJob?._id ? 'Edit Job' : 'Add New Job'}>
        <div className="space-y-4">
          <Field label="Title *">
            <Input
              value={jobForm.title}
              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              placeholder="e.g. Senior Wastewater Engineer"
            />
          </Field>
          <Field label="Department *">
            <Input
              value={jobForm.department}
              onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
              placeholder="e.g. Engineering"
            />
          </Field>
          <Field label="Location *">
            <Input
              value={jobForm.location}
              onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
              placeholder="e.g. Dubai"
            />
          </Field>
          <Field label="Employment Type *">
            <Select
              value={jobForm.employmentType}
              onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value as any })}
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </Select>
          </Field>
          <Field label="Experience Required">
            <Input
              value={jobForm.experienceRequired}
              onChange={(e) => setJobForm({ ...jobForm, experienceRequired: e.target.value })}
              placeholder="e.g. 5-7 years"
            />
          </Field>
          <Field label="Salary Range">
            <Input
              value={jobForm.salaryRange}
              onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
              placeholder="e.g. AED 15,000 - 25,000"
            />
          </Field>
          <Field label="Number of Openings">
            <Input
              type="number"
              value={jobForm.numberOfOpenings}
              onChange={(e) => setJobForm({ ...jobForm, numberOfOpenings: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </Field>
          <Field label="Application Deadline">
            <Input
              type="date"
              value={jobForm.applicationDeadline}
              onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              placeholder="Job description..."
              rows={4}
            />
          </Field>
          <Field label="Responsibilities (one per line)">
            <Textarea
              value={typeof jobForm.responsibilities === 'string' ? jobForm.responsibilities : ''}
              onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
              placeholder="Enter each responsibility on a new line"
              rows={4}
            />
          </Field>
          <Field label="Requirements (one per line)">
            <Textarea
              value={typeof jobForm.requirements === 'string' ? jobForm.requirements : ''}
              onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
              placeholder="Enter each requirement on a new line"
              rows={4}
            />
          </Field>
          <Field label="Skills (comma separated)">
            <Textarea
              value={typeof jobForm.skills === 'string' ? jobForm.skills : ''}
              onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
              placeholder="e.g. AutoCAD, Water Treatment, Project Management"
              rows={2}
            />
          </Field>
          <Field label="Status">
            <Select
              value={jobForm.status}
              onChange={(e) => setJobForm({ ...jobForm, status: e.target.value as any })}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </Select>
          </Field>
          <div className="flex gap-2 pt-4">
            <Button variant="secondary" onClick={() => setJobModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveJob} disabled={updating === 'job'} className="flex-1">
              {updating === 'job' ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingJob?._id ? 'Update' : 'Create')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Application Detail Modal */}
      <Modal open={applicationDetailOpen} onClose={() => setApplicationDetailOpen(false)} title="Application Details">
        {selectedApplication && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setApplicationDetailOpen(false);
                  router.push(`/admin/careers/applications/${selectedApplication._id}`);
                }}
                className="text-sm"
              >
                <Eye className="h-4 w-4 mr-2" /> View Full Profile
              </Button>
            </div>
            {/* Application Timeline */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Application Timeline</div>
              <div className="flex items-center justify-between">
                {['Pending', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Hired'].map((stage, index) => {
                  const currentStage = getTimelineStage(selectedApplication.applicationStatus);
                  const isCompleted = index <= currentStage;
                  const isCurrent = index === currentStage;
                  const isRejected = selectedApplication.applicationStatus === 'Rejected';
                  
                  return (
                    <div key={stage} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isRejected ? 'bg-red-100 text-red-600' :
                        isCompleted ? 'bg-green-100 text-green-600' : 
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className={`text-xs mt-1 text-center ${
                        isCurrent ? 'font-semibold text-slate-900' : 
                        isCompleted ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {stage.split(' ')[0]}
                      </div>
                      {index < 5 && (
                        <div className={`w-full h-1 mt-2 ${
                          isRejected ? 'bg-red-200' :
                          isCompleted ? 'bg-green-200' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Candidate Information */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" /> Candidate Information
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Full Name</div>
                      <div className="text-sm font-medium">{selectedApplication.fullName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Email</div>
                      <div className="text-sm font-medium">{selectedApplication.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Phone</div>
                      <div className="text-sm font-medium">{selectedApplication.phoneNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Location</div>
                      <div className="text-sm font-medium">{selectedApplication.currentLocation || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" /> Professional Information
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Current Company</div>
                      <div className="text-sm font-medium">{selectedApplication.currentCompany || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Current Designation</div>
                      <div className="text-sm font-medium">{selectedApplication.currentDesignation || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Total Experience</div>
                      <div className="text-sm font-medium">{selectedApplication.totalExperience || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Expected Salary</div>
                      <div className="text-sm font-medium">{selectedApplication.expectedSalary || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                {selectedApplication.linkedinUrl && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">LinkedIn Profile</div>
                      <div className="text-sm font-medium">
                        <a href={selectedApplication.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Profile
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Information */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Application Information
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Applied Position</div>
                      <div className="text-sm font-medium">{selectedApplication.jobTitle || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Application Date</div>
                      <div className="text-sm font-medium">{formatDate(selectedApplication.createdAt)}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-500">Current Status</div>
                  {getApplicationStatusBadge(selectedApplication.applicationStatus)}
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Resume
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                {selectedApplication.resumeUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-700">Resume uploaded successfully</div>
                      <div className="text-xs text-slate-500">{getResumeExtension(selectedApplication.resumeUrl).toUpperCase()} Format</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => openResume(selectedApplication.resumeUrl)}
                        className="text-xs"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View Resume
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => downloadResume(selectedApplication.resumeUrl)}
                        className="text-xs"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download Resume
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">Resume not available</div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Cover Letter
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-sm whitespace-pre-wrap text-slate-700">{selectedApplication.coverLetter}</div>
                </div>
              </div>
            )}

            {/* Recruiter Notes */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Recruiter Notes
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <Textarea
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  placeholder="Add your notes about this candidate..."
                  rows={4}
                  className="w-full"
                />
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleSaveRecruiterNotes}
                    disabled={savingNotes}
                    className="text-xs"
                  >
                    {savingNotes ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>

            {/* Email History */}
            {selectedApplication.lastEmailSent && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email History
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500">Last Email Sent</div>
                      <div className="text-sm font-medium capitalize">{selectedApplication.lastEmailSent.replace(/_/g, ' ')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Email Sent Date</div>
                      <div className="text-sm font-medium">{selectedApplication.lastEmailSentAt ? formatDate(selectedApplication.lastEmailSentAt) : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => activeTab === 'jobs' ? handleDeleteJob(del!) : handleDeleteApplication(del!)}
        message={`Delete this ${activeTab === 'jobs' ? 'job' : 'application'}? This action cannot be undone.`}
      />
    </AdminShell>
  );
}
