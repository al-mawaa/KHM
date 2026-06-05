import { useState, useEffect, useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Field, Input, Textarea, Select, Modal, Confirm } from "@/components/admin/ui";
import { Plus, Pencil, Trash2, Star, Check, X, Loader2, MessageSquare, Filter, Search, Download, TrendingUp, Star as StarIcon } from "lucide-react";
import { toast } from "sonner";

interface TestimonialItem {
  _id?: string;
  name: string;
  feedback: string;
  industryType: string;
  rating?: number;
  status: 'pending' | 'approved' | 'rejected';
  companyName?: string;
  designation?: string;
  city?: string;
  profileImage?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
type SortOption = 'newest' | 'oldest' | 'highest_rating' | 'featured';

interface AnalyticsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  averageRating: number;
  approvalRate: number;
  rejectionRate: number;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const fetchTestimonials = async () => {
    try {
      console.log('Fetching testimonials...');
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filter && filter !== 'all') params.append('status', filter);
      if (searchQuery) params.append('search', searchQuery);
      if (sort) params.append('sort', sort);
      
      const url = `/api/testimonials${params.toString() ? '?' + params.toString() : ''}`;
      
      const res = await fetch(url);
      const data = await res.json();
      console.log('API response:', data);
      
      if (data.success) {
        setItems(data.data);
      } else {
        setError(data.message || 'Failed to fetch testimonials');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/testimonials/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [filter, searchQuery, sort]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      console.log(`Updating testimonial ${id} to ${newStatus}`);
      setUpdating(id);
      setError(null);

      const res = await fetch(`/api/testimonials/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      console.log('Status update response:', data);

      if (data.success) {
        toast.success(`Testimonial ${newStatus} successfully`);
        await fetchTestimonials();
        await fetchAnalytics();
      } else {
        setError(data.message || 'Failed to update testimonial status');
        toast.error(data.message || 'Failed to update testimonial status');
      }
    } catch (err) {
      console.error('Error updating testimonial status:', err);
      setError('Failed to update testimonial status');
      toast.error('Failed to update testimonial status');
    } finally {
      setUpdating(null);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      setUpdating(id);
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Testimonial ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
        await fetchTestimonials();
      } else {
        toast.error(data.message || 'Failed to update featured status');
      }
    } catch (err) {
      toast.error('Failed to update featured status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting testimonial:', id);
      
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log('Delete response:', data);

      if (data.success) {
        toast.success('Testimonial deleted successfully');
        await fetchTestimonials();
        await fetchAnalytics();
        setDel(null);
      } else {
        setError(data.message || 'Failed to delete testimonial');
        toast.error(data.message || 'Failed to delete testimonial');
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      setError('Failed to delete testimonial');
      toast.error('Failed to delete testimonial');
    }
  };

  const handleExport = async () => {
    try {
      window.location.href = '/api/testimonials/export';
    } catch (err) {
      toast.error('Failed to export testimonials');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const counters = {
    total: items.length,
    pending: items.filter(t => t.status === 'pending').length,
    approved: items.filter(t => t.status === 'approved').length,
    rejected: items.filter(t => t.status === 'rejected').length,
  };

  return (
    <AdminShell title="Manage Testimonials">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-slate-900">{analytics.total}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{analytics.pending}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Pending</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{analytics.approved}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Approved</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-600">{analytics.rejected}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Rejected</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-amber-500 fill-current" />
              <div className="text-2xl font-bold text-amber-600">{analytics.averageRating}</div>
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Avg Rating</div>
          </Card>
        </div>
      )}

      {/* Search, Sort, and Export */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, company, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="w-40"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest_rating">Highest Rating</option>
          <option value="featured">Featured First</option>
        </Select>
        <Button variant="secondary" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-slate-500" />
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
          className="text-xs"
        >
          All ({counters.total})
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'secondary'}
          onClick={() => setFilter('pending')}
          className="text-xs"
        >
          Pending ({counters.pending})
        </Button>
        <Button
          variant={filter === 'approved' ? 'primary' : 'secondary'}
          onClick={() => setFilter('approved')}
          className="text-xs"
        >
          Approved ({counters.approved})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'primary' : 'secondary'}
          onClick={() => setFilter('rejected')}
          className="text-xs"
        >
          Rejected ({counters.rejected})
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No testimonials found</p>
          <p className="text-slate-400 text-sm mt-2">
            {searchQuery 
              ? 'No testimonials match your search'
              : filter === 'all' 
              ? 'Testimonials submitted by users will appear here for review'
              : `No ${filter} testimonials available`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card key={t._id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusBadge(t.status)}
                  {t.isFeatured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Star className="h-3 w-3 mr-1 fill-current" /> Featured
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm italic text-slate-700 line-clamp-3">"{t.feedback}"</p>
              <div className="mt-4 space-y-1">
                <div className="text-sm font-semibold">{t.name}</div>
                {t.designation && <div className="text-xs text-slate-600">{t.designation}</div>}
                {t.companyName && <div className="text-xs text-slate-500">{t.companyName}</div>}
                <div className="text-xs text-slate-500">{t.industryType}</div>
                {t.city && <div className="text-xs text-slate-400">{t.city}</div>}
                <div className="text-xs text-slate-400">{formatDate(t.createdAt)}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {t.status === 'approved' && (
                  <Button
                    variant="secondary"
                    onClick={() => toggleFeatured(t._id!, t.isFeatured || false)}
                    disabled={updating === t._id}
                    className="text-xs"
                  >
                    {updating === t._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <><Star className="h-3.5 w-3.5" /> {t.isFeatured ? 'Unfeature' : 'Feature'}</>
                    )}
                  </Button>
                )}
                {t.status === 'pending' && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => updateStatus(t._id!, 'approved')}
                      disabled={updating === t._id}
                      className="text-xs flex-1"
                    >
                      {updating === t._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <><Check className="h-3.5 w-3.5" /> Approve</>
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => updateStatus(t._id!, 'rejected')}
                      disabled={updating === t._id}
                      className="text-xs flex-1"
                    >
                      {updating === t._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <><X className="h-3.5 w-3.5" /> Reject</>
                      )}
                    </Button>
                  </>
                )}
                {t.status === 'approved' && (
                  <Button
                    variant="danger"
                    onClick={() => updateStatus(t._id!, 'rejected')}
                    disabled={updating === t._id}
                    className="text-xs flex-1"
                  >
                    {updating === t._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <><X className="h-3.5 w-3.5" /> Reject</>
                    )}
                  </Button>
                )}
                {t.status === 'rejected' && (
                  <Button
                    variant="secondary"
                    onClick={() => updateStatus(t._id!, 'approved')}
                    disabled={updating === t._id}
                    className="text-xs flex-1"
                  >
                    {updating === t._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <><Check className="h-3.5 w-3.5" /> Approve</>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setDel(t._id!)}
                  className="text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => handleDelete(del!)}
        message="Delete this testimonial? This action cannot be undone."
      />
    </AdminShell>
  );
}
