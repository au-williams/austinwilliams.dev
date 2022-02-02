class CodeBlockModel {
  constructor(blockType, maximumSize = 1) {
    this.blockType = blockType;
    this.isVisible = false;
    this.currentSize = 1;
    this.maximumSize = maximumSize;
  }

  get isActive() {
    return !this.isVisible || this.currentSize < this.maximumSize;
  }
}

export default CodeBlockModel;
