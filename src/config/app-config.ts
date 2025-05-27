import RouteConfig from '@/types/route-config';

/**
 * Config values used when generating the code art.
 * @type {object}
 */
export const CodeGenerationConfig: {
  CODE_BLOCK_MAX_SIZE: number;
  CODE_GENERATION_DEFAULT_SPEED: number;
  CODE_GENERATION_MAX_SPEED: number;
  CODE_GENERATION_MIN_SPEED: number;
  CODE_LINE_MAX_BLOCK_COUNT: number;
  CODE_LINE_MAX_INDENT_SIZE: number;
  CODE_LINE_MAX_SIBLING_COUNT: number;
  CODE_SCOPE_MAX_COUNT: number;
  CODE_WINDOW_SHAKE_MAX: number;
} = {
  CODE_BLOCK_MAX_SIZE: 7, // How big the code block can be in length / width.
  CODE_GENERATION_DEFAULT_SPEED: 125, // How fast the code art is generating new code blocks.
  CODE_GENERATION_MAX_SPEED: 25, // How fast the code generator can be toggled.
  CODE_GENERATION_MIN_SPEED: 250, // How slow the code generator can be toggled.
  CODE_LINE_MAX_BLOCK_COUNT: 16, // How many code blocks can fit in a code line in code block length / width units.
  CODE_LINE_MAX_INDENT_SIZE: 3, // How far the code blocks can be scoped / indented from the left to imitate scoping.
  CODE_LINE_MAX_SIBLING_COUNT: 14, // How many code lines are saved before disappearing to avoid memory leaks.
  CODE_SCOPE_MAX_COUNT: 4, // How many children can be underneath a parent before forcing the scope to step out.
  CODE_WINDOW_SHAKE_MAX: 2, // How many times the code window can shake concurrently in the same direction.
};

/**
 * The email address used for contacting me.
 * @type {string}
 */
export const ContactEmailAddress: string = 'me@austinwilliams.dev';

/**
 * Config for the favicon URLs displayed in popups and tooltips.
 * @type {object}
 */
export const FavIcons: {
  GITHUB: string;
  GMAIL: string;
  GOOGLE_DRIVE: string;
  LINKEDIN: string;
} = {
  GITHUB:
    'https://raw.githubusercontent.com/au-williams/austinwilliams.dev/refs/heads/master/src/assets/icons/github-icon.svg',
  GMAIL:
    'https://raw.githubusercontent.com/au-williams/austinwilliams.dev/refs/heads/master/src/assets/icons/gmail-icon.svg',
  GOOGLE_DRIVE:
    'https://raw.githubusercontent.com/au-williams/austinwilliams.dev/refs/heads/master/src/assets/icons/google-drive-icon.svg',
  LINKEDIN:
    'https://raw.githubusercontent.com/au-williams/austinwilliams.dev/refs/heads/master/src/assets/icons/linkedin-icon.svg',
};

/**
 * Config values used with Github.
 * @type {object}
 */
export const GithubConfig: {
  GITHUB_USER_URL: string;
} = {
  GITHUB_USER_URL: 'https://api.github.com/users/au-williams',
};

/**
 * Config values used with Google Analytics.
 * @type {object}
 */
export const GoogleAnalyticsConfig: {
  GA_MEASUREMENT_ID: string;
} = {
  GA_MEASUREMENT_ID: 'G-JFBLY5T1C0', // This key isn't sensitive and isn't required to be secreted per the GA docs.
};

export const RedirectPopupConfig: {
  COUNTDOWN_ENABLED: boolean;
  COUNTDOWN_SECONDS: number;
} = {
  COUNTDOWN_ENABLED: true, // Toggles the redirect countdown. Used for debugging.
  COUNTDOWN_SECONDS: 5, // How many seconds the countdown will start with.
};

/**
 * Routes handled by React Router + data for the redirect-popup component.
 */
export const RedirectPopupRoutes = [
  new RouteConfig({
    destination: 'https://www.linkedin.com/in/auwilliams',
    favicon: FavIcons.LINKEDIN,
    name: 'LinkedIn',
    path: '/linkedin',
    shareLink: 'https://austinwilliams.dev/linkedin',
  }),
  new RouteConfig({
    destination: 'https://github.com/au-williams/austinwilliams.dev',
    favicon: FavIcons.GITHUB,
    name: 'GitHub',
    path: '/github',
    shareLink: 'https://austinwilliams.dev/github',
  }),
  new RouteConfig({
    destination: 'https://drive.google.com/file/d/1mKUPaKy712dURDLOFG7bvaAWEomKIHwC/view',
    favicon: FavIcons.GOOGLE_DRIVE,
    name: 'Google Drive',
    path: '/resume',
    shareLink: 'https://austinwilliams.dev/resume',
  }),
];
