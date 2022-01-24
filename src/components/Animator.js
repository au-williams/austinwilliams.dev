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
import BlockTypes from '../constants/BlockTypes';

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

export default function Animator() {
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

        !activeCodeLine.activeCodeBlock.isVisible
          ? activeCodeLine.activeCodeBlock.isVisible = true
          : activeCodeLine.activeCodeBlock.currentSize++;
      }

      else {
        // ----------------------------------------- //
        // animator is generating the next code line //
        // ----------------------------------------- //
        const lastCodeLine = updatedCodeLines[0];
        const nextCodeLine = new CodeLineModel();

        const consecutiveIndentCount = getConsecutiveIndentCount(updatedCodeLines);
        const shouldUpdateIndentSize = consecutiveIndentCount >= getRandomNumber(CODE_LINE_MAX_CONSECUTIVE_INDENT);
        const mustDecreaseIndentSize = consecutiveIndentCount >= CODE_LINE_MAX_CONSECUTIVE_INDENT && lastCodeLine.indentSize >= CODE_BLOCK_MAX_INDENT_SIZE;
        const mustIncreaseIndentSize = consecutiveIndentCount >= CODE_LINE_MAX_CONSECUTIVE_INDENT && lastCodeLine.indentSize <= 1;

        const lastCodeBlockTypes = lastCodeLine.getCodeBlockTypes();
        const isSequentialValues = lastCodeBlockTypes.length <= 2 && lastCodeBlockTypes.includes(BLOCK_TYPES.VALUE);

        let nextIndentSize = lastCodeLine.indentSize;

        if (mustIncreaseIndentSize)
          nextIndentSize++;
        else if (mustDecreaseIndentSize)
          nextIndentSize--;
        else if (shouldUpdateIndentSize && isSequentialValues)
          nextIndentSize--;
        else if (shouldUpdateIndentSize && lastCodeLine.indentSize >= CODE_BLOCK_MAX_INDENT_SIZE)
          nextIndentSize--;
        else if (shouldUpdateIndentSize && lastCodeLine.indentSize <= 1)
          nextIndentSize++;
        else if (shouldUpdateIndentSize)
          nextIndentSize += (getRandomBool() ? 1 : -1);

        const isIndentDecreased = nextIndentSize < lastCodeLine.indentSize;
        const isIndentIncreased = nextIndentSize > lastCodeLine.indentSize;

        if (isIndentDecreased) {
          const lastTagNameSize = updatedCodeLines
              .find(codeLine => codeLine.indentSize === nextIndentSize)
              ?.codeBlocks.find(codeBlock => codeBlock.blockType === BLOCK_TYPES.TAG_NAME)
              ?.maximumSize || getNextTagNameSize();

          nextCodeLine.addCodeBlocks(
            new CodeBlockModel(BLOCK_TYPES.INDENT, nextIndentSize),
            new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
            new CodeBlockModel(BLOCK_TYPES.TAG_NAME, lastTagNameSize),
            new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
          );
        } else {
          nextCodeLine.addCodeBlocks(
            new CodeBlockModel(BLOCK_TYPES.INDENT, nextIndentSize),
          );

          const useValueBlockOnly =
            // indent, start angle, tag name, close angle OR only content
            (isIndentIncreased && lastCodeBlockTypes.length <= 4 && getRandomBool(.75)) ||
            (lastCodeBlockTypes.length <= 2 && lastCodeLine.hasCodeBlock(BLOCK_TYPES.VALUE));

          const useAttributeBlock = !useValueBlockOnly && getRandomBool(.8);
          const useAttributeBlockWithValue = useAttributeBlock && getRandomBool();
          const useValueBlock = !useValueBlockOnly && getRandomBool(useAttributeBlockWithValue ? .25 : .5);
          const useValueBlockWithOperator = useValueBlock && !useAttributeBlockWithValue && getRandomBool(.25);

          let remainingCalculations =
            useValueBlockOnly + useAttributeBlock + useAttributeBlockWithValue + useValueBlock + useValueBlockWithOperator;

          let nextTagNameSize = useValueBlockOnly ? 0 : getNextTagNameSize(remainingCalculations);
          let remainingCodeLineSize = CODE_LINE_MAX_TOTAL_SIZE - nextIndentSize - nextTagNameSize;
          remainingCodeLineSize -= (useAttributeBlockWithValue + useValueBlockWithOperator); // remove operators added by block types
          remainingCodeLineSize -= ((!useValueBlockOnly * 2) + (useValueBlock * 2)); // remove start and close angles added by block types
          if (useValueBlock) remainingCodeLineSize -= (nextTagNameSize + 2); // remove trailing tag name and angles when using value block 

          const getAvailableSize = (hasUndefinedCalculations = false) => {
            const maximumRandomValue = hasUndefinedCalculations
              ? Math.min(remainingCodeLineSize, CODE_BLOCK_MAX_BASE_SIZE)
              : Math.min(Math.floor(remainingCodeLineSize / remainingCalculations), CODE_BLOCK_MAX_BASE_SIZE);
            const nextCodeBlockSize = getRandomNumber(maximumRandomValue);
            remainingCodeLineSize -= nextCodeBlockSize;
            remainingCalculations -= 1;
            return nextCodeBlockSize;
          }

          if (useValueBlockOnly) {
            while (remainingCodeLineSize > 0) {
              const valueCodeBlock = new CodeBlockModel(BLOCK_TYPES.VALUE, getAvailableSize(true));
              nextCodeLine.addCodeBlocks(valueCodeBlock);
            }
          } else {
            nextCodeLine.addConditionalCodeBlocks(
              new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
              new CodeBlockModel(BLOCK_TYPES.TAG_NAME, nextTagNameSize),
              useAttributeBlock  && new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE, getAvailableSize()),
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

        if (updatedCodeLines.length >= CODE_LINE_MAX_TOTAL_STACK) {
          updatedCodeLines.pop();
        }

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

const getNextTagNameSize = (remainingCalculations) => {
  // add random 1 value to reduce return 1 values
  return getRandomNumber(2) + getRandomBool(.75);
}
