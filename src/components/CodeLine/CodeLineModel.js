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

  get indentSize() {
    return this.codeBlocks.find(codeBlock => codeBlock.blockType === BLOCK_TYPES.INDENT)?.maximumSize ?? 0;
  }

  get isActive() {
    return this.codeBlocks.some(codeBlock => codeBlock.isActive);
  }

  get isNewLine() {
    return this.codeBlocks.reduce((sum, codeBlock) => sum + codeBlock.isVisible, 0) === 0;
  }

  addCodeBlocks(...codeBlocks) {
    this.codeBlocks.push(...codeBlocks);
  }

  addConditionalCodeBlocks(...codeBlocks) {
    this.codeBlocks.push(...codeBlocks.filter(codeBlock => codeBlock !== null && typeof codeBlock === 'object'));
  }

  getCodeBlockTypes() {
    return [...new Set(this.codeBlocks.map(codeBlock => codeBlock.blockType))]
  }

  findCodeBlock(blockType) {
    return this.codeBlocks.find(codeBlock => codeBlock.blockType === blockType);
  }

  hasCodeBlock(blockType) {
    return this.codeBlocks.some(codeBlock => codeBlock.blockType === blockType);
  }
}

export default CodeLineModel;
