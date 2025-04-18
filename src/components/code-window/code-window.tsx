import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ReactComponent as EraserIcon } from '../../assets/icons/eraser_icon.svg';
import { ReactComponent as FastForwardIcon } from '../../assets/icons/fast_forward_icon.svg';
import { ReactComponent as PauseIcon } from '../../assets/icons/pause_icon.svg';
import { ReactComponent as PinOffIcon } from '../../assets/icons/pin_off_icon.svg';
import { ReactComponent as PinOnIcon } from '../../assets/icons/pin_on_icon.svg';
import { ReactComponent as PlayIcon } from '../../assets/icons/play_icon.svg';
import { ReactComponent as RewindIcon } from '../../assets/icons/rewind_icon.svg';
import { PersonEmoji } from '../../assets/images';
import blockTypes from '../code-block/code-block.module.scss';
import CodeLine from '../code-line/code-line';
import styles from './code-window.module.scss';

const CONFIG = {
  CODE_ANIMATION_SPEED: 125,
  CODE_BLOCK_MAX_SIZE: 7,
  CODE_LINE_MAX_COUNT: 14,
  CODE_LINE_MAX_SIZE: 16,
  CODE_SCOPE_MAX_COUNT: 4,
  INDENT_MAX_SIZE: 3
};

// ----------- //
// data models //
// ----------- //

/* eslint max-classes-per-file: [error, 2] */

/**
 * The CodeWindow component renders CodeLineModel objects, which
 * wrap CodeBlockModel objects. CodeBlocks are generated in bulk
 * and stored in the CodeLine, to be manipulated iteratively and
 * imitate typing. These models are used for accuracy and stored
 * in the CodeWindow state.
 */

const SIZABLE_BLOCK_TYPES = [
  blockTypes.tagName,
  blockTypes.attribute,
  blockTypes.string,
  blockTypes.value
]

class CodeBlockModel {
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
    this.isSizeable = SIZABLE_BLOCK_TYPES.includes(blockType);
    this.isVisible = false;
    this.key = uuid();
  }

  get isActive(): boolean {
    return !this.isVisible || this.currentSize < this.maximumSize;
  }
}

class CodeLineModel {
  public codeBlocks: CodeBlockModel[];
  public isClicked: boolean;
  public key: string;

  constructor() {
    this.codeBlocks = [];
    this.isClicked = false;
    this.key = uuid();
  }

  get isActive(): boolean {
    return this.codeBlocks.some((x) => x.isActive);
  }

  findCodeBlockSize = (blockType: string): number =>
    this.codeBlocks.find((x: CodeBlockModel) => x.blockType === blockType)?.maximumSize ?? 0;

  hasCodeBlockSize = (blockSize: number): boolean =>
    this.codeBlocks.some((x: CodeBlockModel) => x.maximumSize === blockSize && x.isSizeable);
}

// ----------------- //
// utility functions //
// ----------------- //

const getRandomBit = ({ probability = 0.5 }): number => +getRandomBool({ probability });

const getRandomBool = ({ probability = 0.5 }): boolean => Math.random() < probability;

const getFormattedNumber = (number: number): string => number < 1000 ? `${number}` : `${(number / 1000).toFixed(1)}k`;

const getRandomNumber = ({ min = 1, max = 1 }): number => Math.floor(Math.random() * (max - min + 1)) + min;

// ---------------- //
// render functions //
// ---------------- //

const getCodeScopeCount = (codeLines: CodeLineModel[]): number => {
  const indentSize: number = codeLines[0] && codeLines[0].findCodeBlockSize(blockTypes.indent);
  let result = 0;

  for (const codeLine of codeLines) {
    if (codeLine.findCodeBlockSize(blockTypes.indent) === indentSize) result += 1;
    else break;
  }

  return result;
};

