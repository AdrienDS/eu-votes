export const SCREEN_SIZES = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

export const GRID_COLUMNS = {
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3,
} as const;

export const CARD_HEIGHTS = {
  MOBILE: '160px',
  DESKTOP: '130px',
} as const;

export const GRID_ROW_HEIGHTS = {
  MOBILE: 170,
  DESKTOP: 150,
} as const;

export const MEP_CARD = {
  PICTURE_SIZE: '64px',
  FLAG_WIDTH: '24px',
  FLAG_HEIGHT: '16px',
  ICON_SIZE: '16px',
} as const;

export const VOTE_BAR = {
  HEIGHT: '24px',
  MIN_WIDTH: {
    MOBILE: '200px',
    DESKTOP: '150px',
  },
} as const; 