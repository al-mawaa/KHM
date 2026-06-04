import { useState, useEffect } from 'react';
import { IService } from '@/lib/models/Service';
import { Button, Field, Input, Textarea } from '@/components/admin/ui';

interface ServiceFormProps {
  service?: IService;
  onSubmit: (data: Partial<IService>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ServiceForm({ service, onSubmit, onCancel, isLoading }: ServiceFormProps) {
  const [formData, setFormData] = useState<Partial<IService>>({
    title: '',
    slug: '',
    description: '',
    icon: 'Droplets',
    category: '',
    points: [],
    image: '',
  });

  const [pointsText, setPointsText] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        slug: service.slug,
        description: service.description,
        icon: service.icon,
        category: service.category,
        points: service.points,
        image: service.image || '',
      });
      setPointsText(service.points?.join('\n') || '');
    }
  }, [service]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value, slug: generateSlug(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pointsArray = pointsText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    
    onSubmit({ ...formData, points: pointsArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Title">
        <Input
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          placeholder="Service title"
        />
      </Field>
      
      <Field label="Slug">
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          placeholder="service-slug"
        />
      </Field>
      
      <Field label="Category">
        <Input
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          placeholder="e.g., Water Supply, Civil Infrastructure"
        />
      </Field>
      
      <Field label="Icon (lucide-react icon name)">
        <Input
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="Droplets"
        />
      </Field>
      
      <Field label="Description">
        <Textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          placeholder="Service description"
        />
      </Field>
      
      <Field label="Points (one per line)">
        <Textarea
          rows={6}
          value={pointsText}
          onChange={(e) => setPointsText(e.target.value)}
          placeholder="Point 1&#10;Point 2&#10;Point 3"
        />
      </Field>
      
      <Field label="Image URL (optional)">
        <Input
          value={formData.image || ''}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
        />
      </Field>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
