import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (!MIXPANEL_TOKEN) return;
  mixpanel.init(MIXPANEL_TOKEN, {
    // @ts-expect-error "autocapture was added in mixpanel-browser v2.59, @types/mixpanel-browser is still on 2.51"
    autocapture: {
      pageview: "full-url",
      click: false,
      input: false,
      scroll: false,
      submit: false,
      capture_text_content: false,
    },
    debug: true,
    track_pageview: true,
    persistence: "localStorage",  
   });
}

export function trackEvent (event: string, properties: object) {
    mixpanel.track(event, properties);
}