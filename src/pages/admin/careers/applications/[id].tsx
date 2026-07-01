import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card, Button, Field, Input, Textarea, Select, Modal, Confirm } from '@/components/admin/ui';
import {
  ArrowLeft, Eye, Download, Mail, Phone, MapPin, Building, Briefcase,
  Clock, Award, Linkedin, FileText, Calendar, UserCheck, MessageSquare,
  Save, Loader2, ChevronRight, CheckCircle
} from "lucide-react";
import { toast } from "sonner";

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

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

export default function CandidateProfile() {
  const router = useRouter();
  const { id } = router.query;
  
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/careers/applications/${id}`);
      const data = await res.json();
      
      if (data.success) {
        setApplication(data.data);
        setRecruiterNotes(data.data.recruiterNotes || '');
      } else {
        setError(data.message || 'Failed to fetch application');
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!application) return;

    try {
      setSavingNotes(true);
      
      const res = await fetch(`/api/careers/applications/${application._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recruiterNotes }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Recruiter notes saved successfully');
        await fetchApplication();
      } else {
        toast.error(data.message || 'Failed to save notes');
      }
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!application || !newStatus) return;

    try {
      setUpdating(true);
      
      const res = await fetch(`/api/careers/applications/${application._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationStatus: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Status updated successfully');
        setStatusModalOpen(false);
        setNewStatus('');
        await fetchApplication();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
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
    link.download = `resume_${application?.fullName.replace(/\s+/g, '_')}.${getResumeExtension(url)}`;
    link.click();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Shortlisted': 'bg-blue-100 text-blue-700',
      'Interview Scheduled': 'bg-purple-100 text-purple-700',
      'Interview Completed': 'bg-indigo-100 text-indigo-700',
      'Selected': 'bg-emerald-100 text-emerald-700',
      'Hired': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  const getTimelineStage = (status: string) => {
    const stages = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Hired'];
    const currentIndex = stages.indexOf(status);
    return currentIndex >= 0 ? currentIndex : -1;
  };

  if (loading) {
    return (
      <AdminShell title="Candidate Profile">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </AdminShell>
    );
  }

  if (error || !application) {
    return (
      <AdminShell title="Candidate Profile">
        <div className="text-center py-12">
          <p className="text-slate-600">{error || 'Application not found'}</p>
          <Button 
            variant="secondary" 
            onClick={() => router.push('/admin/careers')}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Careers
          </Button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Candidate Profile">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button 
            variant="secondary" 
            onClick={() => router.push('/admin/careers')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Careers
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={() => setStatusModalOpen(true)}
            >
              Update Status
            </Button>
          </div>
        </div>

        {/* Application Timeline */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Application Timeline</div>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {['Pending', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Hired'].map((stage, index) => {
              const currentStage = getTimelineStage(application.applicationStatus);
              const isCompleted = index <= currentStage;
              const isCurrent = index === currentStage;
              const isRejected = application.applicationStatus === 'Rejected';
              
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
            <UserCheck className="h-4 w-4" /> Candidate Information
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Full Name</div>
                  <div className="text-sm font-medium">{application.fullName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Email</div>
                  <div className="text-sm font-medium">{application.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Phone</div>
                  <div className="text-sm font-medium">{application.phoneNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Location</div>
                  <div className="text-sm font-medium">{application.currentLocation || 'N/A'}</div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Current Company</div>
                  <div className="text-sm font-medium">{application.currentCompany || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Current Designation</div>
                  <div className="text-sm font-medium">{application.currentDesignation || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Total Experience</div>
                  <div className="text-sm font-medium">{application.totalExperience || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Expected Salary</div>
                  <div className="text-sm font-medium">{application.expectedSalary || 'N/A'}</div>
                </div>
              </div>
            </div>
            {application.linkedinUrl && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">LinkedIn Profile</div>
                  <div className="text-sm font-medium">
                    <a href={application.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Applied Position</div>
                  <div className="text-sm font-medium">{application.jobTitle || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Application Date</div>
                  <div className="text-sm font-medium">{formatDate(application.createdAt)}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-slate-500">Current Status</div>
              {getStatusBadge(application.applicationStatus)}
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Resume
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            {application.resumeUrl ? (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-700">Resume uploaded successfully</div>
                  <div className="text-xs text-slate-500">{getResumeExtension(application.resumeUrl).toUpperCase()} Format</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => openResume(application.resumeUrl)}
                    className="text-xs"
                  >
                    <Eye className="h-4 w-4 mr-1" /> View Resume
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => downloadResume(application.resumeUrl)}
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
        {application.coverLetter && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Cover Letter
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="text-sm whitespace-pre-wrap text-slate-700">{application.coverLetter}</div>
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        {application.activityTimeline && application.activityTimeline.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Activity Timeline
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="space-y-4">
                {application.activityTimeline
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((activity, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        {index < application.activityTimeline!.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold">{activity.action}</div>
                          <div className="text-xs text-slate-500">{formatDateTime(activity.date)}</div>
                        </div>
                        {activity.notes && (
                          <div className="text-xs text-slate-600 mt-1">{activity.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
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
                onClick={handleSaveNotes}
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
        {application.lastEmailSent && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email History
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500">Last Email Sent</div>
                  <div className="text-sm font-medium capitalize">{application.lastEmailSent.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Email Sent Date</div>
                  <div className="text-sm font-medium">{formatDateTime(application.lastEmailSentAt)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <Modal open={statusModalOpen} onClose={() => setStatusModalOpen(false)} title="Update Application Status">
        <div className="space-y-4">
          <Field label="New Status">
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select status...</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interview Completed">Interview Completed</option>
              <option value="Selected">Selected</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </Field>
          <div className="flex gap-2 pt-4">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={updating || !newStatus} className="flex-1">
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Status'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  );
}
