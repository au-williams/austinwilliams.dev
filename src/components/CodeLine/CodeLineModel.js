import BLOCK_TYPES from "../../constants/BlockTypes";
import { v4 as uuid } from 'uuid';

class CodeLineModel {
  constructor(...codeBlocks) {
    this.codeBlocks = codeBlocks;
    this.isClicked = false;
    this.key = uuid();
  }

  get activeCodeBlock() {
    return this.codeBlocks.find(codeBlock => codeBlock.isActive);
  }

  get codeBlockTypes() {
    return [...new Set(this.codeBlocks.map(codeBlock => codeBlock.blockType))]
  }

  get indentSize() {
    return this.codeBlocks.find(codeBlock => codeBlock.blockType === BLOCK_TYPES.INDENT)?.maximumSize ?? 0;
  }

  get isActive() {
    return this.codeBlocks.some(codeBlock => codeBlock.isActive);
  }

  get isNewLine() {
    return this.codeBlocks.reduce((sum, codeBlock) => sum + codeBlock.isVisible, 0) === 0;
  }
}

export default CodeLineModel;
