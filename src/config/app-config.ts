/**
 * The values used when generating the code art.
 * @type {object}
 */
export const CodeGenerationConfig: {
  CODE_BLOCK_MAX_SIZE: number; // How big the code block can be in length / width.
  CODE_GENERATION_SPEED: number; // How fast the code art is generating new code blocks.
  CODE_LINE_MAX_COUNT: number; // How many code lines are saved before disappearing to avoid memory leaks.
  CODE_LINE_MAX_SIZE: number; // How many code blocks can fit in a code line in code block length / width units.
  CODE_SCOPE_MAX_COUNT: number; // How many children can be underneath a parent before forcing the scope to step out.
  INDENT_MAX_SIZE: number; // How far the code blocks can be scoped / indented from the left to imitate scoping.
} = {
  CODE_BLOCK_MAX_SIZE: 7,
  CODE_GENERATION_SPEED: 125,
  CODE_LINE_MAX_COUNT: 14,
  CODE_LINE_MAX_SIZE: 16,
  CODE_SCOPE_MAX_COUNT: 4,
  INDENT_MAX_SIZE: 3,
};

export const GoogleAnalyticsConfig: {
  GA_MEASUREMENT_ID: string;
} = {
  GA_MEASUREMENT_ID: 'G-JFBLY5T1C0',
};
