import { useState, useEffect } from 'react';
import { Card, Button, Field, Input, Textarea, Modal, Confirm, Select } from '@/components/admin/ui';
import { Plus, Pencil, Trash2, Search, FileText, HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CareerSection {
  _id?: string;
  sectionType: 'recruitment_process' | 'faq';
  title: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface RecruitmentStep {
  _id?: string;
  sectionId: string;
  stepNumber: number;
  title: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

interface CareerFAQ {
  _id?: string;
  sectionId: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}


type ActiveSection = 'recruitment_process' | 'faq';

export default function CareerContentTab() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('recruitment_process');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Recruitment Steps
  const [recruitmentSection, setRecruitmentSection] = useState<CareerSection | null>(null);
  const [recruitmentSteps, setRecruitmentSteps] = useState<RecruitmentStep[]>([]);
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<RecruitmentStep | null>(null);
  const [stepForm, setStepForm] = useState({
    stepNumber: 1,
    title: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  });

  // FAQs
  const [faqSection, setFaqSection] = useState<CareerSection | null>(null);
  const [faqs, setFaqs] = useState<CareerFAQ[]>([]);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<CareerFAQ | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    displayOrder: 0,
    isActive: true,
  });
  const [faqSearch, setFaqSearch] = useState('');

  // Fetch functions
  const fetchRecruitmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const sectionsRes = await fetch('/api/career-content/sections?sectionType=recruitment_process');
      const stepsRes = await fetch('/api/career-content/recruitment-steps?active=true');

      const sectionsData = await sectionsRes.json();
      const stepsData = await stepsRes.json();

      if (sectionsData.success && sectionsData.data.length > 0) {
        setRecruitmentSection(sectionsData.data[0]);
      }
      if (stepsData.success) {
        setRecruitmentSteps(stepsData.data);
      }
    } catch (err) {
      setError('Failed to fetch recruitment data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaqData = async () => {
    try {
      setLoading(true);
      setError(null);

      const sectionsRes = await fetch('/api/career-content/sections?sectionType=faq');
      const faqsRes = await fetch('/api/career-content/faqs?active=true');

      const sectionsData = await sectionsRes.json();
      const faqsData = await faqsRes.json();

      if (sectionsData.success && sectionsData.data.length > 0) {
        setFaqSection(sectionsData.data[0]);
      }
      if (faqsData.success) {
        setFaqs(faqsData.data);
      }
    } catch (err) {
      setError('Failed to fetch FAQ data');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (activeSection === 'recruitment_process') {
      fetchRecruitmentData();
    } else if (activeSection === 'faq') {
      fetchFaqData();
    }
  }, [activeSection]);

  // Recruitment Step CRUD
  const handleSaveStep = async () => {
    try {
      setUpdating('step');
      setError(null);

      if (!stepForm.description) {
        setError('Description is required');
        toast.error('Description is required');
        return;
      }

      // Create section if it doesn't exist
      let sectionId = recruitmentSection?._id;
      if (!sectionId) {
        const sectionRes = await fetch('/api/career-content/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sectionType: 'recruitment_process',
            title: 'Recruitment Process',
            description: 'Our recruitment process',
            displayOrder: 0,
            isActive: true,
          }),
        });
        const sectionData = await sectionRes.json();
        if (sectionData.success) {
          sectionId = sectionData.data._id;
          setRecruitmentSection(sectionData.data);
        } else {
          setError('Failed to create section');
          toast.error('Failed to create section');
          return;
        }
      }

      const payload = {
        ...stepForm,
        title: `Step ${stepForm.stepNumber}`,
        sectionId,
      };

      const url = editingStep?._id
        ? `/api/career-content/recruitment-steps/${editingStep._id}`
        : '/api/career-content/recruitment-steps';
      const method = editingStep?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editingStep?._id ? 'Step updated successfully' : 'Step created successfully');
        setStepModalOpen(false);
        setEditingStep(null);
        setStepForm({ stepNumber: 1, title: '', description: '', displayOrder: 0, isActive: true });
        await fetchRecruitmentData();
      } else {
        setError(data.message || 'Failed to save step');
        toast.error(data.message || 'Failed to save step');
      }
    } catch (err) {
      setError('Failed to save step');
      toast.error('Failed to save step');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteStep = async (id: string) => {
    try {
      const res = await fetch(`/api/career-content/recruitment-steps/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Step deleted successfully');
        await fetchRecruitmentData();
        setDel(null);
      } else {
        setError(data.message || 'Failed to delete step');
        toast.error(data.message || 'Failed to delete step');
      }
    } catch (err) {
      setError('Failed to delete step');
      toast.error('Failed to delete step');
    }
  };

  const handleToggleStepStatus = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(id);
      const res = await fetch(`/api/career-content/recruitment-steps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Step status updated successfully');
        await fetchRecruitmentData();
      } else {
        toast.error(data.message || 'Failed to update step status');
      }
    } catch (err) {
      toast.error('Failed to update step status');
    } finally {
      setUpdating(null);
    }
  };

  // FAQ CRUD
  const handleSaveFaq = async () => {
    try {
      setUpdating('faq');
      setError(null);

      if (!faqForm.question || !faqForm.answer) {
        setError('Question and answer are required');
        toast.error('Question and answer are required');
        return;
      }

      // Create section if it doesn't exist
      let sectionId = faqSection?._id;
      if (!sectionId) {
        const sectionRes = await fetch('/api/career-content/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sectionType: 'faq',
            title: 'Frequently Asked Questions',
            description: 'Common questions about careers',
            displayOrder: 1,
            isActive: true,
          }),
        });
        const sectionData = await sectionRes.json();
        if (sectionData.success) {
          sectionId = sectionData.data._id;
          setFaqSection(sectionData.data);
        } else {
          setError('Failed to create section');
          toast.error('Failed to create section');
          return;
        }
      }

      const payload = {
        ...faqForm,
        sectionId,
      };

      const url = editingFaq?._id
        ? `/api/career-content/faqs/${editingFaq._id}`
        : '/api/career-content/faqs';
      const method = editingFaq?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editingFaq?._id ? 'FAQ updated successfully' : 'FAQ created successfully');
        setFaqModalOpen(false);
        setEditingFaq(null);
        setFaqForm({ question: '', answer: '', displayOrder: 0, isActive: true });
        await fetchFaqData();
      } else {
        setError(data.message || 'Failed to save FAQ');
        toast.error(data.message || 'Failed to save FAQ');
      }
    } catch (err) {
      setError('Failed to save FAQ');
      toast.error('Failed to save FAQ');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const res = await fetch(`/api/career-content/faqs/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        toast.success('FAQ deleted successfully');
        await fetchFaqData();
        setDel(null);
      } else {
        setError(data.message || 'Failed to delete FAQ');
        toast.error(data.message || 'Failed to delete FAQ');
      }
    } catch (err) {
      setError('Failed to delete FAQ');
      toast.error('Failed to delete FAQ');
    }
  };


  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Section Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <Button
          variant={activeSection === 'recruitment_process' ? 'primary' : 'ghost'}
          onClick={() => setActiveSection('recruitment_process')}
          className="rounded-b-none"
        >
          <FileText className="h-4 w-4" /> Recruitment Process
        </Button>
        <Button
          variant={activeSection === 'faq' ? 'primary' : 'ghost'}
          onClick={() => setActiveSection('faq')}
          className="rounded-b-none"
        >
          <HelpCircle className="h-4 w-4" /> FAQs
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : activeSection === 'recruitment_process' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recruitment Process</h2>
              <p className="text-sm text-slate-500 mt-1">Manage the steps of your recruitment process</p>
            </div>
            <Button onClick={() => { setEditingStep(null); setStepForm({ stepNumber: recruitmentSteps.length + 1, title: '', description: '', displayOrder: recruitmentSteps.length, isActive: true }); setStepModalOpen(true); }}>
              <Plus className="h-4 w-4" /> Add Step
            </Button>
          </div>

          {recruitmentSteps.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg">No recruitment steps found</p>
              <p className="text-slate-400 text-sm mt-2">Add your first recruitment step to get started</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recruitmentSteps.map((step) => (
                <Card key={step._id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1a5276] text-white flex items-center justify-center font-bold">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => { setEditingStep(step); setStepForm({ stepNumber: step.stepNumber, title: step.title, description: step.description, displayOrder: step.displayOrder, isActive: step.isActive }); setStepModalOpen(true); }}
                        className="text-xs"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setDel(step._id!)}
                        className="text-xs"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : activeSection === 'faq' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">FAQs</h2>
              <p className="text-sm text-slate-500 mt-1">Manage frequently asked questions</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => { setEditingFaq(null); setFaqForm({ question: '', answer: '', displayOrder: faqs.length, isActive: true }); setFaqModalOpen(true); }}>
                <Plus className="h-4 w-4" /> Add FAQ
              </Button>
            </div>
          </div>

          {faqs.length === 0 ? (
            <Card className="p-8 text-center">
              <HelpCircle className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg">No FAQs found</p>
              <p className="text-slate-400 text-sm mt-2">Add your first FAQ to get started</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {faqs
                .filter(faq => 
                  faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
                  faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
                )
                .map((faq) => (
                <Card key={faq._id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                        {!faq.isActive && (
                          <span className="text-xs text-slate-400">(Inactive)</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        variant="ghost"
                        onClick={() => { setEditingFaq(faq); setFaqForm({ question: faq.question, answer: faq.answer, displayOrder: faq.displayOrder, isActive: faq.isActive }); setFaqModalOpen(true); }}
                        className="text-xs"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setDel(faq._id!)}
                        className="text-xs"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Step Modal */}
      <Modal open={stepModalOpen} onClose={() => setStepModalOpen(false)} title={editingStep?._id ? 'Edit Step' : 'Add Step'}>
        <div className="space-y-4">
          <Field label="Step Number">
            <Input
              type="number"
              value={stepForm.stepNumber}
              onChange={(e) => setStepForm({ ...stepForm, stepNumber: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </Field>
          <Field label="Description *">
            <Textarea
              value={stepForm.description}
              onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
              placeholder="Describe this step..."
              rows={4}
            />
          </Field>
          <div className="flex gap-2 pt-4">
            <Button variant="secondary" onClick={() => setStepModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveStep} disabled={updating === 'step'} className="flex-1">
              {updating === 'step' ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingStep?._id ? 'Update' : 'Create')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* FAQ Modal */}
      <Modal open={faqModalOpen} onClose={() => setFaqModalOpen(false)} title={editingFaq?._id ? 'Edit FAQ' : 'Add FAQ'}>
        <div className="space-y-4">
          <Field label="Question *">
            <Input
              value={faqForm.question}
              onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
              placeholder="e.g. What is the application process?"
            />
          </Field>
          <Field label="Answer *">
            <Textarea
              value={faqForm.answer}
              onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              placeholder="Provide the answer..."
              rows={4}
            />
          </Field>
          <div className="flex gap-2 pt-4">
            <Button variant="secondary" onClick={() => setFaqModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveFaq} disabled={updating === 'faq'} className="flex-1">
              {updating === 'faq' ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingFaq?._id ? 'Update' : 'Create')}
            </Button>
          </div>
        </div>
      </Modal>


      {/* Delete Confirmation */}
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => {
          if (activeSection === 'recruitment_process') handleDeleteStep(del!);
          else if (activeSection === 'faq') handleDeleteFaq(del!);
        }}
        message="Delete this item? This action cannot be undone."
      />
    </div>
  );
}
