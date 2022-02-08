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

// --------- //
// constants //
// --------- //

// types of code blocks rendered on screen
// [key] = block type, [value] = css class
const BLOCK_TYPES = {
  ATTRIBUTE: 'attribute',
  CLOSE_ANGLE: 'close-angle',
  INDENT: 'indent',
  START_ANGLE: 'start-angle',
  OPERATOR: 'operator',
  STRING: 'string',
  TAG_NAME: 'tag-name',
  VALUE: 'value'
};

// component configuration
const COMPONENT_CONFIG = {
  CODE_BLOCK_ANIMATE_SPEED: 150,
  CODE_BLOCK_MAX_SIZE: 5,
  CODE_BLOCK_NO_RESIZE: ['close-angle', 'indent', 'start-angle', 'operator'],
  CODE_LINE_MAX_SCROLL: 14,
  CODE_LINE_MAX_SIZE: 16,
  INDENT_MAX_CONSECUTIVE_COUNT: 4,
  INDENT_MAX_SIZE: 3,
  INDENT_MIN_SIZE: 1
};

// ----------- //
// data models //
// ----------- //

/* eslint max-classes-per-file: [error, 2] */

// allow two data model classes to be
// defined in this component for code
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

// get the count of recent code lines with the same indent size
const getConsecutiveIndentCount = (codeLines) => {
  const lastIndentSize = codeLines[0]?.codeBlocks[0]?.maximumSize;
  let result = 0;

  for (const codeLine of codeLines) {
    const thisIndentSize = codeLine.codeBlocks[0]?.maximumSize;
    if (thisIndentSize === lastIndentSize) result += 1;
    else break;
  }

  return result;
};

const getFormattedNumber = (number) => (number < 1000 ? number : `${(number / 1000).toFixed(1)}k`);

const getRandomBool = (probability = 0.5) => Math.random() < probability;

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ------------ //
// react render //
// ------------ //

