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
import blockTypes from './CodeBlock/CodeBlock.module.scss';
import CodeLine from './CodeLine/CodeLine';
import styles from './CodeWindow.module.scss';

const CONFIG = {
  CODE_ANIMATE_SPEED: 125,
  CODE_BLOCK_MAX_SIZE: 7,
  CODE_LINE_MAX_COUNT: 14,
  CODE_LINE_MAX_SIZE: 16,
  INDENT_MAX_CONSECUTIVE_COUNT: 5,
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

class CodeBlockModel {
  public blockType: string;
  public currentSize: number;
  public maximumSize: number;
  public isVisible: boolean;
  public key: string;

  constructor(blockType: string, maximumSize = 1) {
    this.blockType = blockType;
    this.currentSize = 1;
    this.maximumSize = maximumSize;
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

  findCodeBlock = (blockType: string): CodeBlockModel | undefined =>
    this.codeBlocks.find((x) => x.blockType === blockType);
}

// ----------------- //
// utility functions //
// ----------------- //

const getRandomBit = (probability = 0.5): number => Number(getRandomBool(probability));

const getRandomBool = (probability = 0.5): boolean => Math.random() < probability;

const getFormattedNumber = (number: number): string =>
  number < 1000 ? `${number}` : `${(number / 1000).toFixed(1)}k`;

const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ---------------- //
// render functions //
// ---------------- //

const getConsecutiveIndentCount = (codeLines: CodeLineModel[]) => {
  const lastIndentSize: number = codeLines[0].findCodeBlock(blockTypes.indent)?.maximumSize ?? 0;
  let result = 0;

  for (const codeLine of codeLines) {
    const thisIndentSize: number = codeLine.codeBlocks[0].maximumSize;
    if (thisIndentSize === lastIndentSize) result += 1;
    else break;
  }

  return result;
};

const getNextIndentSize = (lastCodeLine: CodeLineModel, consecutiveIndentCount: number) => {
  const lastBlockTypes: Set<string> = new Set(lastCodeLine.codeBlocks.map((x) => x.blockType));
  const lastIndentSize: number = lastCodeLine.findCodeBlock(blockTypes.indent)?.maximumSize ?? 0;

  const isIndentSizeChange: boolean =
    consecutiveIndentCount >= CONFIG.INDENT_MAX_CONSECUTIVE_COUNT ||
    consecutiveIndentCount > getRandomNumber(1, CONFIG.INDENT_MAX_CONSECUTIVE_COUNT);

  if (!isIndentSizeChange) return lastIndentSize;

  const lastLineHasValue = lastBlockTypes.has(blockTypes.value);
  const isSizeIncrease: boolean = lastIndentSize < CONFIG.INDENT_MAX_SIZE && !lastLineHasValue;
  const isSizeDecrease: boolean = lastIndentSize > 1;

  if (isSizeIncrease) return lastIndentSize + 1;
  if (isSizeDecrease) return lastIndentSize - 1;
  return lastIndentSize;
};

// ------------ //
// react render //
// ------------ //

const CodeWindow = () => {
  const [codeLines, setCodeLines] = useState<CodeLineModel[]>([]);
  const [codeSpeed, setCodeSpeed] = useState<number>(CONFIG.CODE_ANIMATE_SPEED);
  const updatedCodeLines = codeLines.slice();

  const onCodeLineClick = (key: string, isClicked: boolean) => {
    updatedCodeLines.find((x) => x.key === key)!.isClicked = isClicked;
    setCodeLines(updatedCodeLines);
  };

  const [charCount, setCharCount] = useState<number>(0);
  const [lineCount, setLineCount] = useState<number>(0);
  const formattedCharCount = getFormattedNumber(charCount);
  const formattedLineCount = getFormattedNumber(lineCount);

  const [isCodePaused, setIsCodePaused] = useState<boolean>(false);
  const onPauseClick = () => setIsCodePaused((x) => !x);

  const decreaseCodeSpeed = () => !isCodePaused && setCodeSpeed((x) => Math.min(x + 25, 1000));
  const increaseCodeSpeed = () => !isCodePaused && setCodeSpeed((x) => Math.max(x - 25, 0));

  const [isFooterPinned, setIsFooterPinned] = useState<boolean>(false);
  const onPinClick = () => setIsFooterPinned((x) => !x);

  const [isMouseHovering, setIsMouseHovering] = useState<boolean>(false);
  const onMouseLeave = () => setIsMouseHovering(false);
  const onMouseOver = () => setIsMouseHovering(true);

  const onResetClick = () => {
    updatedCodeLines
      .filter((x) => x.isClicked)
      .forEach((x) => {
        x.isClicked = false;
      });

    setIsCodePaused(false);
    setIsFooterPinned(false);
    setCodeLines(updatedCodeLines);
    setCodeSpeed(CONFIG.CODE_ANIMATE_SPEED);
  };

  const isFooterVisible: boolean = isFooterPinned || isMouseHovering || isCodePaused;
  const footerClassNames: string = classNames(
    styles.footer,
    { [styles.visible]: isFooterVisible },
    { [styles.pause]: isFooterVisible && isCodePaused },
    { [styles.debug]: isFooterVisible && !isCodePaused && codeLines.some((x) => x.isClicked) }
  );

  const nameClassNames: string = classNames(styles.name, { [styles.visible]: !isFooterVisible });

  // ---------------- //
  // component render //
  // ---------------- //

  useEffect(() => {
    const index: number = codeLines.map((x) => x.isActive).lastIndexOf(true);
    const activeCodeLine: CodeLineModel = updatedCodeLines[index];

    const animateCodeBlock = () => {
      const codeBlock = activeCodeLine.codeBlocks.find((x) => x.isActive)!;
      if (codeBlock.blockType !== blockTypes.indent) setCharCount((x) => x + 1);
      if (codeBlock.isVisible) codeBlock.currentSize += 1;
      else codeBlock.isVisible = true;
    };

    const generateCodeLine = () => {
      const nextCodeLine = new CodeLineModel();

      switch (codeLines.length) {
        case 0:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(blockTypes.openAngle),
            new CodeBlockModel(blockTypes.tagName, 3),
            new CodeBlockModel(blockTypes.attribute),
            new CodeBlockModel(blockTypes.closeAngle)
          );
          break;

        case 1:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(blockTypes.openAngle),
            new CodeBlockModel(blockTypes.tagName, 2),
            new CodeBlockModel(blockTypes.closeAngle)
          );
          break;

        case 2:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(blockTypes.indent),
            new CodeBlockModel(blockTypes.openAngle),
            new CodeBlockModel(blockTypes.tagName, 2),
            new CodeBlockModel(blockTypes.closeAngle)
          );
          break;

        // prettier-ignore
        default: {
          const lastCodeLine: CodeLineModel = updatedCodeLines[0];
          const lastIndentSize: number = lastCodeLine.findCodeBlock(blockTypes.indent)?.maximumSize || 0;
          const consecutiveIndentCount: number = getConsecutiveIndentCount(updatedCodeLines);

          const nextIndentSize: number = getNextIndentSize(lastCodeLine, consecutiveIndentCount);
          const indentCodeBlock = new CodeBlockModel(blockTypes.indent, nextIndentSize);
          indentCodeBlock.currentSize = nextIndentSize; // set current to skip increment
          nextCodeLine.codeBlocks.push(indentCodeBlock);

          if (nextIndentSize < lastIndentSize) {
            // -------------------------------------------------------- //
            // indent was decreased, generate a closing tag from parent //
            // -------------------------------------------------------- //

            const openingTagNameSize: number = codeLines
              // find the previous opening tag to generate its closing tag, or random if dropped
              .find((x) => x.findCodeBlock(blockTypes.indent)?.maximumSize === nextIndentSize)
              ?.findCodeBlock(blockTypes.tagName)?.maximumSize || getRandomNumber(2, 3);

            nextCodeLine.codeBlocks.push(
              new CodeBlockModel(blockTypes.openAngle),
              new CodeBlockModel(blockTypes.tagName, openingTagNameSize),
              new CodeBlockModel(blockTypes.closeAngle)
            );
          }

          else {
            // -------------------------------------------------------- //
            // indent stayed the same or was increased, generate random //
            // -------------------------------------------------------- //

            const isLastConsecutiveIndent: boolean =
              consecutiveIndentCount === CONFIG.INDENT_MAX_CONSECUTIVE_COUNT - 1;

            const useAttributeBlock: boolean = getRandomBool(0.8);
            const useStringBlock: boolean = useAttributeBlock && getRandomBool(0.675);
            const useValueBlock: boolean = !isLastConsecutiveIndent && getRandomBool(useStringBlock ? 0.25 : 0.5);

            // get the remaining code line space available to generate blocks on
            // [2] = reserved space for the pair of start and close angle blocks
            let remainingCodeLineSize: number = CONFIG.CODE_LINE_MAX_SIZE - indentCodeBlock.maximumSize - 2;
            if (useStringBlock) remainingCodeLineSize -= 1; // [1] used by operator block before string
            if (useValueBlock) remainingCodeLineSize -= 2; // [2] used by second start and close angles

            // get the remaining number of block size calculations to execute
            // [1] = reserved space for tag name (used twice on value blocks)
            let remainingCalculations: number = 1 + Number(useAttributeBlock) + Number(useStringBlock) + Number(useValueBlock) * 2;

            // get the next size a generated code block can consume on the code line
            const getBlockSize = (codeBlockMaxSize = CONFIG.CODE_BLOCK_MAX_SIZE) => {
              const averageSize: number = Math.floor(remainingCodeLineSize / remainingCalculations);
              const maximumSize: number = Math.min(averageSize, codeBlockMaxSize);
              let minimumSize = Math.min(1 + getRandomBit(.25), averageSize);

              // lower the number of single-sizes because it gets excessive
              // single, single, single ... all this line space was wasted!

              if (minimumSize === 1) {
                const nextBlockTypes = new Set(nextCodeLine.codeBlocks.map((x: CodeBlockModel) => x.blockType));
                const sizableBlockTypes = [blockTypes.tagName, blockTypes.attribute, blockTypes.string, blockTypes.value];

                // reduce the chances of generating code lines that are a single block of single size
                const nextLineIsOnlyTagName = nextBlockTypes.size <= 3 && remainingCalculations <= 1;
                if (nextLineIsOnlyTagName) minimumSize += getRandomBit(0.8);

                // restrict code lines to one single-size code block because having too many looks bad
                const getSingleSize = (x: CodeBlockModel) => x.maximumSize < 2 && sizableBlockTypes.includes(x.blockType);
                const nextLineHasSingleSize = nextCodeLine.codeBlocks.some(getSingleSize);
                if (nextLineHasSingleSize) minimumSize = Math.min(2, averageSize);
              }

              const result = getRandomNumber(minimumSize, maximumSize);
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

            // push items individually so getBlockSize() can observe array contents
            nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.openAngle));
            nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.tagName, nextTagNameSize));
            useAttributeBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.attribute, getBlockSize()));
            useStringBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.operator));
            useStringBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.string, getBlockSize()));
            nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.closeAngle));
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.value, getBlockSize()));
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.openAngle));
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.tagName, nextTagNameSize));
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel(blockTypes.closeAngle));
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
        <div className={nameClassNames}>
          <img src={PersonEmoji} alt="person emoji" />
          <span>Austin Williams</span>
        </div>
      </div>
      <div className={footerClassNames}>
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
