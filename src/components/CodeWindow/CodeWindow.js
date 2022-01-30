import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import EraserIcon from '../../assets/icon/eraser.svg';
import PauseIcon from '../../assets/icon/pause.svg';
import RewindIcon from '../../assets/icon/rewind.svg';
import PinOnIcon from '../../assets/icon/pin_on.svg';
import PinOffIcon from '../../assets/icon/pin_off.svg';
import PersonEmoji from '../../assets/emoji/person.png';
import PlayIcon from '../../assets/icon/play.svg';
import FastForwardIcon from '../../assets/icon/fast_forward.svg';
import BLOCK_TYPES from '../../constants/BlockTypes';
import CodeBlockModel from '../../models/CodeBlockModel';
import CodeLineModel from '../../models/CodeLineModel';
import './CodeWindow.css';
import CodeLine from '../CodeLine/CodeLine';
import {
  CODE_WINDOW_GENERATION_SPEED,
  CODE_BLOCK_MAX_BASE_SIZE,
  CODE_BLOCK_MAX_INDENT_SIZE,
  CODE_BLOCK_MIN_INDENT_SIZE,
  CODE_BLOCK_RESTRICTED_SIZE,
  CODE_LINE_MAX_CONSECUTIVE_INDENT,
  CODE_LINE_MAX_TOTAL_SIZE,
  CODE_LINE_MAX_TOTAL_STACK
} from '../../_config.json';

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
  new CodeLineModel( // gets displayed second
    new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
    new CodeBlockModel(BLOCK_TYPES.TAG_NAME, 2),
    new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE),
  ),
  new CodeLineModel( // gets displayed first
    new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
    new CodeBlockModel(BLOCK_TYPES.TAG_NAME, 3),
    new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE),
    new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE),
  ),
];

// get the number of recent code lines that use
// same indent size to improve block generation
const getConsecutiveIndentCount = codeLines => {
  const indentSize = codeLines[0].indentSize;
  let result = 0;

  for (const codeLine of codeLines)
    if (codeLine.indentSize === indentSize) result++;
    else break;

  return result;
}

// get a formatted thousands decimal number ... 1000 returns 1.0k, 1120 returns 1.1k, etc
const getFormattedNumber = number => number < 1000 ? number : `${(number/1000).toFixed(1)}k`;

// get a random boolean of probability ... 0.5 equals 50% return true
const getRandomBool = (probability = 0.5) => Math.random() < probability;

// get a random number between 1 and max ... max = 5 ranges 1 to 5
const getRandomNumber = max => Math.floor(Math.random() * max) + 1;