const getNextIndentSize = (codeLines: CodeLineModel[], codeScopeCount: number): number => {
  const lastIndentSize: number = codeLines[0] && codeLines[0].findCodeBlockSize(blockTypes.indent);

  const shouldChangeIndent: boolean =
    codeScopeCount >= CONFIG.CODE_SCOPE_MAX_COUNT ||
    codeScopeCount >= getRandomNumber({ max: CONFIG.CODE_SCOPE_MAX_COUNT });
  if (!shouldChangeIndent) return lastIndentSize;

  // determine if scope closing tags were created on the last code line
  // (closing tags cannot be used to increase indent or spawn children)
  const wasValueBlockUsed: boolean = codeLines[0] && Boolean(codeLines[0].findCodeBlockSize(blockTypes.value));
  const wasScopeDecreased: boolean = codeLines[1] && codeLines[1].findCodeBlockSize(blockTypes.indent) > lastIndentSize;

  const canIncreaseIndent: boolean = lastIndentSize < CONFIG.INDENT_MAX_SIZE && !wasValueBlockUsed && !wasScopeDecreased;
  const canDecreaseIndent: boolean = lastIndentSize > 1;
  if (canIncreaseIndent) return lastIndentSize + 1;
  if (canDecreaseIndent) return lastIndentSize - 1;
  return lastIndentSize;
};

// ------------ //
// react render //
// ------------ //

