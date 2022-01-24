import React, { useEffect, useState } from 'react';
import PersonEmoji from '../assets/person emoji.png';
import BLOCK_TYPES from '../constants/BlockTypes';
import CodeBlockModel from '../models/CodeBlock';
import CodeLineModel from '../models/CodeLine';
import { getRandomBool, getRandomNumber } from '../utils';
import './Animator.css';
import CodeLine from './CodeLine';
import {
  ANIMATOR_GENERATION_SPEED,
  CODE_BLOCK_MAX_BASE_SIZE,
  CODE_BLOCK_MAX_INDENT_SIZE,
  CODE_LINE_MAX_TOTAL_SIZE,
  CODE_LINE_MAX_TOTAL_STACK,
  CODE_LINE_MAX_CONSECUTIVE_INDENT
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
        const activeCodeBlock = activeCodeLine.activeCodeBlock;

        if (!activeCodeBlock.isVisible)
          activeCodeBlock.isVisible = true;
        else
          activeCodeBlock.currentSize++;
      }

      else {
        // ----------------------------------------- //
        // animator is generating the next code line //
        // ----------------------------------------- //
        const lastCodeLine = updatedCodeLines[0];
        const nextCodeLine = new CodeLineModel();

        const consecutiveIndentCount = getConsecutiveIndentCount(updatedCodeLines);
        const mustDecreaseIndentSize = consecutiveIndentCount >= CODE_LINE_MAX_CONSECUTIVE_INDENT && lastCodeLine.indentSize >= CODE_BLOCK_MAX_INDENT_SIZE;
        const mustIncreaseIndentSize = consecutiveIndentCount >= CODE_LINE_MAX_CONSECUTIVE_INDENT && lastCodeLine.indentSize <= 1;
        const randomUpdateIndentSize = consecutiveIndentCount >= getRandomNumber(CODE_LINE_MAX_CONSECUTIVE_INDENT);

        const lastCodeBlockTypes = lastCodeLine.getCodeBlockTypes();
        const isSequentialValues = lastCodeBlockTypes.length <= 2 && lastCodeBlockTypes.includes(BLOCK_TYPES.VALUE);

        let nextIndentSize = lastCodeLine.indentSize;

        if (mustIncreaseIndentSize)
          nextIndentSize++;
        else if (mustDecreaseIndentSize)
          nextIndentSize--;
        else if (randomUpdateIndentSize && isSequentialValues)
          nextIndentSize--;
        else if (randomUpdateIndentSize && lastCodeLine.indentSize >= CODE_BLOCK_MAX_INDENT_SIZE)
          nextIndentSize--;
        else if (randomUpdateIndentSize && lastCodeLine.indentSize <= 1)
          nextIndentSize++;
        else if (randomUpdateIndentSize)
          nextIndentSize += getRandomBool() ? 1 : -1;

        nextCodeLine.addCodeBlocks(
          new CodeBlockModel(BLOCK_TYPES.INDENT, nextIndentSize),
        );

        const isIndentDecreased = nextIndentSize < lastCodeLine.indentSize;
        const isIndentIncreased = nextIndentSize > lastCodeLine.indentSize;

        if (isIndentDecreased) {
          const openTagNameSize = updatedCodeLines
            .find(codeLine => codeLine.indentSize === nextIndentSize)
            ?.codeBlocks.find(codeBlock => codeBlock.blockType === BLOCK_TYPES.TAG_NAME)
            ?.maximumSize || getNextTagNameSize(); // take random value if not available

          nextCodeLine.addCodeBlocks(
            new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
            new CodeBlockModel(BLOCK_TYPES.TAG_NAME, openTagNameSize),
            new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
          );
        }

        else {
          const useValueBlockOnly = false;
            // (isIndentIncreased && lastCodeBlockTypes.length <= 4 && getRandomBool(.5)) // [4]  = indent, start angle, tag name, close angle
            // || (lastCodeBlockTypes.length <= 2 && lastCodeLine.hasCodeBlock(BLOCK_TYPES.VALUE)); // [||] = last code line only uses value block types

          if (useValueBlockOnly) {
            let remainingSize;

            if (isSequentialValues)
              remainingSize = lastCodeLine.getCodeBlockSizes(BLOCK_TYPES.VALUE);
            else {
              const maximumRandomValue = CODE_LINE_MAX_TOTAL_SIZE - nextIndentSize;
              remainingSize = Math.max(lastCodeLine.maximumSize, getRandomNumber(maximumRandomValue));
            }

            while (remainingSize > 0) {
              const maximumRandomValue = Math.min(remainingSize, Math.round(CODE_BLOCK_MAX_BASE_SIZE / 2));
              const valueCodeBlockSize = getRandomNumber(maximumRandomValue);
              const valueCodeBlock = new CodeBlockModel(BLOCK_TYPES.VALUE, valueCodeBlockSize);
              remainingSize -= valueCodeBlock.maximumSize;
              nextCodeLine.addCodeBlocks(valueCodeBlock);
            }
          }

          else {
            const nextTagNameSize = getNextTagNameSize();

            const useAttributeBlock = getRandomBool(.8);
            const useAttributeBlockWithValue = useAttributeBlock && getRandomBool();
            const useValueBlock = getRandomBool(useAttributeBlockWithValue ? .25 : .5);
            const useValueBlockWithOperator = useValueBlock && !useAttributeBlockWithValue && getRandomBool(.25);

            // calculate remaining space to generate code blocks from
            // [2] = space used by initial start and close angle tags
            let remainingCodeLineSize = CODE_LINE_MAX_TOTAL_SIZE - nextIndentSize - nextTagNameSize - 2;
            remainingCodeLineSize -= useAttributeBlockWithValue + useValueBlockWithOperator;
            if (useValueBlock) remainingCodeLineSize -= nextTagNameSize + 2;

            // calculate the remaining number of calculations to be performed using the remaining size
            // [remaining size / remaining calculations] = max size of each block to stay within limit
            let remainingCalculations =
              useValueBlockOnly + useAttributeBlock + useAttributeBlockWithValue + useValueBlock + useValueBlockWithOperator;

            const getAvailableSize = () => {
              const maximumRandomValue = Math.min(Math.floor(remainingCodeLineSize / remainingCalculations), CODE_BLOCK_MAX_BASE_SIZE);
              const nextCodeBlockSize = getRandomNumber(maximumRandomValue);
              remainingCodeLineSize -= nextCodeBlockSize;
              remainingCalculations -= 1;
              return nextCodeBlockSize;
            }

            nextCodeLine.addConditionalCodeBlocks(
              new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
              new CodeBlockModel(BLOCK_TYPES.TAG_NAME, nextTagNameSize),
              useAttributeBlock && new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE, getAvailableSize()),
              useAttributeBlockWithValue && new CodeBlockModel(BLOCK_TYPES.OPERATOR),
              useAttributeBlockWithValue && new CodeBlockModel(BLOCK_TYPES.STRING, getAvailableSize()),
              new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE),
              useValueBlock && new CodeBlockModel(BLOCK_TYPES.VALUE, getAvailableSize()),
              useValueBlockWithOperator && new CodeBlockModel(BLOCK_TYPES.OPERATOR),
              useValueBlockWithOperator && new CodeBlockModel(BLOCK_TYPES.VALUE, getAvailableSize()),
              useValueBlock && new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
              useValueBlock && new CodeBlockModel(BLOCK_TYPES.TAG_NAME, nextTagNameSize),
              useValueBlock && new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
            );
          }
        }

        if (updatedCodeLines.length >= CODE_LINE_MAX_TOTAL_STACK)
          updatedCodeLines.pop();

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

const getNextTagNameSize = () => {
  // add random 1 value to reduce return 1 values
  return getRandomNumber(2) + getRandomBool(.75);
}

export default Animator;
