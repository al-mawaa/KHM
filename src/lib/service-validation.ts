import Service from '@/lib/models/Service';

export type ServicePayload = {
  title: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  points: string[];
  image?: string;
  imagePublicId?: string;
};

type ValidationResult =
  | { ok: true; data: ServicePayload }
  | { ok: false; message: string };

export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function validateServicePayload(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, message: 'Invalid request body' };
  }

  const data = body as Record<string, unknown>;
  const title = typeof data.title === 'string' ? data.title.trim() : '';

  if (!title) {
    return { ok: false, message: 'Title is required' };
  }

  const slugInput = typeof data.slug === 'string' ? data.slug.trim() : '';
  const slug = slugInput || generateSlugFromTitle(title);

  if (!slug) {
    return { ok: false, message: 'Slug is required' };
  }

  const description = typeof data.description === 'string' ? data.description.trim() : '';
  const category = typeof data.category === 'string' ? data.category.trim() : '';
  const icon = typeof data.icon === 'string' && data.icon.trim() ? data.icon.trim() : 'Droplets';
  const image = typeof data.image === 'string' ? data.image.trim() : undefined;
  const imagePublicId = typeof data.imagePublicId === 'string' ? data.imagePublicId.trim() : undefined;

  let points: string[] = [];
  if (Array.isArray(data.points)) {
    points = data.points.map((p) => String(p).trim()).filter(Boolean);
  } else if (typeof data.points === 'string') {
    points = data.points
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
  }

  return {
    ok: true,
    data: {
      title,
      slug,
      description,
      category,
      icon,
      points,
      image,
      imagePublicId,
    },
  };
}

export async function resolveUniqueSlug(
  title: string,
  slug?: string,
  excludeId?: string
): Promise<string> {
  const base = (slug?.trim() || generateSlugFromTitle(title)).toLowerCase();
  let candidate = base;
  let counter = 1;

  while (true) {
    const query: Record<string, unknown> = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Service.findOne(query);
    if (!existing) {
      return candidate;
    }

    candidate = `${base}-${counter}`;
    counter += 1;
  }
}
