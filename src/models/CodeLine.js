import BLOCK_TYPES from "../constants/BlockTypes";
import { v4 as uuid } from 'uuid';

export default class CodeLine {
  constructor(...codeBlocks) {
    this.codeBlocks = codeBlocks;
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

  get maximumSize() {
    return this.codeBlocks.reduce((sum, codeBlock) => sum + codeBlock.maximumSize, 0);
  }

  addCodeBlocks(...codeBlocks) {
    this.codeBlocks.push(...codeBlocks);
  }

  addConditionalCodeBlocks(...codeBlocks) {
    this.codeBlocks.push(...codeBlocks.filter(codeBlock => codeBlock !== null && typeof codeBlock === 'object'));
  }
  
  getCodeBlockSizes(...blockTypes) {
    return this.codeBlocks.filter(codeBlock => blockTypes.includes(codeBlock.blockType)).reduce((sum, codeBlock) => sum + codeBlock.maximumSize, 0);
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
