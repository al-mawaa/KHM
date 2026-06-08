/**
 * Analytics Hooks Architecture
 * 
 * This file provides hooks and utilities for tracking user interactions
 * in the blog module. Currently set up as a placeholder architecture
 * that can be connected to any analytics provider (Google Analytics, Mixpanel, etc.)
 */

// Analytics event types
export type AnalyticsEvent =
  | 'blog_viewed'
  | 'blog_search'
  | 'blog_share'
  | 'blog_related_click'
  | 'blog_pagination'
  | 'blog_category_filter';

interface AnalyticsEventData {
  event: AnalyticsEvent;
  blogId?: string;
  blogSlug?: string;
  blogTitle?: string;
  blogCategory?: string;
  searchQuery?: string;
  sharePlatform?: string;
  relatedBlogId?: string;
  relatedBlogSlug?: string;
  pageNumber?: number;
  category?: string;
  timestamp: number;
}

/**
 * Track analytics event
 * This is a placeholder function that can be connected to any analytics provider
 */
export function trackAnalytics(eventData: Omit<AnalyticsEventData, 'timestamp'>): void {
  const data: AnalyticsEventData = {
    ...eventData,
    timestamp: Date.now(),
  };

  // Log to console for development (replace with actual analytics integration)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', data);
  }

  // TODO: Integrate with analytics provider
  // Example: gtag('event', eventData.event, { ...data });
  // Example: mixpanel.track(eventData.event, data);
}

/**
 * Hook for tracking blog views
 */
export function trackBlogView(blogId: string, blogSlug: string, blogTitle: string, blogCategory?: string): void {
  trackAnalytics({
    event: 'blog_viewed',
    blogId,
    blogSlug,
    blogTitle,
    blogCategory,
  });
}

/**
 * Hook for tracking blog searches
 */
export function trackBlogSearch(searchQuery: string): void {
  trackAnalytics({
    event: 'blog_search',
    searchQuery,
  });
}

/**
 * Hook for tracking blog shares
 */
export function trackBlogShare(blogId: string, blogSlug: string, sharePlatform: string): void {
  trackAnalytics({
    event: 'blog_share',
    blogId,
    blogSlug,
    sharePlatform,
  });
}

/**
 * Hook for tracking related blog clicks
 */
export function trackRelatedBlogClick(blogId: string, blogSlug: string, relatedBlogId: string, relatedBlogSlug: string): void {
  trackAnalytics({
    event: 'blog_related_click',
    blogId,
    blogSlug,
    relatedBlogId,
    relatedBlogSlug,
  });
}

/**
 * Hook for tracking pagination
 */
export function trackPagination(pageNumber: number): void {
  trackAnalytics({
    event: 'blog_pagination',
    pageNumber,
  });
}

/**
 * Hook for tracking category filters
 */
export function trackCategoryFilter(category: string): void {
  trackAnalytics({
    event: 'blog_category_filter',
    category,
  });
}
