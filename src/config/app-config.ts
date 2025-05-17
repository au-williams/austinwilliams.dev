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
export const ContactEmailAddress: string = "me@austinwilliams.dev";

/**
 * Config for the favicon URLs displayed as tooltips.
 * @type {object}
 */
export const FavIcons: {
  GMAIL: string;
  GOOGLE_DRIVE: string;
  LINKEDIN: string;
} = {
  GMAIL: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  GOOGLE_DRIVE: 'https://drive.google.com/favicon.ico',
  LINKEDIN: 'https://www.linkedin.com/favicon.ico',
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

/**
 * Config values for the React Router. Key is the route name. Value is the route destination.
 * @type {object}
 */
export const RedirectRoutes: {
  "/linkedin": string;
  "/resume": string;
} = {
  "/linkedin": "https://www.linkedin.com/in/auwilliams",
  "/resume": "https://drive.google.com/file/d/1mKUPaKy712dURDLOFG7bvaAWEomKIHwC/view"
}
