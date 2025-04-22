/**
 * Config values used when generating the code art.
 * @type {object}
 */
export const CodeGenerationConfig: {
  CODE_BLOCK_MAX_SIZE: number;
  CODE_GENERATION_SPEED: number;
  CODE_LINE_MAX_COUNT: number;
  CODE_LINE_MAX_SIZE: number;
  CODE_SCOPE_MAX_COUNT: number;
  INDENT_MAX_SIZE: number;
} = {
  CODE_BLOCK_MAX_SIZE: 7, // How big the code block can be in length / width.
  CODE_GENERATION_SPEED: 125, // How fast the code art is generating new code blocks.
  CODE_LINE_MAX_COUNT: 14, // How many code lines are saved before disappearing to avoid memory leaks.
  CODE_LINE_MAX_SIZE: 16, // How many code blocks can fit in a code line in code block length / width units.
  CODE_SCOPE_MAX_COUNT: 4, // How many children can be underneath a parent before forcing the scope to step out.
  INDENT_MAX_SIZE: 3, // How far the code blocks can be scoped / indented from the left to imitate scoping.
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
