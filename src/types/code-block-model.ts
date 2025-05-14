import { nanoid } from 'nanoid';
import resizeableBlockTypes from './resizeable-block-types';

/**
 * This model is used to calculate the code blocks stored in the CodeLineModel.
 * The CodeBlockModel is NOT the 'code-block' component and is meant to be used
 * in conjunction for processing its generated properties.
 * @export
 * @class CodeBlockModel
 * @typedef {CodeBlockModel}
 */
export default class CodeBlockModel {
  public blockType: string;
  public currentSize: number;
  public maximumSize: number;
  public isSizeable: boolean;
  public isVisible: boolean;
  public key: string;

  constructor({ blockType, blockSize = 1 }: { blockType: string; blockSize?: number }) {
    this.blockType = blockType;
    this.currentSize = 1;
    this.maximumSize = blockSize;
    this.isSizeable = resizeableBlockTypes.includes(blockType);
    this.isVisible = false;
    this.key = nanoid();
  }

  /**
   * Check if this CodeBlockModel is the next to update its size or visibility.
   * If no CodeBlockModels are active then the parent CodeLineModel will not be
   * active and a new CodeLineModel will be created.
   * @readonly
   * @type {boolean}
   */
  get isActive(): boolean {
    return !this.isVisible || this.currentSize < this.maximumSize;
  }
}
