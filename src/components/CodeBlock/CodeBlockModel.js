import { CODE_BLOCK_RESTRICTED_SIZE } from '../../_config.json';

class CodeBlockModel {
  constructor(blockType, maximumSize = 1) {
    this.blockType = blockType;
    this.isVisible = false;
    // restrict the size of code blocks that start maximized, not increasing iteratively
    this.currentSize = CODE_BLOCK_RESTRICTED_SIZE.includes(blockType) ? maximumSize : 1;
    this.maximumSize = maximumSize;
  }

  get isActive() {
    return !this.isVisible || this.currentSize < this.maximumSize;
  }
}

export default CodeBlockModel;
