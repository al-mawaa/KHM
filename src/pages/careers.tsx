import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Clock, Users, Calendar, Loader2, AlertCircle, X, Upload, CheckCircle, FileText, Linkedin } from "lucide-react";
import { PageHero } from "@/components/PageHero";

interface CareerJob {
  _id: string;
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

export default function CareersPage() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Application modal state
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CareerJob | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    currentLocation: '',
    totalExperience: '',
    currentCompany: '',
    currentDesignation: '',
    linkedinUrl: '',
    expectedSalary: '',
    coverLetter: '',
    resumeUrl: '',
    resumePublicId: '',
    resumeFile: null as File | null,
  });

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs from API...');
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/careers?status=Open');
      const data = await res.json();
      console.log('API response:', data);
      
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

  useEffect(() => {
    fetchJobs();
  }, []);

  // Lock body scroll when modal opens
  useEffect(() => {
    if (applicationModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [applicationModalOpen]);

  // ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && applicationModalOpen) {
        closeApplicationModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [applicationModalOpen]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openApplicationModal = (job: CareerJob) => {
    setSelectedJob(job);
    setApplicationModalOpen(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      currentLocation: '',
      totalExperience: '',
      currentCompany: '',
      currentDesignation: '',
      linkedinUrl: '',
      expectedSalary: '',
      coverLetter: '',
      resumeUrl: '',
      resumePublicId: '',
      resumeFile: null,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setSubmitError('Only PDF, DOC, and DOCX files are allowed');
      return;
    }

    // Validate file size (3.5MB to account for base64 overhead)
    if (file.size > 3.5 * 1024 * 1024) {
      setSubmitError('File size must be less than 3.5MB');
      return;
    }

    try {
      setUploading(true);
      setSubmitError(null);

      // Convert file to base64 for Vercel compatibility
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch('/api/upload-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: base64,
            fileName: file.name,
            mimeType: file.type,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setFormData({ ...formData, resumeUrl: data.filePath, resumePublicId: data.publicId, resumeFile: file });
        } else {
          setSubmitError(data.message || 'Failed to upload resume');
        }
        setUploading(false);
      };

      reader.onerror = () => {
        setSubmitError('Failed to read file');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Resume upload error:', err);
      setSubmitError('Failed to upload resume. Please try again.');
      setUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setSubmitError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setSubmitError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setSubmitError('Phone number is required');
      return false;
    }
    if (!formData.currentLocation.trim()) {
      setSubmitError('Current location is required');
      return false;
    }
    if (!formData.totalExperience.trim()) {
      setSubmitError('Total experience is required');
      return false;
    }
    if (!formData.currentCompany.trim()) {
      setSubmitError('Current company is required');
      return false;
    }
    if (!formData.currentDesignation.trim()) {
      setSubmitError('Current designation is required');
      return false;
    }
    if (!formData.linkedinUrl.trim()) {
      setSubmitError('LinkedIn profile URL is required');
      return false;
    }
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+/;
    if (!linkedinRegex.test(formData.linkedinUrl)) {
      setSubmitError('Please enter a valid LinkedIn profile URL');
      return false;
    }
    if (!formData.expectedSalary.trim()) {
      setSubmitError('Expected salary is required');
      return false;
    }
    if (!formData.resumeUrl) {
      setSubmitError('Resume is required');
      return false;
    }
    return true;
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const payload = {
        jobId: selectedJob._id,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        currentLocation: formData.currentLocation,
        totalExperience: formData.totalExperience,
        currentCompany: formData.currentCompany,
        currentDesignation: formData.currentDesignation,
        linkedinUrl: formData.linkedinUrl,
        expectedSalary: formData.expectedSalary,
        coverLetter: formData.coverLetter,
        resumeUrl: formData.resumeUrl,
        resumePublicId: formData.resumePublicId,
      };

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitSuccess(true);
        // Reset form after success
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          currentLocation: '',
          totalExperience: '',
          currentCompany: '',
          currentDesignation: '',
          linkedinUrl: '',
          expectedSalary: '',
          coverLetter: '',
          resumeUrl: '',
          resumePublicId: '',
          resumeFile: null,
        });
      } else {
        setSubmitError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Application submission error:', err);
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeApplicationModal = () => {
    setApplicationModalOpen(false);
    setSelectedJob(null);
    setSubmitError(null);
    setSubmitSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      currentLocation: '',
      totalExperience: '',
      currentCompany: '',
      currentDesignation: '',
      linkedinUrl: '',
      expectedSalary: '',
      coverLetter: '',
      resumeUrl: '',
      resumePublicId: '',
      resumeFile: null,
    });
  };

  return (
    <>
      <PageHero
        title="Join Our Team"
        subtitle="Build your career with a growing engineering organization focused on innovation, sustainability and excellence."
        breadcrumb="Careers"
      />

      {/* Open Positions Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-[32px] font-bold text-[#1a5276]">
              Open Positions
            </h2>
            <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full" />
          </motion.div>

          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-lg text-red-600 font-medium">{error}</p>
              <p className="text-sm text-gray-500 mt-2">Please try again later or contact support.</p>
            </motion.div>
          ) : loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Loader2 className="h-12 w-12 animate-spin text-[#1a5276] mb-4" />
              <p className="text-lg text-gray-600">Loading open positions...</p>
            </motion.div>
          ) : jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Briefcase className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Open Positions Available</h3>
              <p className="text-gray-500">Please check back later for future opportunities.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-[#25a244]/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1a5276] group-hover:text-[#25a244] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{job.department}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                      Open
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-[#1a5276]" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 text-[#1a5276]" />
                      <span>{job.employmentType}</span>
                    </div>
                    {job.experienceRequired && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-[#1a5276]" />
                        <span>{job.experienceRequired}</span>
                      </div>
                    )}
                    {job.numberOfOpenings && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-[#1a5276]" />
                        <span>{job.numberOfOpenings} opening{job.numberOfOpenings > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-[#1a5276]" />
                      <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                    </div>
                  </div>

                  {job.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {job.description}
                    </p>
                  )}

                  <button 
                    onClick={() => openApplicationModal(job)}
                    className="w-full bg-gradient-to-r from-[#1a5276] to-[#154360] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#25a244] hover:to-[#1a5276] transition-all duration-300 group-hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {applicationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeApplicationModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] my-4 md:my-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm">
                <div>
                  <h3 id="modal-title" className="text-2xl font-bold text-[#1a5276]">Apply for Position</h3>
                  {selectedJob && (
                    <p className="text-sm text-gray-600 mt-1">{selectedJob.title} - {selectedJob.department}</p>
                  )}
                </div>
                <button
                  onClick={closeApplicationModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully</h3>
                    <p className="text-gray-600 mb-6">Thank you for applying. Our HR team will review your application and contact you if shortlisted.</p>
                    <button
                      onClick={closeApplicationModal}
                      className="bg-gradient-to-r from-[#1a5276] to-[#154360] text-white py-3 px-8 rounded-lg font-semibold hover:from-[#25a244] hover:to-[#1a5276] transition-all duration-300"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="currentLocation"
                          value={formData.currentLocation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="City, State"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Experience <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="totalExperience"
                          value={formData.totalExperience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="e.g., 5 years"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="currentCompany"
                          value={formData.currentCompany}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="Company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Designation <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="currentDesignation"
                          value={formData.currentDesignation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="Job title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expected Salary <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="expectedSalary"
                          value={formData.expectedSalary}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="e.g., AED 15,000 - 20,000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LinkedIn Profile URL <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="url"
                          name="linkedinUrl"
                          value={formData.linkedinUrl}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Resume <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          disabled={uploading || submitting}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label
                          htmlFor="resume-upload"
                          className={`flex flex-col items-center justify-center gap-3 px-4 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                            formData.resumeUrl
                              ? 'border-green-500 bg-green-50 hover:bg-green-100'
                              : 'border-gray-300 hover:border-[#1a5276] hover:bg-gray-50'
                          } ${uploading || submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {uploading ? (
                              <>
                                <Loader2 className="h-8 w-8 text-[#1a5276] animate-spin" />
                                <span className="text-sm font-medium text-gray-600">Uploading...</span>
                              </>
                            ) : formData.resumeUrl ? (
                              <>
                                <FileText className="h-8 w-8 text-green-600" />
                                <div className="text-center">
                                  <span className="text-sm font-medium text-green-700">{formData.resumeFile?.name}</span>
                                  <p className="text-xs text-green-600 mt-1">Resume uploaded successfully</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-gray-400" />
                                <div className="text-center">
                                  <span className="text-sm font-medium text-gray-700">Upload Resume</span>
                                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 3.5MB)</p>
                                </div>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cover Letter
                      </label>
                      <textarea
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent resize-none"
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                      <button
                        onClick={closeApplicationModal}
                        disabled={submitting || uploading}
                        className="w-full sm:flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitApplication}
                        disabled={submitting || uploading || !formData.resumeUrl}
                        className="w-full sm:flex-1 bg-gradient-to-r from-[#1a5276] to-[#154360] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#25a244] hover:to-[#1a5276] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
