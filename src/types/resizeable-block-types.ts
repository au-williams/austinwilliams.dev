import blockTypes from '../components/code-block/code-block.module.scss';

/**
 * The types of blocks that can be resized in the code art window. Adding values here will
 * cause the code art generation to try applying its resizing algorithm for the block type
 * and removing the value will bypass its resizing algorithm. This is because some blocks,
 * such as arrows or whitespace should not be resized.
 * @type {string[]}
 */
export default [blockTypes.tagName, blockTypes.attribute, blockTypes.string, blockTypes.value];