// get a random number with min because javascript doesn't support function overloading
const getRandomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function CodeWindow() {
  // ---------------------------------------- //
  // state for rendering code lines on screen //
  // ---------------------------------------- //
  const [codeLines, setCodeLines] = useState(INITIAL_DATA);
  const [codeSpeed, setCodeSpeed] = useState(CODE_WINDOW_GENERATION_SPEED);
  const updatedCodeLines = codeLines.slice();

  const decreaseCodeSpeed = number => !isCodePaused && setCodeSpeed(codeSpeed => Math.min(codeSpeed + number, 1000));
  const increaseCodeSpeed = number => !isCodePaused && setCodeSpeed(codeSpeed => Math.max(codeSpeed - number, 0));
  const onCodeLineClick = (codeLine, isClicked) => {
    codeLine.isClicked = isClicked;
    setCodeLines(updatedCodeLines);
  }

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
  const onPauseClick = () => setIsCodePaused(isCodePaused => !isCodePaused);

  const [isFooterPinned, setIsFooterPinned] = useState(false);
  const onPinClick = () => setIsFooterPinned(isFooterPinned => !isFooterPinned);

  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const formattedCharCount = getFormattedNumber(charCount);
  const formattedLineCount = getFormattedNumber(lineCount);

  const isFooterVisible = isFooterPinned || isMouseHovering || isCodePaused;
  const footerClassNames = classNames(
    {'visible': isFooterVisible},
    {'pause': isFooterVisible && isCodePaused},
    {'debug': isFooterVisible && !isCodePaused && codeLines.some(codeLine => codeLine.isClicked)},
  );

  const onResetClick = () => {
    updatedCodeLines
      .filter(codeLine => codeLine.isClicked)
      .forEach(codeLine => codeLine.isClicked = false);

    setIsCodePaused(false);
    setIsFooterPinned(false);
    setCodeSpeed(CODE_WINDOW_GENERATION_SPEED);
  }

  // ---------------- //
  // component render //
  // ---------------- //

  useEffect(() => {
    // check for an active CodeLine object (no index means CodeLine was completed)
    const activeArrIndex = updatedCodeLines.map(x => x.isActive).lastIndexOf(true);
    const activeCodeLine = activeArrIndex > -1 && updatedCodeLines[activeArrIndex];

    const animateCodeBlock = () => {
      const updateCharCount = activeCodeLine.activeCodeBlock.blockType !== BLOCK_TYPES.INDENT;
      const updateLineCount = activeCodeLine.isNewLine; 
      if (updateCharCount) setCharCount(charCount => charCount + 1);
      if (updateLineCount) setLineCount(lineCount => lineCount + 1);

      if (!activeCodeLine.activeCodeBlock.isVisible)
        activeCodeLine.activeCodeBlock.isVisible = true;
      else activeCodeLine.activeCodeBlock.currentSize++;
    }

    const generateCodeLine = () => {
      const lastCodeLine = updatedCodeLines[0];
      const nextCodeLine = new CodeLineModel();

      // get details on how the previous code line was built
      const lastCodeLineHadValueBlock = lastCodeLine.hasCodeBlock(BLOCK_TYPES.VALUE); // value blocks already have closing tags so adding more is a syntax error
      const lastCodeLineWasClosingTag = lastCodeLine.getCodeBlockTypes().length <= 4; // we shouldn't increase the code line indent immediately after a decrease

      // get details on the next indent code block size
      const consecutiveIndentCount = getConsecutiveIndentCount(updatedCodeLines);
      const mustDecreaseIndentSize = consecutiveIndentCount >= CODE_LINE_MAX_CONSECUTIVE_INDENT && lastCodeLine.indentSize >= CODE_BLOCK_MAX_INDENT_SIZE;
      const mustIncreaseIndentSize = consecutiveIndentCount >= CODE_LINE_MAX_CONSECUTIVE_INDENT && lastCodeLine.indentSize <= 1;
      const randomUpdateIndentSize = consecutiveIndentCount >= getRandomNumber(CODE_LINE_MAX_CONSECUTIVE_INDENT);

      const canDecreaseIndentSize = randomUpdateIndentSize && lastCodeLine.indentSize > CODE_BLOCK_MIN_INDENT_SIZE;
      const canIncreaseIndentSize = randomUpdateIndentSize && lastCodeLine.indentSize < CODE_BLOCK_MAX_INDENT_SIZE && !lastCodeLineHadValueBlock && !lastCodeLineWasClosingTag;

      let indentSize = lastCodeLine.indentSize;

      if (mustIncreaseIndentSize || canIncreaseIndentSize)
        indentSize++;
      else if (mustDecreaseIndentSize || canDecreaseIndentSize)
        indentSize--;

      const indentCodeBlock = new CodeBlockModel(BLOCK_TYPES.INDENT, indentSize);
      nextCodeLine.addCodeBlocks(indentCodeBlock);

      if (nextCodeLine.indentSize < lastCodeLine.indentSize) {
        // -------------------------------------------------------- //
        // indent was decreased, generate a closing tag from parent //
        // -------------------------------------------------------- //

        const tagNameSize = updatedCodeLines
          // get size of the parent tag name, or random if has been removed
          .find(codeLine => codeLine.indentSize === nextCodeLine.indentSize)
          ?.findCodeBlock(BLOCK_TYPES.TAG_NAME)?.maximumSize
          || getRandomNumber(2) + getRandomBool(.75);

        nextCodeLine.addCodeBlocks(
          new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
          new CodeBlockModel(BLOCK_TYPES.TAG_NAME, tagNameSize),
          new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
        );
      }

      else {
        // -------------------------------------------------------- //
        // indent was increased or stayed the same, generate random //
        // -------------------------------------------------------- //

        // determine if this is the last code line generated before changing the indent value
        // value blocks cant be generated before decreasing indent due to having their own closing tags
        const isLastConsecutiveIndent = consecutiveIndentCount === CODE_LINE_MAX_CONSECUTIVE_INDENT - 1;

        // determine what code block types to build
        const useAttributeBlock = getRandomBool(.80);
        const useAttributeBlockWithString = useAttributeBlock && getRandomBool(.675);
        const useValueBlock = !isLastConsecutiveIndent && getRandomBool(useAttributeBlockWithString ? .25 : .50);

        // get the remaining code line space available to generate blocks on
        // [2] = reserved space for the pair of start and close angle blocks
        let remainingCodeLineSize = CODE_LINE_MAX_TOTAL_SIZE - indentCodeBlock.maximumSize - 2;
        if (useAttributeBlockWithString) remainingCodeLineSize -= 1; // used by operator block
        if (useValueBlock) remainingCodeLineSize -= 2; // used by second start and close pairs

        // get the remaining number of block size calculations to execute
        // [1] = reserved space for tag name (used twice for value blocks)
        let remainingCalculations = 1 + useAttributeBlock + useAttributeBlockWithString + (useValueBlock * 2);

        // get the next available size a generated block can use on the code line
        // calculations must be ran to ensure all blocks meet configured maximums
        const getAvailableSize = (codeBlockMaxSize = CODE_BLOCK_MAX_BASE_SIZE) => {
          const averageSize = Math.floor(remainingCodeLineSize / remainingCalculations);
          const maximumSize = Math.min(averageSize, codeBlockMaxSize);

          // lower the number of single-sizes because it gets excessive
          // single, single, single ... all this line space was wasted!
          let minimumSize = Math.min(averageSize, 1 + getRandomBool());
          const nextCodeLineHasSingleSize = nextCodeLine.codeBlocks.some(codeBlock => codeBlock.maximumSize === 1 && !CODE_BLOCK_RESTRICTED_SIZE.includes(codeBlock.blockType));
          const nextCodeLineIsTagNameOnly = nextCodeLine.getCodeBlockTypes().length <= 3 && remainingCalculations <= 1;

          // limit code lines to one single-size block because multiple makes it appear small and ugly
          if (minimumSize === 1 && nextCodeLineHasSingleSize) minimumSize = Math.min(2, averageSize);
          // reduce the likelihood of generating a code line with a single block of single size
          if (minimumSize === 1 && nextCodeLineIsTagNameOnly) minimumSize += getRandomBool(.8);

          const result = getRandomRange(minimumSize, maximumSize);
          remainingCodeLineSize -= result;
          remainingCalculations -= 1;
          return result;
        }

        const tagNameSize = getAvailableSize(3);

        if (useValueBlock) {
          // remove trailing tag name after value blocks
          // <[tag_name] [attribute]>[value]<[tag_name]>
          remainingCodeLineSize -= tagNameSize;
          remainingCalculations -= 1;
        }

        nextCodeLine.addCodeBlocks(
          new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
          new CodeBlockModel(BLOCK_TYPES.TAG_NAME, tagNameSize)
        );

        // insert conditional code blocks separately so getAvailableSize()
        // can observe the tag name to accurately generate available sizes

        nextCodeLine.addConditionalCodeBlocks(
          useAttributeBlock && new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE, getAvailableSize()),
          useAttributeBlockWithString && new CodeBlockModel(BLOCK_TYPES.OPERATOR),
          useAttributeBlockWithString && new CodeBlockModel(BLOCK_TYPES.STRING, getAvailableSize()),
          new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE),
          useValueBlock && new CodeBlockModel(BLOCK_TYPES.VALUE, getAvailableSize()),
          useValueBlock && new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
          useValueBlock && new CodeBlockModel(BLOCK_TYPES.TAG_NAME, tagNameSize),
          useValueBlock && new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
        );
      }

      if (updatedCodeLines.length >= CODE_LINE_MAX_TOTAL_STACK)
        // remove expired array elements to prevent memory leaks
        updatedCodeLines.length = CODE_LINE_MAX_TOTAL_STACK - 1;

      updatedCodeLines.unshift(nextCodeLine);
    }

    const interval = setInterval(() => {
      if (!isCodePaused) {
        activeCodeLine
          ? animateCodeBlock()
          : generateCodeLine();
        setCodeLines(updatedCodeLines);
      }

    }, codeSpeed);

    return () => clearInterval(interval);
  }, [codeLines, codeSpeed, isCodePaused, updatedCodeLines]);

  return (
    <div id='code-window-wrapper' onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <div id='code-window-title'>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
      <div id='code-window-body'>
        <div id='code-window-code'>
        {
          updatedCodeLines.map(codeLine =>
            <CodeLine
              key={codeLine.key}
              codeBlocks={codeLine.codeBlocks}
              isClicked={codeLine.isClicked}
              onClick={isClicked => onCodeLineClick(codeLine, isClicked)}
            />
          )
        }
        </div>
        <div id='code-window-name'>
          <img src={PersonEmoji} alt='man technologist emoji'></img>
          <span>Austin Williams</span>
        </div>
      </div>
      <div id='code-window-footer' className={footerClassNames}>
        <button onClick={onPinClick}>
        {
          isFooterPinned
            ? <img src={PinOffIcon} alt='pin off'/>
            : <img src={PinOnIcon} alt='pin on'/>
        }
        </button>
        <button onClick={() => decreaseCodeSpeed(25)}>
          <img src={RewindIcon} alt='rewind'/>
        </button>
        <button onClick={onPauseClick}>
        {
          isCodePaused
            ? <img src={PlayIcon} alt='play'/>
            : <img src={PauseIcon} alt='pause'/>
        }
        </button>
        <button onClick={() => increaseCodeSpeed(25)}>
          <img src={FastForwardIcon} alt='fast forward'/>
        </button>
        <span>{ isCodePaused ? 'Paused' : `${codeSpeed}ms` }</span>
        <button onClick={onResetClick}>
          <img src={EraserIcon} alt='reset'/>
        </button>
        <span>Lines: {formattedLineCount}</span>
        <span>Chars: {formattedCharCount}</span>
      </div>
    </div>
  );
}

export default CodeWindow;
