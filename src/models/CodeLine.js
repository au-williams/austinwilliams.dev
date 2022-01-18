import BLOCK_TYPES from "../constants/BlockTypes";
import { animatorConfig } from "../_config";
import { v4 as uuid } from 'uuid';

export default class CodeLine {
  constructor(...codeBlocks) {
    this.codeBlocks = codeBlocks.filter(x => typeof x !== "boolean");
    this.key = uuid(); // required to not lose state when rerendering
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

  getCodeBlockSizes(...blockTypes) {
    return this.codeBlocks.filter(codeBlock => blockTypes.includes(codeBlock.blockType)).reduce((sum, codeBlock) => sum + codeBlock.maximumSize, 0);
  }

}
