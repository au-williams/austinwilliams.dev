import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import PersonEmoji from '../../assets/emoji/person.png';
import EraserIcon from '../../assets/icon/eraser.svg';
import FastForwardIcon from '../../assets/icon/fast_forward.svg';
import PauseIcon from '../../assets/icon/pause.svg';
import PinOffIcon from '../../assets/icon/pin_off.svg';
import PinOnIcon from '../../assets/icon/pin_on.svg';
import PlayIcon from '../../assets/icon/play.svg';
import RewindIcon from '../../assets/icon/rewind.svg';
import CodeLine from './CodeLine/CodeLine';
import styles from './CodeWindow.module.scss';
import {
  CODE_BLOCK_MAX_SIZE,
  CODE_BLOCK_NO_RESIZE,
  CODE_LINE_MAX_SCROLL,
  CODE_LINE_MAX_SIZE,
  DEFAULT_GENERATION_SPEED,
  INDENT_MAX_CONSECUTIVE_COUNT,
  INDENT_MAX_SIZE,
  INDENT_MIN_SIZE
} from './_config.json';

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

class CodeBlockModel {
  constructor(blockType, maximumSize = 1) {
    this.blockType = blockType;
    this.isVisible = false;
    this.currentSize = 1;
    this.maximumSize = maximumSize;
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

const INITIAL_DATA = [
  // initial data is displayed in ascending order to match
  // the reverse-column CSS, required to bottom anchor the
  // scroll position without additional use of javascript.

  new CodeLineModel( // gets displayed last
    new CodeBlockModel(BLOCK_TYPES.INDENT),
    new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
    new CodeBlockModel(BLOCK_TYPES.TAG_NAME, 2),
    new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
  ),
  new CodeLineModel(
    new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
    new CodeBlockModel(BLOCK_TYPES.TAG_NAME, 2),
    new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
  ), // gets displayed second
  new CodeLineModel( // gets displayed first
    new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
    new CodeBlockModel(BLOCK_TYPES.TAG_NAME, 3),
    new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE),
    new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
  )
];

// get the number of recent code lines that use
// same indent size to improve block generation
const getConsecutiveIndentCount = (codeLines) => {
  const lastIndentSize = codeLines[0].codeBlocks[0].maximumSize;
  let result = 0;

  for (const codeLine of codeLines) {
    const thisIndentSize = codeLine.codeBlocks[0].maximumSize;
    if (thisIndentSize === lastIndentSize) result += 1;
    else break;
  }

  return result;
};

const getFormattedNumber = (number) => (number < 1000 ? number : `${(number / 1000).toFixed(1)}k`);

const getRandomBool = (probability = 0.5) => Math.random() < probability;

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// prettier-ignore
const CodeWindow = () => {
  // ---------------------------------------- //
  // state for rendering code lines on screen //
  // ---------------------------------------- //
  const [codeLines, setCodeLines] = useState(INITIAL_DATA);
  const [codeSpeed, setCodeSpeed] = useState(DEFAULT_GENERATION_SPEED);
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
    isFooterVisible && styles.visible,
    isFooterVisible && isCodePaused && styles.pause,
    isFooterVisible && !isCodePaused && codeLines.some((codeLine) => codeLine.isClicked) && styles.debug
  );

  const onResetClick = () => {
    updatedCodeLines
      .filter((codeLine) => codeLine.isClicked)
      .forEach((codeLine) => {
        codeLine.isClicked = false;
      });

    setIsCodePaused(false);
    setIsFooterPinned(false);
    setCodeSpeed(DEFAULT_GENERATION_SPEED);
  };

  // ---------------- //
  // component render //
  // ---------------- //

