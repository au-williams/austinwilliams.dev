import React, { useEffect, useState } from 'react';
import PersonEmoji from '../assets/person emoji.png';
import BLOCK_TYPES from '../constants/BlockTypes';
import CodeBlockModel from '../models/CodeBlock';
import CodeLineModel from '../models/CodeLine';
import './Animator.css';
import CodeLine from './CodeLine';
import {
  ANIMATOR_GENERATION_SPEED,
  CODE_BLOCK_MAX_BASE_SIZE,
  CODE_BLOCK_MAX_INDENT_SIZE,
  CODE_BLOCK_MIN_INDENT_SIZE,
  CODE_BLOCK_RESTRICTED_SIZE,
  CODE_LINE_MAX_CONSECUTIVE_INDENT,
  CODE_LINE_MAX_TOTAL_SIZE,
  CODE_LINE_MAX_TOTAL_STACK
} from '../_config.json';

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

function Animator() {
  const [codeLines, setCodeLines] = useState(INITIAL_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCodeLines = codeLines.slice();

      // check for an active CodeLine object (no index means CodeLine was completed)
      const activeArrIndex = updatedCodeLines.map(x => x.isActive).lastIndexOf(true);
      const activeCodeLine = activeArrIndex > -1 && updatedCodeLines[activeArrIndex];

      if (activeCodeLine) {
        // ----------------------------------------- //
        // animator is parsing a generated code line //
        // ----------------------------------------- //

        activeCodeLine.activeCodeBlock.updateSize();
      }

      else {
        // ----------------------------------------- //
        // animator is generating the next code line //
        // ----------------------------------------- //

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

        // get helper properties
        const canDecreaseIndentSize = randomUpdateIndentSize && lastCodeLine.indentSize > CODE_BLOCK_MIN_INDENT_SIZE;
        const canIncreaseIndentSize = randomUpdateIndentSize && lastCodeLine.indentSize < CODE_BLOCK_MAX_INDENT_SIZE && !lastCodeLineHadValueBlock && !lastCodeLineWasClosingTag;

        const indentCodeBlock = new CodeBlockModel(BLOCK_TYPES.INDENT, lastCodeLine.indentSize);

        if (mustIncreaseIndentSize || canIncreaseIndentSize)
          indentCodeBlock.increaseSize();
        else if (mustDecreaseIndentSize || canDecreaseIndentSize)
          indentCodeBlock.decreaseSize();

        nextCodeLine.addCodeBlocks(indentCodeBlock);

        if (nextCodeLine.indentSize < lastCodeLine.indentSize) {
          const tagNameSize = updatedCodeLines
            // get size of the opening tag name, or random if its been removed
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
          const isLastConsecutiveIndent = consecutiveIndentCount === CODE_LINE_MAX_CONSECUTIVE_INDENT - 1;

          // determine what code block types to build
          const useAttributeBlock = getRandomBool(.80);
          const useAttributeBlockWithString = useAttributeBlock && getRandomBool(.675);
          const useValueBlock = !isLastConsecutiveIndent && getRandomBool(useAttributeBlockWithString ? .25 : .50);

          // get the remaining space available to use by generated code blocks
          // [2] = reserved space for the pair of start and close angle blocks
          let remainingCodeLineSize = CODE_LINE_MAX_TOTAL_SIZE - indentCodeBlock.maximumSize - 2;
          if (useAttributeBlockWithString) remainingCodeLineSize -= 1; // reserved for operator block
          if (useValueBlock) remainingCodeLineSize -= 2; // reserved for second start and close pair

          // get the remaining number of code block size calculations to perform
          // [1] = reserved space for tag name (ran twice using [useValueBlock])
          let remainingCalculations = 1 + useAttributeBlock + useAttributeBlockWithString + (useValueBlock * 2);

          // get a random value less than or equal to the configured maximum size
          const getAvailableSize = (codeBlockMaxSize = CODE_BLOCK_MAX_BASE_SIZE) => {
            const averageSize = Math.floor(remainingCodeLineSize / remainingCalculations);
            const maximumSize = Math.min(averageSize, codeBlockMaxSize);

            // lower the number of single sizes because it gets excessive
            // single, single, single ... all this line space was wasted!
            let minimumSize = Math.min(averageSize, 1 + getRandomBool());
            const nextCodeLineHasSingleSize = nextCodeLine.codeBlocks.some(codeBlock => codeBlock.maximumSize === 1 && !CODE_BLOCK_RESTRICTED_SIZE.includes(codeBlock.blockType));
            const nextCodeLineIsTagNameOnly = nextCodeLine.getCodeBlockTypes().length <= 3 && remainingCalculations <= 1;
            if (minimumSize === 1 && nextCodeLineHasSingleSize) minimumSize = Math.min(2, averageSize);
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

      setCodeLines(updatedCodeLines);
    }, ANIMATOR_GENERATION_SPEED);

    return () => clearInterval(interval);
  }, [codeLines]);

  return (
    <div id='animator-wrapper'>
      <div id='animator-title-bar'>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
      <div id='animator-body'>
        <div id='animator-name'>
          <img src={PersonEmoji} alt='man technologist emoji'></img>
          <span>Austin Williams</span>
        </div>
        <div id='animator-code'>
          <div id='animator-spacer'/>
          {codeLines.map(codeLine =>
            <CodeLine
              key={codeLine.key}
              isActive={codeLine.isActive}
              codeBlocks={codeLine.codeBlocks}
            />)}
        </div>
      </div>
    </div>
  );
}

const getConsecutiveIndentCount = codeLines => {
  const indentSize = codeLines[0].indentSize;
  let result = 0;

  for (const codeLine of codeLines)
    if (codeLine.indentSize === indentSize) result++;
    else break;

  return result;
}

// probability is the chance for a return true ... 0.5 equals 50% chance
const getRandomBool = (probability = 0.5) => Math.random() < probability;

// max is the maximum random return value ... max = 5 ranges 1 to 5
const getRandomNumber = max => Math.floor(Math.random() * max) + 1;

// same as getRandomNumber but with min because JS doesn't support function overloading
const getRandomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default Animator;
