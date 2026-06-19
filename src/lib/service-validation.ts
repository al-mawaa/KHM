import Service from '@/lib/models/Service';

export function generateSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function resolveUniqueSlug(title: string, slug?: string, excludeId?: string) {
  const base = generateSlug(slug?.trim() || title.trim()) || `service-${Date.now()}`;
  let candidate = base;
  let counter = 1;

  while (true) {
    const query: Record<string, unknown> = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await Service.findOne(query);
    if (!existing) return candidate;

    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

export function validateServicePayload(body: Record<string, unknown>) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const image = typeof body.image === 'string' ? body.image.trim() : '';
  const points = Array.isArray(body.points)
    ? body.points.map((p) => String(p).trim()).filter(Boolean)
    : [];

  if (!title) {
    return { ok: false as const, message: 'Title is required' };
  }
  if (!image) {
    return { ok: false as const, message: 'Service image is required' };
  }
  if (points.length === 0) {
    return { ok: false as const, message: 'At least one point is required' };
  }

  return {
    ok: true as const,
    data: {
      title,
      image,
      points,
      slug: typeof body.slug === 'string' ? body.slug.trim() : '',
      description: typeof body.description === 'string' ? body.description.trim() : '',
      category: typeof body.category === 'string' ? body.category.trim() : '',
      icon: typeof body.icon === 'string' && body.icon.trim() ? body.icon.trim() : 'Droplets',
      imagePublicId: typeof body.imagePublicId === 'string' ? body.imagePublicId.trim() : '',
    },
  };
}
