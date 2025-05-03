import { v4 as uuid } from 'uuid';
import resizeableBlockTypes from './resizeable-block-types';

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
    this.key = uuid();
  }

  get isActive(): boolean {
    return !this.isVisible || this.currentSize < this.maximumSize;
  }
}
