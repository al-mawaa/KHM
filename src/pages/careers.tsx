import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Clock, Users, Calendar, Loader2, AlertCircle, X, Upload, CheckCircle, FileText, Linkedin, MessageSquare, HelpCircle, Award, Plus, Minus, Lightbulb, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

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

interface CareerContent {
  sections: Array<{
    _id: string;
    sectionType: string;
    title: string;
    description?: string;
    displayOrder: number;
  }>;
  recruitmentProcess: {
    section?: any;
    steps: Array<{
      _id: string;
      stepNumber: number;
      title: string;
      description: string;
      displayOrder: number;
    }>;
  };
  faqs: {
    section?: any;
    items: Array<{
      _id: string;
      question: string;
      answer: string;
      displayOrder: number;
    }>;
  };
  benefits: {
    section?: any;
    items: Array<{
      _id: string;
      iconUrl?: string;
      title: string;
      description: string;
      buttonText?: string;
      buttonLink?: string;
      displayOrder: number;
    }>;
  };
  generalInfo: {
    section?: any;
    items: Array<{
      _id: string;
      heading: string;
      content: string;
      videoUrl?: string;
      ctaButton?: string;
      ctaLink?: string;
      displayOrder: number;
    }>;
  };
}

export default function CareersPage() {
  useVisitorTracking('Careers');
  
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [careerContent, setCareerContent] = useState<CareerContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  // Application modal state
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CareerJob | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [enquiryUploading, setEnquiryUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  
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

  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    departmentInterested: '',
    totalExperience: '',
    currentLocation: '',
    message: '',
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

  const fetchCareerContent = async () => {
    try {
      const res = await fetch('/api/career-content');
      const data = await res.json();
      
      if (data.success) {
        setCareerContent(data.data);
      }
    } catch (err) {
      console.error('Error fetching career content:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCareerContent();
  }, []);

  // Lock body scroll when modal opens
  useEffect(() => {
    if (applicationModalOpen || enquiryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [applicationModalOpen, enquiryModalOpen]);

  // ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && applicationModalOpen) {
        closeApplicationModal();
      }
      if (e.key === 'Escape' && enquiryModalOpen) {
        closeEnquiryModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [applicationModalOpen, enquiryModalOpen]);

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

  const handleEnquiryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEnquiryForm({ ...enquiryForm, [e.target.name]: e.target.value });
  };

  const uploadResume = async (
    file: File,
    onSuccess: (url: string, publicId: string, fileRef: File) => void,
    setUploadingState: (v: boolean) => void,
    setErrorState: (msg: string | null) => void
  ) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setErrorState('Only PDF, DOC, and DOCX files are allowed');
      return;
    }
    if (file.size > 3.5 * 1024 * 1024) {
      setErrorState('File size must be less than 3.5MB');
      return;
    }

    try {
      setUploadingState(true);
      setErrorState(null);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const response = await fetch('/api/upload-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, fileName: file.name, mimeType: file.type }),
        });
        const data = await response.json();
        if (data.success) {
          onSuccess(data.filePath, data.publicId, file);
        } else {
          setErrorState(data.message || 'Failed to upload resume');
        }
        setUploadingState(false);
      };
      reader.onerror = () => {
        setErrorState('Failed to read file');
        setUploadingState(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorState('Failed to upload resume. Please try again.');
      setUploadingState(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadResume(
      file,
      (url, publicId, fileRef) => setFormData({ ...formData, resumeUrl: url, resumePublicId: publicId, resumeFile: fileRef }),
      setUploading,
      setSubmitError
    );
  };

  const handleEnquiryResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadResume(
      file,
      (url, publicId, fileRef) => setEnquiryForm({ ...enquiryForm, resumeUrl: url, resumePublicId: publicId, resumeFile: fileRef }),
      setEnquiryUploading,
      setEnquiryError
    );
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

  const openEnquiryModal = () => {
    setEnquiryModalOpen(true);
    setEnquiryError(null);
    setEnquirySuccess(false);
    setEnquiryForm({
      fullName: '',
      email: '',
      phoneNumber: '',
      departmentInterested: '',
      totalExperience: '',
      currentLocation: '',
      message: '',
      resumeUrl: '',
      resumePublicId: '',
      resumeFile: null,
    });
  };

  const closeEnquiryModal = () => {
    setEnquiryModalOpen(false);
    setEnquiryError(null);
    setEnquirySuccess(false);
    setEnquiryForm({
      fullName: '',
      email: '',
      phoneNumber: '',
      departmentInterested: '',
      totalExperience: '',
      currentLocation: '',
      message: '',
      resumeUrl: '',
      resumePublicId: '',
      resumeFile: null,
    });
  };

  const validateEnquiryForm = () => {
    if (!enquiryForm.fullName.trim()) {
      setEnquiryError('Full name is required');
      return false;
    }
    if (!enquiryForm.email.trim()) {
      setEnquiryError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enquiryForm.email)) {
      setEnquiryError('Please enter a valid email address');
      return false;
    }
    if (!enquiryForm.phoneNumber.trim()) {
      setEnquiryError('Phone number is required');
      return false;
    }
    if (!enquiryForm.departmentInterested.trim()) {
      setEnquiryError('Department or role is required');
      return false;
    }
    if (!enquiryForm.message.trim()) {
      setEnquiryError('Message is required');
      return false;
    }
    return true;
  };

  const handleSubmitEnquiry = async () => {
    if (!validateEnquiryForm()) return;

    try {
      setEnquirySubmitting(true);
      setEnquiryError(null);

      const res = await fetch('/api/careers/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryForm),
      });

      const data = await res.json();

      if (data.success) {
        setEnquirySuccess(true);
        setEnquiryForm({
          fullName: '',
          email: '',
          phoneNumber: '',
          departmentInterested: '',
          totalExperience: '',
          currentLocation: '',
          message: '',
          resumeUrl: '',
          resumePublicId: '',
          resumeFile: null,
        });
      } else {
        setEnquiryError(data.message || 'Failed to submit enquiry');
      }
    } catch {
      setEnquiryError('Failed to submit enquiry. Please try again.');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Join Our Team"
        subtitle="Build your career with a growing engineering organization focused on innovation, sustainability and excellence."
      />


      {/* Dynamic Career Content Sections */}
      {careerContent && (
        <>
          {/* Recruitment Process Section */}
          {careerContent.recruitmentProcess.section && careerContent.recruitmentProcess.steps.length > 0 && (
            <section className="py-16 lg:py-24 bg-slate-50">
              <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-[32px] font-bold text-[#1a5276]">
                    {careerContent.recruitmentProcess.section.title}
                  </h2>
                  {careerContent.recruitmentProcess.section.description && (
                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                      {careerContent.recruitmentProcess.section.description}
                    </p>
                  )}
                  <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careerContent.recruitmentProcess.steps.map((step, index) => (
                    <motion.div
                      key={step._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#1a5276] to-[#25a244] text-white flex items-center justify-center font-bold text-lg">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#1a5276] mb-2">{step.title}</h3>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Career Benefits Section */}
          {careerContent.benefits.section && careerContent.benefits.items.length > 0 && (
            <section className="py-16 lg:py-24 bg-white">
              <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-[32px] font-bold text-[#1a5276]">
                    {careerContent.benefits.section.title}
                  </h2>
                  {careerContent.benefits.section.description && (
                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                      {careerContent.benefits.section.description}
                    </p>
                  )}
                  <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full mx-auto" />
                </motion.div>

                <div className={`grid gap-6 ${
                  careerContent.benefits.items.length === 2 ? 'md:grid-cols-2' :
                  careerContent.benefits.items.length === 3 ? 'md:grid-cols-3' :
                  'md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {careerContent.benefits.items.map((benefit, index) => (
                    <motion.div
                      key={benefit._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 flex flex-col h-full"
                    >
                      {benefit.iconUrl && (
                        <div className="mb-6 flex justify-center">
                          <img src={benefit.iconUrl} alt="" className="w-20 h-20 object-contain" />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-[#1a5276] mb-4">{benefit.title}</h3>
                      <p className="text-sm text-slate-600 mb-6 flex-1 whitespace-pre-wrap">{benefit.description}</p>
                      {benefit.buttonText && benefit.buttonLink && (
                        <a
                          href={benefit.buttonLink}
                          className="inline-block text-sm font-semibold text-[#1a5276] hover:text-[#25a244] transition-colors mt-auto"
                        >
                          {benefit.buttonText} →
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Student Jobs and Internships Section (Static) */}
          <section className="py-16 lg:py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-[32px] font-bold text-[#1a5276]">
                  Student Jobs and Internships
                </h2>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full mx-auto" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="mb-6 flex justify-center">
                    <FileText className="w-16 h-16 text-[#1a5276]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a5276] mb-4 text-left">
                    Collaborate with KHM Infra on your projects
                  </h3>
                  <p className="text-sm text-slate-600 text-left flex-1">
                    Are you working on your engineering project, research, or thesis? We welcome innovative ideas and provide opportunities to collaborate with our experts on real-world infrastructure and wastewater management challenges.
                  </p>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="mb-6 flex justify-center">
                    <Lightbulb className="w-16 h-16 text-[#1a5276]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a5276] mb-4 text-left">
                    Gain Industry Insights and Guidance
                  </h3>
                  <p className="text-sm text-slate-600 text-left flex-1">
                    Work alongside experienced engineers and industry professionals to gain practical knowledge, develop technical skills, and understand real-world project execution.
                  </p>
                </motion.div>

                {/* Card 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="mb-6 flex justify-center">
                    <GraduationCap className="w-16 h-16 text-[#1a5276]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a5276] mb-4 text-left">
                    Career Opportunities for Fresh Graduates
                  </h3>
                  <p className="text-sm text-slate-600 text-left flex-1 mb-6">
                    Kick-start your professional journey with structured learning, mentorship, and exciting career opportunities at KHM Infra.
                  </p>
                  <button
                    onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-block text-sm font-semibold text-[#1a5276] hover:text-[#25a244] transition-colors mt-auto text-left"
                  >
                    View Open Positions →
                  </button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Current Openings Section */}
          <section id="open-positions" className="py-16 lg:py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
              >
                <div>
                  <h2 className="text-[32px] font-bold text-[#1a5276]">
                    Current Openings
                  </h2>
                  <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full" />
                </div>
                <button
                  onClick={openEnquiryModal}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#1a5276] bg-white px-6 py-3 text-sm font-semibold text-[#1a5276] transition-all hover:bg-[#1a5276] hover:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                  Job Enquiry
                </button>
              </motion.div>

              {error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                  <p className="text-lg text-red-600 font-medium">{error}</p>
                  <p className="text-sm text-black mt-2">Please try again later or contact support.</p>
                </motion.div>
              ) : loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <Loader2 className="h-12 w-12 animate-spin text-[#1a5276] mb-4" />
                  <p className="text-lg text-black">Loading current openings...</p>
                </motion.div>
              ) : jobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <Briefcase className="h-16 w-16 text-black mb-4" />
                  <h3 className="text-2xl font-semibold text-black mb-2">No Current Openings Available</h3>
                  <p className="text-black mb-6">Please check back later for future opportunities.</p>
                  <button
                    onClick={openEnquiryModal}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1a5276] to-[#154360] px-6 py-3 text-sm font-semibold text-white transition-all hover:from-[#25a244] hover:to-[#1a5276]"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Submit Job Enquiry
                  </button>
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
                          <p className="text-sm text-black mt-1">{job.department}</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                          Open
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-black">
                          <MapPin className="h-4 w-4 text-[#1a5276]" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black">
                          <Briefcase className="h-4 w-4 text-[#1a5276]" />
                          <span>{job.employmentType}</span>
                        </div>
                        {job.experienceRequired && (
                          <div className="flex items-center gap-2 text-sm text-black">
                            <Clock className="h-4 w-4 text-[#1a5276]" />
                            <span>{job.experienceRequired}</span>
                          </div>
                        )}
                        {job.numberOfOpenings && (
                          <div className="flex items-center gap-2 text-sm text-black">
                            <Users className="h-4 w-4 text-[#1a5276]" />
                            <span>{job.numberOfOpenings} opening{job.numberOfOpenings > 1 ? 's' : ''}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-black">
                          <Calendar className="h-4 w-4 text-[#1a5276]" />
                          <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                        </div>
                      </div>

                      {job.description && (
                        <p className="text-sm text-black line-clamp-2 mb-4">
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

          {/* FAQ Section */}
          {careerContent.faqs.section && careerContent.faqs.items.length > 0 && (
            <section className="py-16 lg:py-24 bg-slate-50">
              <div className="mx-auto max-w-4xl px-4 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-[32px] font-bold text-[#1a5276]">
                    {careerContent.faqs.section.title}
                  </h2>
                  {careerContent.faqs.section.description && (
                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                      {careerContent.faqs.section.description}
                    </p>
                  )}
                  <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full mx-auto" />
                </motion.div>

                <div className="space-y-4">
                  {careerContent.faqs.items.map((faq, index) => (
                    <motion.div
                      key={faq._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq._id ? null : faq._id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                      >
                        <h3 className="font-semibold text-[#1a5276]">{faq.question}</h3>
                        {expandedFaq === faq._id ? (
                          <Minus className="h-5 w-5 text-slate-400" />
                        ) : (
                          <Plus className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === faq._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-4"
                          >
                            <p className="text-slate-600 whitespace-pre-wrap">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Application Modal */}
      <AnimatePresence>
        {applicationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
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
              className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] my-4 md:my-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm">
                <div>
                  <h3 id="modal-title" className="text-2xl font-bold text-[#1a5276]">Apply for Position</h3>
                  {selectedJob && (
                    <p className="text-sm text-black mt-1">{selectedJob.title} - {selectedJob.department}</p>
                  )}
                </div>
                <button
                  onClick={closeApplicationModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-black" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-black mb-2">Application Submitted Successfully</h3>
                    <p className="text-black mb-6">Thank you for applying. Our HR team will review your application and contact you if shortlisted.</p>
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                        <label className="block text-sm font-semibold text-black mb-2">
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
                      <label className="block text-sm font-semibold text-black mb-2">
                        LinkedIn Profile URL <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
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
                      <label className="block text-sm font-semibold text-black mb-2">
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
                                <span className="text-sm font-medium text-black">Uploading...</span>
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
                                <Upload className="h-8 w-8 text-black" />
                                <div className="text-center">
                                  <span className="text-sm font-medium text-black">Upload Resume</span>
                                  <p className="text-xs text-black mt-1">PDF, DOC, DOCX (Max 3.5MB)</p>
                                </div>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
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
                        className="w-full sm:flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Job Enquiry Modal */}
      <AnimatePresence>
        {enquiryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeEnquiryModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div>
                  <h3 id="enquiry-modal-title" className="text-2xl font-bold text-[#1a5276]">Job Enquiry</h3>
                  <p className="text-sm text-black mt-1">Share your details and we will contact you when a suitable role opens.</p>
                </div>
                <button
                  onClick={closeEnquiryModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-black" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {enquirySuccess ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-black mb-2">Enquiry Submitted Successfully</h3>
                    <p className="text-black mb-6">Thank you for your interest. Our HR team will review your enquiry and get in touch.</p>
                    <button
                      onClick={closeEnquiryModal}
                      className="bg-gradient-to-r from-[#1a5276] to-[#154360] text-white py-3 px-8 rounded-lg font-semibold hover:from-[#25a244] hover:to-[#1a5276] transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {enquiryError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">{enquiryError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={enquiryForm.fullName}
                          onChange={handleEnquiryInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={enquiryForm.email}
                          onChange={handleEnquiryInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={enquiryForm.phoneNumber}
                          onChange={handleEnquiryInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Department / Role Interested In <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="departmentInterested"
                          value={enquiryForm.departmentInterested}
                          onChange={handleEnquiryInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="e.g. Civil Engineering, Project Manager"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Total Experience</label>
                        <input
                          type="text"
                          name="totalExperience"
                          value={enquiryForm.totalExperience}
                          onChange={handleEnquiryInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="e.g. 5 years"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Current Location</label>
                        <input
                          type="text"
                          name="currentLocation"
                          value={enquiryForm.currentLocation}
                          onChange={handleEnquiryInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent"
                          placeholder="City, State"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={enquiryForm.message}
                        onChange={handleEnquiryInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5276] focus:border-transparent resize-none"
                        placeholder="Tell us about your skills, preferred role, and why you want to join KHM..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Resume (Optional)</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleEnquiryResumeUpload}
                        disabled={enquiryUploading || enquirySubmitting}
                        className="hidden"
                        id="enquiry-resume-upload"
                      />
                      <label
                        htmlFor="enquiry-resume-upload"
                        className={`flex flex-col items-center justify-center gap-3 px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          enquiryForm.resumeUrl
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-[#1a5276] hover:bg-gray-50'
                        } ${enquiryUploading || enquirySubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {enquiryUploading ? (
                          <>
                            <Loader2 className="h-8 w-8 text-[#1a5276] animate-spin" />
                            <span className="text-sm text-black">Uploading...</span>
                          </>
                        ) : enquiryForm.resumeUrl ? (
                          <>
                            <FileText className="h-8 w-8 text-green-600" />
                            <span className="text-sm font-medium text-green-700">{enquiryForm.resumeFile?.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-black" />
                            <span className="text-sm text-black">Upload Resume (PDF, DOC, DOCX)</span>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={closeEnquiryModal}
                        disabled={enquirySubmitting || enquiryUploading}
                        className="w-full sm:flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitEnquiry}
                        disabled={enquirySubmitting || enquiryUploading}
                        className="w-full sm:flex-1 bg-gradient-to-r from-[#1a5276] to-[#154360] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#25a244] hover:to-[#1a5276] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {enquirySubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Enquiry'
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
