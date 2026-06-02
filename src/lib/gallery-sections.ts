export type GallerySectionId = "infrastructure" | "products" | "festivals";

export const GALLERY_SECTIONS: {
  id: GallerySectionId;
  label: string;
}[] = [
  { id: "infrastructure", label: "Infrastructure" },
  { id: "products", label: "Products" },
  { id: "festivals", label: "Festivals" },
];

export function galleryHash(id: GallerySectionId) {
  return `/gallery#${id}`;
}

export function parseGalleryHash(hash: string): GallerySectionId | null {
  const id = hash.replace(/^#/, "") as GallerySectionId;
  return GALLERY_SECTIONS.some((s) => s.id === id) ? id : null;
}