// prettier-ignore
const CodeWindow = () => {
  // ---------------------------------------- //
  // state for rendering code lines on screen //
  // ---------------------------------------- //
  const [codeLines, setCodeLines] = useState([]);
  const [codeSpeed, setCodeSpeed] = useState(COMPONENT_CONFIG.CODE_BLOCK_ANIMATE_SPEED);
  const updatedCodeLines = codeLines.slice();

  const onCodeLineClick = (codeLine, isClicked) => {
    codeLine.isClicked = isClicked;
    setCodeLines(updatedCodeLines);
  };

  // ------------------------------------ //
  // state for styling component elements //
  // ------------------------------------ //
  const [isMouseHovering, setIsMouseHovering] = useState(false);
  const onMouseLeave = () => setIsMouseHovering(false);
  const onMouseOver = () => setIsMouseHovering(true);

  // ---------------------------------- //
  // state for rendering footer buttons //
  // ---------------------------------- //
  const [isCodePaused, setIsCodePaused] = useState(false);
  const onPauseClick = () => setIsCodePaused((isPaused) => !isPaused);

  const decreaseCodeSpeed = (number) => !isCodePaused && setCodeSpeed((speed) => Math.min(speed + number, 1000));
  const increaseCodeSpeed = (number) => !isCodePaused && setCodeSpeed((speed) => Math.max(speed - number, 0));

  const [isFooterPinned, setIsFooterPinned] = useState(false);
  const onPinClick = () => setIsFooterPinned((isPinned) => !isPinned);

  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const formattedCharCount = getFormattedNumber(charCount);
  const formattedLineCount = getFormattedNumber(lineCount);

  const isFooterVisible = isFooterPinned || isMouseHovering || isCodePaused;
  const footerClassNames = classNames(
    styles.footer,
    { [styles.visible]: isFooterVisible },
    { [styles.pause]: isFooterVisible && isCodePaused },
    { [styles.debug]: isFooterVisible && !isCodePaused && codeLines.some((codeLine) => codeLine.isClicked) }
  );

  const onResetClick = () => {
    updatedCodeLines
      .filter((codeLine) => codeLine.isClicked)
      .forEach((codeLine) => {
        codeLine.isClicked = false;
      });

    setIsCodePaused(false);
    setIsFooterPinned(false);
    setCodeSpeed(COMPONENT_CONFIG.CODE_BLOCK_ANIMATE_SPEED);
  };

  // ---------------- //
  // component render //
  // ---------------- //

  useEffect(() => {
    // check for an active code line (no index means code line is complete)
    const index = updatedCodeLines.map((x) => x.isActive).lastIndexOf(true);
    const currentCodeLine = index > -1 && updatedCodeLines[index];

    const animateCodeBlock = () => {
      const currentCodeBlock = currentCodeLine.codeBlocks.find((x) => x.isActive);
      const canUpdateCharCount = currentCodeBlock.blockType !== BLOCK_TYPES.INDENT;
      const canUpdateLineCount = currentCodeLine.codeBlocks.reduce((sum, codeBlock) => sum + codeBlock.isVisible, 0) === 0;
      if (canUpdateCharCount) setCharCount((number) => number + 1);
      if (canUpdateLineCount) setLineCount((number) => number + 1);

      if (!currentCodeBlock.isVisible) currentCodeBlock.isVisible = true;
      else currentCodeBlock.currentSize += 1;
    };

    const generateCodeLine = () => {
      const nextCodeLine = new CodeLineModel();

      switch (updatedCodeLines.length) {
        case 0: {
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
            new CodeBlockModel(BLOCK_TYPES.TAG_NAME, 3),
            new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE),
            new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
          );
          break;
        }

        case 1: {
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
            new CodeBlockModel(BLOCK_TYPES.TAG_NAME, 2),
            new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
          );
          break;
        }

        case 2: {
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel(BLOCK_TYPES.INDENT),
            new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
            new CodeBlockModel(BLOCK_TYPES.TAG_NAME, 2),
            new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
          );
          break;
        }

        default: {
          // get details on the previous code line
          const lastCodeLine = updatedCodeLines[0];
          const lastCodeBlockTypes = new Set(lastCodeLine.codeBlocks.map((codeBlock) => codeBlock.blockType));
          const lastCodeLineHadValueBlock = lastCodeBlockTypes.has(BLOCK_TYPES.VALUE);
          const lastCodeLineWasClosingTag = lastCodeBlockTypes.size <= 4;
          const lastIndentSize = lastCodeLine.codeBlocks[0].maximumSize;

          let nextIndentSize = lastIndentSize;

          // get details on the next indent code block size
          const consecutiveIndentCount = getConsecutiveIndentCount(updatedCodeLines);
          const mustDecreaseIndentSize = consecutiveIndentCount >= COMPONENT_CONFIG.INDENT_MAX_CONSECUTIVE_COUNT && lastIndentSize >= COMPONENT_CONFIG.INDENT_MAX_SIZE;
          const mustIncreaseIndentSize = consecutiveIndentCount >= COMPONENT_CONFIG.INDENT_MAX_CONSECUTIVE_COUNT && lastIndentSize <= 1;
          const randomUpdateIndentSize = consecutiveIndentCount >= getRandomNumber(1, COMPONENT_CONFIG.INDENT_MAX_CONSECUTIVE_COUNT);
          const canDecreaseIndentSize = randomUpdateIndentSize && lastIndentSize > COMPONENT_CONFIG.INDENT_MIN_SIZE;
          const canIncreaseIndentSize = randomUpdateIndentSize && lastIndentSize < COMPONENT_CONFIG.INDENT_MAX_SIZE && !lastCodeLineHadValueBlock && !lastCodeLineWasClosingTag;

          if (mustIncreaseIndentSize || canIncreaseIndentSize) nextIndentSize += 1;
          else if (mustDecreaseIndentSize || canDecreaseIndentSize) nextIndentSize -= 1;

          const indentCodeBlock = new CodeBlockModel(BLOCK_TYPES.INDENT, nextIndentSize);
          indentCodeBlock.currentSize = indentCodeBlock.maximumSize;
          nextCodeLine.codeBlocks.push(indentCodeBlock);

          if (nextIndentSize < lastIndentSize) {
            // -------------------------------------------------------- //
            // indent was decreased, generate a closing tag from parent //
            // -------------------------------------------------------- //

            const openingTagNameSize = updatedCodeLines
              // get the opening tag to generate the closing tag, or random if removed
              .find((codeLine) => codeLine.codeBlocks[0].maximumSize === nextIndentSize)
              ?.codeBlocks.find((codeBlock) => codeBlock.blockType === BLOCK_TYPES.TAG_NAME)
              ?.maximumSize || getRandomNumber(2, 3);

            nextCodeLine.codeBlocks.push(
              new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
              new CodeBlockModel(BLOCK_TYPES.TAG_NAME, openingTagNameSize),
              new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
            );
          }

          else {
            // -------------------------------------------------------- //
            // indent was increased or stayed the same, generate random //
            // -------------------------------------------------------- //

            // determine if this is the last code line to be generated before changing the indent value
            // value blocks cant generate before decreasing indent due to having their own closing tags
            const isLastConsecutiveIndent = consecutiveIndentCount === COMPONENT_CONFIG.INDENT_MAX_CONSECUTIVE_COUNT - 1;

            // determine what code block types to build
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
            let remainingCalculations = 1 + useAttributeBlock + useAttributeBlockWithString + useValueBlock * 2;

            // get the next available size a generated block can use on the code line
            // calculations must be ran to ensure all blocks meet configured maximums
            const getAvailableSize = (codeBlockMaxSize = COMPONENT_CONFIG.CODE_BLOCK_MAX_SIZE) => {
              const averageSize = Math.floor(remainingCodeLineSize / remainingCalculations);
              const maximumSize = Math.min(averageSize, codeBlockMaxSize);

              // lower the number of single-sizes because it gets excessive
              // single, single, single ... all this line space was wasted!
              let minimumSize = Math.min(averageSize, 1 + getRandomBool());

              const nextCodeBlockTypes = new Set(nextCodeLine.codeBlocks.map((codeBlock) => codeBlock.blockType));
              const nextCodeLineHasSingleSize = nextCodeLine.codeBlocks.some((codeBlock) => codeBlock.maximumSize === 1 && !COMPONENT_CONFIG.CODE_BLOCK_NO_RESIZE.includes(codeBlock.blockType));
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
              new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
              new CodeBlockModel(BLOCK_TYPES.TAG_NAME, nextTagNameSize)
            );

            // insert conditional code blocks separately so getAvailableSize()
            // can observe the tag name to accurately generate available sizes

            nextCodeLine.codeBlocks.push(...[
              useAttributeBlock && new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE, getAvailableSize()),
              useAttributeBlockWithString && new CodeBlockModel(BLOCK_TYPES.OPERATOR),
              useAttributeBlockWithString && new CodeBlockModel(BLOCK_TYPES.STRING, getAvailableSize()),
              new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE),
              useValueBlock && new CodeBlockModel(BLOCK_TYPES.VALUE, getAvailableSize()),
              useValueBlock && new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
              useValueBlock && new CodeBlockModel(BLOCK_TYPES.TAG_NAME, nextTagNameSize),
              useValueBlock && new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
            ].filter((item) => typeof item !== 'boolean'));
          }

          break;
        }
      }

      if (updatedCodeLines.length >= COMPONENT_CONFIG.CODE_LINE_MAX_SCROLL)
        updatedCodeLines.length = COMPONENT_CONFIG.CODE_LINE_MAX_SCROLL - 1;

      updatedCodeLines.unshift(nextCodeLine);
    };

    const interval = setInterval(() => {
      if (!isCodePaused) {
        if (currentCodeLine) animateCodeBlock();
        else generateCodeLine();

        setCodeLines(updatedCodeLines);
      }
    }, codeSpeed);

    return () => clearInterval(interval);
  }, [codeLines, codeSpeed, isCodePaused, updatedCodeLines]);

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
          {updatedCodeLines.map((codeLine, index) => {
            // code lines are generated once with code blocks
            // made visible iteratively, giving them a typing
            // appearance — only pass visible blocks as props
            const visibleCodeBlocks = codeLine.codeBlocks.filter((x) => x.isVisible);
            const isCurrentLine = index === 0;

            return (
              <CodeLine
                key={codeLine.key}
                codeBlocks={visibleCodeBlocks}
                isClicked={codeLine.isClicked}
                isCurrentLine={isCurrentLine}
                onClick={(isClicked) => onCodeLineClick(codeLine, isClicked)}
              />
            );
          })}
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
        <button onClick={() => decreaseCodeSpeed(25)} type="button">
          <div className={styles.tooltip}>Slow down</div>
          <RewindIcon />
        </button>
        <button onClick={onPauseClick} type="button">
          <div className={styles.tooltip}>{isCodePaused ? 'Play' : 'Pause'}</div>
          {isCodePaused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button onClick={() => increaseCodeSpeed(25)} type="button">
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