  useEffect(() => {
    // check for an active CodeLine object (no index means CodeLine was completed)
    const isActiveIndex = updatedCodeLines.map((x) => x.isActive).lastIndexOf(true);
    const currentCodeLine = isActiveIndex > -1 && updatedCodeLines[isActiveIndex];

    const animateCodeBlock = () => {
      const currentCodeBlock = currentCodeLine.codeBlocks.find((codeBlock) => codeBlock.isActive);

      const canUpdateCharCount = currentCodeBlock.blockType !== BLOCK_TYPES.INDENT;
      const canUpdateLineCount = currentCodeLine.codeBlocks.reduce((sum, codeBlock) => sum + codeBlock.isVisible, 0) === 0;
      if (canUpdateCharCount) setCharCount((number) => number + 1);
      if (canUpdateLineCount) setLineCount((number) => number + 1);

      if (!currentCodeBlock.isVisible) currentCodeBlock.isVisible = true;
      else currentCodeBlock.currentSize += 1;
    };

    const generateCodeLine = () => {
      const lastCodeLine = updatedCodeLines[0];
      const nextCodeLine = new CodeLineModel();

      // get details on how the previous code line was built
      const lastCodeBlockTypes = new Set(lastCodeLine.codeBlocks.map((codeBlock) => codeBlock.blockType));

      const lastCodeLineHadValueBlock = lastCodeBlockTypes.has(BLOCK_TYPES.VALUE);
      const lastCodeLineWasClosingTag = lastCodeBlockTypes.size <= 4;

      const lastIndentSize = lastCodeLine.codeBlocks[0].maximumSize;
      let nextIndentSize = lastIndentSize;

      // get details on the next indent code block size
      const consecutiveIndentCount = getConsecutiveIndentCount(updatedCodeLines);
      const mustDecreaseIndentSize = consecutiveIndentCount >= INDENT_MAX_CONSECUTIVE_COUNT && lastIndentSize >= INDENT_MAX_SIZE;
      const mustIncreaseIndentSize = consecutiveIndentCount >= INDENT_MAX_CONSECUTIVE_COUNT && lastIndentSize <= 1;
      const randomUpdateIndentSize = consecutiveIndentCount >= getRandomNumber(1, INDENT_MAX_CONSECUTIVE_COUNT);

      const canDecreaseIndentSize = randomUpdateIndentSize && lastIndentSize > INDENT_MIN_SIZE;
      const canIncreaseIndentSize = randomUpdateIndentSize && lastIndentSize < INDENT_MAX_SIZE && !lastCodeLineHadValueBlock && !lastCodeLineWasClosingTag;

      if (mustIncreaseIndentSize || canIncreaseIndentSize) nextIndentSize += 1;
      else if (mustDecreaseIndentSize || canDecreaseIndentSize) nextIndentSize -= 1;

      const indentCodeBlock = new CodeBlockModel(BLOCK_TYPES.INDENT, nextIndentSize);
      indentCodeBlock.currentSize = indentCodeBlock.maximumSize;
      nextCodeLine.codeBlocks.push(indentCodeBlock);

      if (nextIndentSize < lastIndentSize) {
        // -------------------------------------------------------- //
        // indent was decreased, generate a closing tag from parent //
        // -------------------------------------------------------- //

        const tagNameSize =
          // get the opening tag name size to generate the closing tag, or random if removed
          updatedCodeLines
            .find((codeLine) => codeLine.codeBlocks[0].maximumSize === nextIndentSize)
            ?.codeBlocks.find((codeBlock) => codeBlock.blockType === BLOCK_TYPES.TAG_NAME)?.maximumSize || getRandomNumber(2, 3);

        nextCodeLine.codeBlocks.push(
          new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
          new CodeBlockModel(BLOCK_TYPES.TAG_NAME, tagNameSize),
          new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
        );
      } else {
        // -------------------------------------------------------- //
        // indent was increased or stayed the same, generate random //
        // -------------------------------------------------------- //

        // determine if this is the last code line generated before changing the indent value
        // value blocks cant be generated before decreasing indent due to having their own closing tags
        const isLastConsecutiveIndent = consecutiveIndentCount === INDENT_MAX_CONSECUTIVE_COUNT - 1;

        // determine what code block types to build
        const useAttributeBlock = getRandomBool(0.8);
        const useAttributeBlockWithString = useAttributeBlock && getRandomBool(0.675);
        const useValueBlock = !isLastConsecutiveIndent && getRandomBool(useAttributeBlockWithString ? 0.25 : 0.5);

        // get the remaining code line space available to generate blocks on
        // [2] = reserved space for the pair of start and close angle blocks
        let remainingCodeLineSize = CODE_LINE_MAX_SIZE - indentCodeBlock.maximumSize - 2;
        if (useAttributeBlockWithString) remainingCodeLineSize -= 1; // used by operator block
        if (useValueBlock) remainingCodeLineSize -= 2; // used by second start and close pairs

        // get the remaining number of block size calculations to execute
        // [1] = reserved space for tag name (used twice for value blocks)
        let remainingCalculations = 1 + useAttributeBlock + useAttributeBlockWithString + useValueBlock * 2;

        // get the next available size a generated block can use on the code line
        // calculations must be ran to ensure all blocks meet configured maximums
        const getAvailableSize = (codeBlockMaxSize = CODE_BLOCK_MAX_SIZE) => {
          const averageSize = Math.floor(remainingCodeLineSize / remainingCalculations);
          const maximumSize = Math.min(averageSize, codeBlockMaxSize);

          // lower the number of single-sizes because it gets excessive
          // single, single, single ... all this line space was wasted!
          let minimumSize = Math.min(averageSize, 1 + getRandomBool());

          const nextCodeBlockTypes = new Set(nextCodeLine.codeBlocks.map((codeBlock) => codeBlock.blockType));
          const nextCodeLineHasSingleSize = nextCodeLine.codeBlocks.some((codeBlock) => codeBlock.maximumSize === 1 && !CODE_BLOCK_NO_RESIZE.includes(codeBlock.blockType));
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

        const tagNameSize = getAvailableSize(3);

        if (useValueBlock) {
          // remove trailing tag name after value blocks
          // <[tag_name] [attribute]>[value]<[tag_name]>
          remainingCodeLineSize -= tagNameSize;
          remainingCalculations -= 1;
        }

        nextCodeLine.codeBlocks.push(
          new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
          new CodeBlockModel(BLOCK_TYPES.TAG_NAME, tagNameSize)
        );

        // insert conditional code blocks separately so getAvailableSize()
        // can observe the tag name to accurately generate available sizes

        const conditionalCodeBlocks = [
          useAttributeBlock && new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE, getAvailableSize()),
          useAttributeBlockWithString && new CodeBlockModel(BLOCK_TYPES.OPERATOR),
          useAttributeBlockWithString && new CodeBlockModel(BLOCK_TYPES.STRING, getAvailableSize()),
          new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE),
          useValueBlock && new CodeBlockModel(BLOCK_TYPES.VALUE, getAvailableSize()),
          useValueBlock && new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
          useValueBlock && new CodeBlockModel(BLOCK_TYPES.TAG_NAME, tagNameSize),
          useValueBlock && new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
        ].filter((item) => typeof item !== 'boolean');

        nextCodeLine.codeBlocks.push(...conditionalCodeBlocks);
      }

      if (updatedCodeLines.length >= CODE_LINE_MAX_SCROLL)
        // drop old array elements to prevent memory leaks
        updatedCodeLines.length = CODE_LINE_MAX_SCROLL - 1;

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
          {updatedCodeLines.map((codeLine) => {
            // code lines are generated once with code blocks
            // made visible iteratively, giving them a typing
            // appearance — only pass visible blocks as props
            const visibleCodeBlocks = codeLine.codeBlocks.filter(
              (codeBlock) => codeBlock.isVisible
            );

            return (
              <CodeLine
                key={codeLine.key}
                codeBlocks={visibleCodeBlocks}
                isClicked={codeLine.isClicked}
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
          <img
            src={isFooterPinned ? PinOffIcon : PinOnIcon}
            alt={`pin ${isFooterPinned ? 'off' : 'on'}`}
          />
        </button>
        <button onClick={() => decreaseCodeSpeed(25)} type="button">
          <div className={styles.tooltip}>Slow down</div>
          <img src={RewindIcon} alt="rewind" />
        </button>
        <button onClick={onPauseClick} type="button">
          <div className={styles.tooltip}>{isCodePaused ? 'Play' : 'Pause'}</div>
          <img src={isCodePaused ? PlayIcon : PauseIcon} alt={isCodePaused ? 'play' : 'pause'} />
        </button>
        <button onClick={() => increaseCodeSpeed(25)} type="button">
          <div className={styles.tooltip}>Speed up</div>
          <img src={FastForwardIcon} alt="fast forward" />
        </button>
        <span>{isCodePaused ? 'Paused' : `${codeSpeed}ms`}</span>
        <button onClick={onResetClick} type="button">
          <div className={styles.tooltip}>Reset</div>
          <img src={EraserIcon} alt="reset" />
        </button>
        <span>Lines: {formattedLineCount}</span>
        <span>Chars: {formattedCharCount}</span>
      </div>
    </div>
  );
};

export default CodeWindow;
