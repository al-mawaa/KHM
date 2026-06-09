import { useState, useEffect } from "react";

export type WebsiteSettings = {
  companyName: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  heroTitle: string;
  heroSubtitle: string;
  footerNote: string;
  seoTitle: string;
  seoDescription: string;
};

const defaultSettings: WebsiteSettings = {
  companyName: "KHM Infra Innovations Private Limited",
  tagline: "Sustainable waste water engineering",
  address: "Office No. St-1B, Stilt Floor, Axis Business Centre, Near Marigold Banquets, Bhugaon – 412115, Maharashtra, India",
  email: "khminfrainnovations@gmail.com",
  phone: "+91 9028716090, 9511785597",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  heroTitle: "Engineering Water for a Sustainable Tomorrow",
  heroSubtitle: "Turnkey waste water management for buildings, industry & smart cities.",
  footerNote: "Engineered with care for a sustainable tomorrow.",
  seoTitle: "KHM Infra Innovations | Waste Water Management",
  seoDescription: "Advanced sewage and effluent treatment, water recycling, and smart water infrastructure.",
};

// Simple in-memory cache
let cachedSettings: WebsiteSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds (reduced from 5 minutes for testing)

export function useWebsiteSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('[useWebsiteSettings] Fetching settings...');
        // Check cache first
        const now = Date.now();
        if (cachedSettings && (now - cacheTimestamp) < CACHE_DURATION) {
          console.log('[useWebsiteSettings] Using cached settings');
          setSettings(cachedSettings);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/settings");
        const data = await res.json();
        
        console.log('[useWebsiteSettings] API response:', data);
        
        if (data.success && data.data) {
          const settingsData = data.data;
          console.log('[useWebsiteSettings] Settings loaded successfully:', settingsData);
          setSettings(settingsData);
          cachedSettings = settingsData;
          cacheTimestamp = now;
        } else {
          throw new Error(data.message || "Failed to fetch settings");
        }
      } catch (err) {
        console.error("[useWebsiteSettings] Failed to fetch settings:", err);
        setError(err instanceof Error ? err.message : "Failed to load settings");
        // Use default settings on error
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