const CodeWindow = () => {
  const [codeLines, setCodeLines] = useState<CodeLineModel[]>([]);
  const [codeSpeed, setCodeSpeed] = useState<number>(CONFIG.CODE_ANIMATION_SPEED);
  const updatedCodeLines = codeLines.slice();

  const onCodeLineClick = (key: string, isClicked: boolean) => {
    updatedCodeLines.find((x) => x.key === key)!.isClicked = isClicked;
    setCodeLines(updatedCodeLines);
  };

  const [charCount, setCharCount] = useState<number>(0);
  const [lineCount, setLineCount] = useState<number>(0);
  const formattedCharCount = getFormattedNumber(charCount);
  const formattedLineCount = getFormattedNumber(lineCount);

  const [isMouseHovering, setIsMouseHovering] = useState<boolean>(false);
  const onMouseLeave = () => setIsMouseHovering(false);
  const onMouseOver = () => setIsMouseHovering(true);

  const [isFooterPinned, setIsFooterPinned] = useState<boolean>(false);
  const onPinClick = () => setIsFooterPinned((x) => !x);

  const [isCodePaused, setIsCodePaused] = useState<boolean>(false);
  const onPauseClick = () => setIsCodePaused((x) => !x);

  const decreaseCodeSpeed = () => !isCodePaused && setCodeSpeed((x) => Math.min(x + 25, 1000));
  const increaseCodeSpeed = () => !isCodePaused && setCodeSpeed((x) => Math.max(x - 25, 0));

  const onResetClick = () => {
    updatedCodeLines
      .filter((x) => x.isClicked)
      .forEach((x) => { x.isClicked = false; });

    setIsCodePaused(false);
    setIsFooterPinned(false);
    setCodeLines(updatedCodeLines);
    setCodeSpeed(CONFIG.CODE_ANIMATION_SPEED);
  };

  const isFooterVisible: boolean = isFooterPinned || isMouseHovering || isCodePaused;

  const footerClasses: string = classNames(
    styles.footer,
    { [styles.visible]: isFooterVisible },
    { [styles.pause]: isFooterVisible && isCodePaused },
    { [styles.debug]: isFooterVisible && !isCodePaused && codeLines.some((x) => x.isClicked) }
  );

  const nameClasses: string = classNames(
    styles.name,
    { [styles.visible]: !isFooterVisible }
  );

  // ---------------- //
  // component render //
  // ---------------- //

  useEffect(() => {
    const activeCodeLineIndex: number = codeLines.map((x) => x.isActive).lastIndexOf(true);
    const activeCodeLine: CodeLineModel = updatedCodeLines[activeCodeLineIndex];

    const animateCodeBlock = () => {
      const codeBlock: CodeBlockModel = activeCodeLine.codeBlocks.find((x) => x.isActive)!;
      if (codeBlock.blockType !== blockTypes.indent) setCharCount((x) => x + 1);
      if (codeBlock.isVisible) codeBlock.currentSize += 1;
      else codeBlock.isVisible = true;
    };

    const generateCodeLine = () => {
      const nextCodeLine = new CodeLineModel();

      switch (codeLines.length) {
        case 0:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel({ blockType: blockTypes.openAngle }),
            new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: 3 }),
            new CodeBlockModel({ blockType: blockTypes.attribute }),
            new CodeBlockModel({ blockType: blockTypes.closeAngle })
          );
          break;

        case 1:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel({ blockType: blockTypes.openAngle }),
            new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: 2 }),
            new CodeBlockModel({ blockType: blockTypes.closeAngle })
          );
          break;

        case 2:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel({ blockType: blockTypes.indent }),
            new CodeBlockModel({ blockType: blockTypes.openAngle }),
            new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: 2 }),
            new CodeBlockModel({ blockType: blockTypes.closeAngle })
          );
          break;

        default: {
          const lastCodeLine: CodeLineModel = updatedCodeLines[0];
          const codeScopeCount: number = getCodeScopeCount(updatedCodeLines);
          const lastIndentSize: number = lastCodeLine.findCodeBlockSize(blockTypes.indent);
          const nextIndentSize: number = getNextIndentSize(updatedCodeLines, codeScopeCount);

          const indentCodeBlock = new CodeBlockModel({ blockType: blockTypes.indent, blockSize: nextIndentSize });
          indentCodeBlock.currentSize = nextIndentSize; // set the current size to bypass the increment animation
          nextCodeLine.codeBlocks.push(indentCodeBlock);

          if (nextIndentSize < lastIndentSize) {
            // -------------------------------------------------------- //
            // indent was decreased, generate a closing tag from parent //
            // -------------------------------------------------------- //
            const parentCodeLine: CodeLineModel | undefined =
              codeLines.find((x: CodeLineModel) => x.findCodeBlockSize(blockTypes.indent) === nextIndentSize);

            const parentBlockSize: number =
              parentCodeLine?.findCodeBlockSize(blockTypes.tagName) || getRandomNumber({ min: 2, max: 3 });

            nextCodeLine.codeBlocks.push(
              new CodeBlockModel({ blockType: blockTypes.openAngle }),
              new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: parentBlockSize }),
              new CodeBlockModel({ blockType: blockTypes.closeAngle })
            );
          }

          else {
            // -------------------------------------------------------- //
            // indent stayed the same or was increased, generate random //
            // -------------------------------------------------------- //
            const isScopeChangeImminent: boolean = codeScopeCount === CONFIG.CODE_SCOPE_MAX_COUNT - 1;

            const useAttributeBlock: boolean = getRandomBool({ probability: 0.8 });
            const useStringBlock: boolean = useAttributeBlock && getRandomBool({ probability: 0.675 });
            const useValueBlock: boolean = !isScopeChangeImminent && getRandomBool({ probability: useStringBlock ? 0.25 : 0.5 });

            // get the remaining code line space available to generate blocks on
            // [2] = reserved space for the pair of start and close angle blocks
            let remainingCodeLineSize: number = CONFIG.CODE_LINE_MAX_SIZE - indentCodeBlock.maximumSize - 2;
            if (useStringBlock) remainingCodeLineSize -= 1; // [1] used by operator block before string
            if (useValueBlock) remainingCodeLineSize -= 2; // [2] used by second start and close angles

            // get the remaining number of block size calculations to execute
            // [1] = reserved space for tag name (used twice on value blocks)
            let remainingCalculations: number = 1 + +useAttributeBlock + +useStringBlock + +useValueBlock * 2;

            // get the next size a generated code block can consume on the code line
            const getBlockSize = (codeBlockMaxSize = CONFIG.CODE_BLOCK_MAX_SIZE) => {
              const averageSize: number = Math.floor(remainingCodeLineSize / remainingCalculations);
              const maximumSize: number = Math.min(averageSize, codeBlockMaxSize);
              let minimumSize = Math.min(1 + getRandomBit({ probability: .25 }), averageSize);

              // lower the number of single-sizes because it gets excessive
              // single, single, single ... all this line space was wasted!

              if (minimumSize === 1) {
                const nextBlockTypes = new Set(nextCodeLine.codeBlocks.map((x: CodeBlockModel) => x.blockType));

                // reduce the likelihood of generating code lines that are a single block of single size
                // [<= 3] includes open and close angle block types that are implicitly added to the tag
                const nextLineIsOneTag: boolean = nextBlockTypes.size <= 3 && remainingCalculations <= 1;
                if (nextLineIsOneTag) minimumSize += getRandomBit({ probability: 0.8 });

                // restrict code lines to one single-size block because too many looks bad
                const nextLineHasSingleSize: boolean = nextCodeLine.hasCodeBlockSize(1);
                if (nextLineHasSingleSize) minimumSize = Math.min(2, averageSize);
              }

              const result: number = getRandomNumber({ min: minimumSize, max: maximumSize });
              remainingCodeLineSize -= result;
              remainingCalculations -= 1;
              return result;
            };

            const nextTagNameSize: number = getBlockSize(3);

            if (useValueBlock) {
              // remove trailing tag name after value blocks
              // <[tag_name] [attribute]>[value]<[tag_name]>
              remainingCodeLineSize -= nextTagNameSize;
              remainingCalculations -= 1;
            }

            // push items individually so getBlockSize() can observe array contents during insert
            nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.openAngle }));
            nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: nextTagNameSize }));
            useAttributeBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.attribute, blockSize: getBlockSize() }));
            useStringBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.operator }));
            useStringBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.string, blockSize: getBlockSize() }));
            nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.closeAngle }));
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.value, blockSize: getBlockSize() }));
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.openAngle }));
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: nextTagNameSize }));
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.closeAngle }));
          }

          break;
        }
      }

      updatedCodeLines.length = Math.min(codeLines.length, CONFIG.CODE_LINE_MAX_COUNT - 1);
      updatedCodeLines.unshift(nextCodeLine);
      setLineCount((number) => number + 1);
    };

    const interval = setInterval(() => {
      if (isCodePaused) return;
      if (activeCodeLine) animateCodeBlock();
      else generateCodeLine();
      setCodeLines(updatedCodeLines);
    }, codeSpeed);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [codeLines, isCodePaused]);

  return (
    <div
      className={styles.wrapper}
      onMouseOver={onMouseOver}
      onFocus={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.title}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <div className={styles.body}>
        <div className={styles.code}>
          {codeLines.map(({ codeBlocks, key, isClicked }, index) => (
            <CodeLine
              key={key}
              codeBlocks={codeBlocks.filter((x) => x.isVisible)}
              isActiveLine={!index}
              isClicked={isClicked}
              onClick={(isClicked) => onCodeLineClick(key, isClicked)}
            />
          ))}
        </div>
        <div className={nameClasses}>
          <img src={PersonEmoji} alt="person emoji" />
          <span>Austin Williams</span>
        </div>
      </div>
      <div className={footerClasses}>
        <button onClick={onPinClick} type="button">
          <div className={styles.tooltip}>Pin</div>
          {isFooterPinned ? <PinOffIcon /> : <PinOnIcon />}
        </button>
        <button onClick={decreaseCodeSpeed} type="button">
          <div className={styles.tooltip}>Slow down</div>
          <RewindIcon />
        </button>
        <button onClick={onPauseClick} type="button">
          <div className={styles.tooltip}>{isCodePaused ? 'Play' : 'Pause'}</div>
          {isCodePaused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button onClick={increaseCodeSpeed} type="button">
          <div className={styles.tooltip}>Speed up</div>
          <FastForwardIcon />
        </button>
        <span>{isCodePaused ? 'Paused' : `${codeSpeed}ms`}</span>
        <button onClick={onResetClick} type="button">
          <div className={styles.tooltip}>Reset</div>
          <EraserIcon />
        </button>
        <span>
          <span>Lines: {formattedLineCount}</span>
          <span>Chars: {formattedCharCount}</span>
        </span>
      </div>
    </div>
  );
};

export default CodeWindow;
