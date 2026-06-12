import { useState, useEffect } from "react";
import Head from "next/head";
import { HomePage as HomePageContent } from "@/components/home/HomePage";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

export default function HomePage() {
  useVisitorTracking('Home');
  
  const [settings, setSettings] = useState({
    seoTitle: "KHM Infra Innovations | Waste Water Management",
    seoDescription: "Advanced sewage and effluent treatment, water recycling, and smart water infrastructure.",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings({
            seoTitle: data.data.seoTitle,
            seoDescription: data.data.seoDescription,
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <title>{settings.seoTitle}</title>
        <meta name="description" content={settings.seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <HomePageContent />
    </>
  );
}
