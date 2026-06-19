import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Modal, Confirm } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { IService } from "@/lib/models/Service";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [edit, setEdit] = useState<IService | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [del, setDel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching services...');
      const res = await fetch('/api/services');
      const data = await res.json();
      console.log('Fetched services:', data);
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (data: Partial<IService>) => {
    try {
      setSaving(true);
      console.log('Saving service:', data);
      const isEdit = edit && edit._id;
      const url = isEdit ? `/api/services/${edit._id}` : '/api/services';
      const method = isEdit ? 'PUT' : 'POST';
      
      console.log('API Request:', { url, method, data });
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      console.log('API Response:', result);
      
      if (result.success) {
        toast.success(isEdit ? 'Service updated successfully' : 'Service created successfully');
        setEdit(null);
        setIsAdding(false);
        fetchServices();
      } else {
        toast.error(result.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!del) return;
    
    try {
      const res = await fetch(`/api/services/${del}`, {
        method: 'DELETE',
      });
      
      const result = await res.json();
      
      if (result.success) {
        toast.success('Service deleted successfully');
        setDel(null);
        fetchServices();
      } else {
        toast.error(result.message || 'Failed to delete service');
      }
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleAddService = () => {
    setIsAdding(true);
    setEdit(null);
  };

  const handleEditService = (service: IService) => {
    setIsAdding(false);
    setEdit(service);
  };

  const handleCloseModal = () => {
    setIsAdding(false);
    setEdit(null);
  };

  return (
    <AdminShell title="Manage Services">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddService}><Plus className="h-4 w-4" /> Add Service</Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No services added yet</p>
          <p className="text-slate-400 text-sm mt-2">Click "Add Service" to create your first service</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s._id?.toString()} className="p-5">
              {s.image && <img src={s.image} alt={s.title || s.category || 'Service'} className="mb-3 h-32 w-full object-cover rounded-lg" />}
              <div className="text-[10px] uppercase tracking-wider font-bold text-aqua-foreground">{s.icon}</div>
              <h3 className="mt-1 font-display font-bold">{s.title || 'Untitled Service'}</h3>
              <p className="mt-1 text-sm text-slate-600 line-clamp-3">{s.description}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => handleEditService(s)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                <Button variant="danger" onClick={() => setDel(s._id?.toString() || null)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        open={isAdding || !!edit} 
        onClose={handleCloseModal} 
        title={isAdding ? "Add Service" : "Edit Service"}
      >
        <ServiceForm 
          service={edit || undefined} 
          onSubmit={handleSave} 
          onCancel={handleCloseModal}
          isLoading={saving}
        />
      </Modal>
      
      <Confirm 
        open={!!del} 
        onClose={() => setDel(null)} 
        onConfirm={handleDelete} 
        message="Delete this service?" 
      />
    </AdminShell>
  );
}
