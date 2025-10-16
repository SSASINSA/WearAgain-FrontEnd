import {typography} from './typography';

export {typography} from './typography';

export const theme = {
  typography,
} as const;

export type Theme = typeof theme;
