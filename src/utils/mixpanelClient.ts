import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (!MIXPANEL_TOKEN) return;
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: false,
    track_pageview: true,
    persistence: "localStorage",  
   });
}

export function trackEvent (event: string, properties: object = {}) {
  try {
    mixpanel.track(event, properties);
  } catch (error) {
    console.warn(`Error tracking event ${event}:`, error);
  }
  return true // To allow chaining trackEvent('...') && ...
}