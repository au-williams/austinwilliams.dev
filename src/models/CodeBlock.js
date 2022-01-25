import { CODE_BLOCK_RESTRICTED_SIZE } from '../_config.json';

export default class CodeBlock {
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

  decreaseSize = () => {
    if (this.currentSize >= --this.maximumSize) this.currentSize = this.maximumSize;
  }

  increaseSize = () => {
    if (this.currentSize >= this.maximumSize++) this.currentSize = this.maximumSize;
  }

  updateSize = () => {
    if (!this.isVisible)
      this.isVisible = true;
    else if (this.maximumSize < ++this.currentSize)
      console.error("CodeBlock CurrentSize property is out of range");
  }
}
