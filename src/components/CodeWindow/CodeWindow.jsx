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
import CodeLine from './CodeLine/CodeLine';
import styles from './CodeWindow.module.scss';
import blockTypes from './CodeBlock/CodeBlock.module.scss'

// --------- //
// constants //
// --------- //

// component render config
const COMPONENT_CONFIG = {
  CODE_ANIMATE_SPEED: 150,
  CODE_BLOCK_MAX_SIZE: 5,
  CODE_LINE_MAX_COUNT: 14,
  CODE_LINE_MAX_SIZE: 16,
  INDENT_MAX_CONSECUTIVE_COUNT: 4,
  INDENT_MAX_SIZE: 3,
  INDENT_MIN_SIZE: 1
};

// ----------- //
// data models //
// ----------- //

/* eslint max-classes-per-file: [error, 2] */
// allow 2 data model classes for code
// readability and property validation

class CodeBlockModel {
  constructor(blockType, maximumSize = 1) {
    this.blockType = blockType;
    this.isVisible = false;
    this.currentSize = 1;
    this.maximumSize = maximumSize;
    this.key = uuid();
  }

  get isActive() {
    return !this.isVisible || this.currentSize < this.maximumSize;
  }
}

class CodeLineModel {
  constructor(...codeBlocks) {
    this.codeBlocks = codeBlocks;
    this.isClicked = false;
    this.key = uuid();
  }

  get isActive() {
    return this.codeBlocks.some((codeBlock) => codeBlock.isActive);
  }
}

// ----------------- //
// utility functions //
// ----------------- //

const findIndentCodeBlock = ({ blockType }) => blockType === blockTypes.indent;

const findTagNameCodeBlock = ({ blockType }) => blockType === blockTypes.tagName;

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getCodeLineHasSingleSize = ({ codeBlocks }) =>
  codeBlocks.some(({ maximumSize, blockType }) =>
    maximumSize === 1 &&
    [
      blockTypes.tagName,
      blockTypes.attribute,
      blockTypes.string,
      blockTypes.value
    ].includes(blockType)
  );

const getConsecutiveIndentCount = (codeLines) => {
  const lastIndentSize = codeLines[0]?.codeBlocks?.find(
    (codeBlock) => codeBlock.blockType === blockTypes.indent
  )?.maximumSize;
  let result = 0;

  for (const codeLine of codeLines) {
    const thisIndentSize = codeLine.codeBlocks[0]?.maximumSize;
    if (thisIndentSize === lastIndentSize) result += 1;
    else break;
  }

  return result;
};

const getNextIndentSize = (lastCodeLine, consecutiveIndentCount) => {
  const lastCodeBlockTypes = new Set(lastCodeLine.codeBlocks.map((x) => x.blockType));
  const lastIndentSize = lastCodeLine.codeBlocks.find(findIndentCodeBlock).maximumSize;

  const mustDecreaseIndentSize =
    consecutiveIndentCount >= COMPONENT_CONFIG.INDENT_MAX_CONSECUTIVE_COUNT &&
    lastIndentSize >= COMPONENT_CONFIG.INDENT_MAX_SIZE;

  const mustIncreaseIndentSize =
    consecutiveIndentCount >= COMPONENT_CONFIG.INDENT_MAX_CONSECUTIVE_COUNT &&
    lastIndentSize <= COMPONENT_CONFIG.INDENT_MIN_SIZE;

  const randomBoolean =
    !mustDecreaseIndentSize &&
    !mustIncreaseIndentSize &&
    consecutiveIndentCount >= getRandomNumber(1, COMPONENT_CONFIG.INDENT_MAX_CONSECUTIVE_COUNT);

  const canDecreaseIndentSize =
    randomBoolean &&
    lastIndentSize > COMPONENT_CONFIG.INDENT_MIN_SIZE;

  const canIncreaseIndentSize =
    randomBoolean &&
    lastIndentSize < COMPONENT_CONFIG.INDENT_MAX_SIZE &&
    !lastCodeBlockTypes.has(blockTypes.value) &&
    lastCodeBlockTypes.size > 4;

  if (mustIncreaseIndentSize || canIncreaseIndentSize) return lastIndentSize + 1;
  if (mustDecreaseIndentSize || canDecreaseIndentSize) return lastIndentSize - 1;
  return lastIndentSize;
};

const getFormattedNumber = (number) => (number < 1000 ? number : `${(number / 1000).toFixed(1)}k`);

const getRandomBool = (probability = 0.5) => Math.random() < probability;

// ------------ //
// react render //
// ------------ //

