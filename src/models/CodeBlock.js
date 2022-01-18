import BLOCK_TYPES from "../constants/BlockTypes";

export default class CodeBlock {
  constructor(blockType, maximumSize = 1) {
    this.blockType = blockType;
    this.isVisible = false;
    // create indent block types with maximum size to prevent incrementing
    this.currentSize = blockType === BLOCK_TYPES.INDENT ? maximumSize : 1;
    this.maximumSize = maximumSize;
  }

  get isActive() {
    return !this.isVisible || this.currentSize < this.maximumSize;
  }

  update() {
    if (!this.isVisible) this.isVisible = true;
    else this.currentSize++;
  }
}
