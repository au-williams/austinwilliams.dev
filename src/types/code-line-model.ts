import { v4 as uuid } from 'uuid';
import CodeBlockModel from './code-block-model';

/**
 * This model is used to calculate the code lines displayed in the code-window
 * component. CodeLineModel is NOT the 'code-line' component and is meant to be
 * used in conjunction for processing its generated properties.
 * @export
 * @class CodeLineModel
 * @typedef {CodeLineModel}
 */
export default class CodeLineModel {
  public codeBlocks: CodeBlockModel[];
  public isClicked: boolean;
  public key: string;

  constructor() {
    this.codeBlocks = [];
    this.isClicked = false;
    this.key = uuid();
  }

  /**
   * Get if the CodeLineModel has active CodeBlockModels making it the current
   * CodeLineModel updated in the state. When no CodeLineModel is active a new
   * CodeLineModel is made in 'code-window.tsx' with isActive evaluated true.
   * @readonly
   * @type {boolean}
   */
  get isActive(): boolean {
    return this.codeBlocks.some((x) => x.isActive);
  }

  /**
   * Find the displayed size of the first CodeBlockModel of the input type.
   * @param {number} blockSize The size of the code block
   * @returns {number}
   */
  findCodeBlockSize = (blockType: string): number =>
    this.codeBlocks.find((x: CodeBlockModel) => x.blockType === blockType)?.maximumSize ?? 0;

  /**
   * Check if the CodeLineModel has a sizeable CodeBlockModel of an input size.
   * For example - this can be used to check if a previous CodeLineModel had an
   * unusual sized CodeBlockModel so it can force a usual sized CodeBlockModel
   * to be made next and enforce an expected + pleasant looking collection.
   * @param {number} blockSize The size of the code block
   * @returns {boolean}
   */
  hasCodeBlockSize = (blockSize: number): boolean =>
    this.codeBlocks.some((x: CodeBlockModel) => x.maximumSize === blockSize && x.isSizeable);
}