const CodeWindow = () => {
  const [codeLines, setCodeLines] = useState([]);
  const [codeSpeed, setCodeSpeed] = useState(COMPONENT_CONFIG.CODE_ANIMATE_SPEED);
  const updatedCodeLines = codeLines.slice(); // used to help keep state immutable

  const onCodeLineClick = (key, isClicked) => {
    updatedCodeLines.find((x) => x.key === key).isClicked = isClicked;
    setCodeLines(updatedCodeLines);
  };

  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const formattedCharCount = getFormattedNumber(charCount);
  const formattedLineCount = getFormattedNumber(lineCount);

  const [isCodePaused, setIsCodePaused] = useState(false);
  const onPauseClick = () => setIsCodePaused((x) => !x);
  const decreaseCodeSpeed = () => !isCodePaused && setCodeSpeed((x) => Math.min(x + 25, 1000));
  const increaseCodeSpeed = () => !isCodePaused && setCodeSpeed((x) => Math.max(x - 25, 0));

  const [isFooterPinned, setIsFooterPinned] = useState(false);
  const onPinClick = () => setIsFooterPinned((x) => !x);

  const [isMouseHovering, setIsMouseHovering] = useState(false);
  const onMouseLeave = () => setIsMouseHovering(false);
  const onMouseOver = () => setIsMouseHovering(true);

  const onResetClick = () => {
    updatedCodeLines
      .filter((x) => x.isClicked)
      .forEach((x) => { x.isClicked = false; });

    setIsCodePaused(false);
    setIsFooterPinned(false);
    setCodeLines(updatedCodeLines);
    setCodeSpeed(COMPONENT_CONFIG.CODE_ANIMATE_SPEED);
  };

  const isFooterVisible = isFooterPinned || isMouseHovering || isCodePaused;
  const footerClassNames = classNames(
    styles.footer,
    { [styles.visible]: isFooterVisible },
    { [styles.pause]: isFooterVisible && isCodePaused },
    { [styles.debug]: isFooterVisible && !isCodePaused && codeLines.some((x) => x.isClicked) }
  );

  // ---------------- //
  // component render //
  // ---------------- //

  useEffect(() => {
    const isActiveIndex = codeLines.map((x) => x.isActive).lastIndexOf(true);
    const activeCodeLine = isActiveIndex > -1 && updatedCodeLines[isActiveIndex];

    const animateCodeBlock = () => {
      const codeBlock = activeCodeLine.codeBlocks.find((x) => x.isActive);
      if (codeBlock.blockType !== blockTypes.indent) setCharCount((x) => x + 1);
      if (!codeBlock.isVisible) codeBlock.isVisible = true;
      else codeBlock.currentSize += 1;
    };

    const generateCodeLine = () => {
      const nextCodeLine = new CodeLineModel();

      switch (codeLines.length) {
        case 0: {
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(blockTypes.startAngle),
            new CodeBlockModel(blockTypes.tagName, 3),
            new CodeBlockModel(blockTypes.attribute),
            new CodeBlockModel(blockTypes.closeAngle)
          );
          break;
        }

        case 1: {
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(blockTypes.startAngle),
            new CodeBlockModel(blockTypes.tagName, 2),
            new CodeBlockModel(blockTypes.closeAngle)
          );
          break;
        }

        case 2: {
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(blockTypes.indent),
            new CodeBlockModel(blockTypes.startAngle),
            new CodeBlockModel(blockTypes.tagName, 2),
            new CodeBlockModel(blockTypes.closeAngle)
          );
          break;
        }

        default: {
          const lastCodeLine = updatedCodeLines[0];
          const lastIndentSize = lastCodeLine.codeBlocks.find(findIndentCodeBlock).maximumSize;
          const consecutiveIndentCount = getConsecutiveIndentCount(updatedCodeLines);

          const nextIndentSize = getNextIndentSize(lastCodeLine, consecutiveIndentCount);
          const indentCodeBlock = new CodeBlockModel(blockTypes.indent, nextIndentSize);
          indentCodeBlock.currentSize = indentCodeBlock.maximumSize;
          nextCodeLine.codeBlocks.push(indentCodeBlock);

          if (nextIndentSize < lastIndentSize) {
            // -------------------------------------------------------- //
            // indent was decreased, generate a closing tag from parent //
            // -------------------------------------------------------- //

            const openingTagNameSize = codeLines
              // find the previous opening tag to generate the closing tag, or random if dropped
              .find((x) => x.codeBlocks.find(findIndentCodeBlock).maximumSize === nextIndentSize)
              ?.codeBlocks.find(findTagNameCodeBlock)?.maximumSize || getRandomNumber(2, 3);

            nextCodeLine.codeBlocks.push(
              new CodeBlockModel(blockTypes.startAngle),
              new CodeBlockModel(blockTypes.tagName, openingTagNameSize),
              new CodeBlockModel(blockTypes.closeAngle)
            );
          }

          else {
            // -------------------------------------------------------- //
            // indent stayed the same or was increased, generate random //
            // -------------------------------------------------------- //

            const isLastConsecutiveIndent =
              consecutiveIndentCount === COMPONENT_CONFIG.INDENT_MAX_CONSECUTIVE_COUNT - 1;

            const useAttributeBlock = getRandomBool(0.8);
            const useAttributeBlockWithString = useAttributeBlock && getRandomBool(0.675);
            const useValueBlock = !isLastConsecutiveIndent && getRandomBool(useAttributeBlockWithString ? 0.25 : 0.5);

            // get the remaining code line space available to generate blocks on
            // [2] = reserved space for the pair of start and close angle blocks
            let remainingCodeLineSize = COMPONENT_CONFIG.CODE_LINE_MAX_SIZE - indentCodeBlock.maximumSize - 2;
            if (useAttributeBlockWithString) remainingCodeLineSize -= 1; // used by operator block
            if (useValueBlock) remainingCodeLineSize -= 2; // used by second start and close pairs

            // get the remaining number of block size calculations to execute
            // [1] = reserved space for tag name (used twice for value blocks)
            let remainingCalculations =
              1 + useAttributeBlock + useAttributeBlockWithString + useValueBlock * 2;

            // get the next available size a generated block can use on the code line
            // calculations must be ran to ensure all blocks meet configured maximums
            const getAvailableSize = (codeBlockMaxSize = COMPONENT_CONFIG.CODE_BLOCK_MAX_SIZE) => {
              const averageSize = Math.floor(remainingCodeLineSize / remainingCalculations);
              const maximumSize = Math.min(averageSize, codeBlockMaxSize);

              // lower the number of single-sizes because it gets excessive
              // single, single, single ... all this line space was wasted!
              let minimumSize = Math.min(averageSize, 1 + getRandomBool());

              const nextCodeBlockTypes = new Set(nextCodeLine.codeBlocks.map((x) => x.blockType));
              const nextCodeLineHasSingleSize = getCodeLineHasSingleSize(nextCodeLine);
              const nextCodeLineIsTagNameOnly = nextCodeBlockTypes.size <= 3 && remainingCalculations <= 1;

              // limit code lines to one single-size block because multiple makes it appear small and ugly
              if (minimumSize === 1 && nextCodeLineHasSingleSize) minimumSize = Math.min(2, averageSize);
              // reduce the likelihood of generating a code line with a single block of single size
              if (minimumSize === 1 && nextCodeLineIsTagNameOnly) minimumSize += getRandomBool(0.8);

              const result = getRandomNumber(minimumSize, maximumSize);
              remainingCodeLineSize -= result;
              remainingCalculations -= 1;
              return result;
            };

            const nextTagNameSize = getAvailableSize(3);

            if (useValueBlock) {
              // remove trailing tag name after value blocks
              // <[tag_name] [attribute]>[value]<[tag_name]>
              remainingCodeLineSize -= nextTagNameSize;
              remainingCalculations -= 1;
            }

            nextCodeLine.codeBlocks.push(
              new CodeBlockModel(blockTypes.startAngle),
              new CodeBlockModel(blockTypes.tagName, nextTagNameSize)
            );

            // insert conditional code blocks separately so getAvailableSize()
            // can observe the tag name to accurately generate available sizes

            nextCodeLine.codeBlocks.push(
              ...[
                useAttributeBlock && new CodeBlockModel(blockTypes.attribute, getAvailableSize()),
                useAttributeBlockWithString && new CodeBlockModel(styles.operator),
                useAttributeBlockWithString && new CodeBlockModel(blockTypes.string, getAvailableSize()),
                new CodeBlockModel(blockTypes.closeAngle),
                useValueBlock && new CodeBlockModel(blockTypes.value, getAvailableSize()),
                useValueBlock && new CodeBlockModel(blockTypes.startAngle),
                useValueBlock && new CodeBlockModel(blockTypes.tagName, nextTagNameSize),
                useValueBlock && new CodeBlockModel(blockTypes.closeAngle)
              ].filter((item) => typeof item !== 'boolean')
            );
          }

          break;
        }
      }

      if (updatedCodeLines.length >= COMPONENT_CONFIG.CODE_LINE_MAX_COUNT)
        updatedCodeLines.length = COMPONENT_CONFIG.CODE_LINE_MAX_COUNT - 1;

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
              isClicked={isClicked}
              isCurrentLine={index === 0}
              onClick={(isClicked) => onCodeLineClick(key, isClicked)}
            />
          ))}
        </div>
        <div className={styles.name}>
          <img src={PersonEmoji} alt="man technologist emoji" />
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
