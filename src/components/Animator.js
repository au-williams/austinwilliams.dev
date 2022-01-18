import "./Animator.css";
import BLOCK_TYPES from "../constants/BlockTypes";
import CodeBlockModel from "../models/CodeBlock";
import CodeLineModel from "../models/CodeLine";
import CodeLine from "./CodeLine";
import React, { useEffect, useState } from "react";
import { animatorConfig } from "../_config";
import { getRandomBool, getRandomNumber } from "../utils";

const CODE_LINE_MAX_INDENT_SIZE = animatorConfig.codeLineMaxIndentSize;
const CODE_LINE_MIN_INDENT_SIZE = animatorConfig.codeLineMinIndentSize;
const CODE_LINE_MAX_TOTAL_SIZE = animatorConfig.codeLineMaxTotalSize;
const CODE_BLOCK_MAX_SIZE = animatorConfig.codeBlockMaxSize;

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
        activeCodeLine.activeCodeBlock.update();
      }

      else {
        // ----------------------------------------- //
        // animator is generating the next code line //
        // ----------------------------------------- //
        const lastCodeLine = updatedCodeLines[0];

        const nextCodeLine = new CodeLineModel(
          new CodeBlockModel(BLOCK_TYPES.INDENT, getIndentSize(lastCodeLine.indentSize)),
          new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
          new CodeBlockModel(BLOCK_TYPES.TAG_NAME, getRandomNumber(Math.round(CODE_BLOCK_MAX_SIZE / 2))),
        );

        // determine what blocks should be added
        const useAttributeBlock = getRandomBool();
        const useAttributeBlockWithValue = useAttributeBlock && getRandomBool(.75);
        const useContentBlock = getRandomBool();
        const useContentBlockWithOperator = useContentBlock && !useAttributeBlockWithValue && getRandomBool(.75);

        let remainingCodeLineSize =
          CODE_LINE_MAX_TOTAL_SIZE -
          // sum used size — attribute and content blocks add operator, add 1 for implied close angle
          (nextCodeLine.maximumSize + useAttributeBlockWithValue + useContentBlockWithOperator + 1) -
          // include the duplicated close name tag inserted by content type code blocks
          (useContentBlock ? nextCodeLine.getCodeBlockSizes(BLOCK_TYPES.TAG_NAME) : 0);

        let remainingCalculations =
          // how many blocks we still need to generate size for — (useContentBlock * 2) for its close name tag
          useAttributeBlock + useAttributeBlockWithValue + (useContentBlock * 2) + useContentBlockWithOperator;

        // divide remaining size by remaining calculations to determine each code blocks maximum size to stay within size limits
        const getAvailableSize = () => Math.min(Math.floor(remainingCodeLineSize / remainingCalculations), CODE_BLOCK_MAX_SIZE);

        if (useAttributeBlock && remainingCodeLineSize > 0) {
          const blockSize = getRandomNumber(getAvailableSize());
          nextCodeLine.addCodeBlocks(new CodeBlockModel(BLOCK_TYPES.ATTRIBUTE, blockSize));
          remainingCodeLineSize -= blockSize;
          remainingCalculations -= 1;
        }

        if (useAttributeBlockWithValue && remainingCodeLineSize > 0) {
          const blockSize = getRandomNumber(getAvailableSize());
          nextCodeLine.addCodeBlocks(new CodeBlockModel(BLOCK_TYPES.OPERATOR), new CodeBlockModel(BLOCK_TYPES.STRING, blockSize));
          remainingCodeLineSize -= blockSize;
          remainingCalculations -= 1;
        }

        nextCodeLine.addCodeBlocks(
          new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
          // remainingCodeLineSize is already reduced
        );

        if (useContentBlock && remainingCodeLineSize > 0) {
          nextCodeLine.addCodeBlocks(
            new CodeBlockModel(BLOCK_TYPES.VALUE, getRandomNumber(getAvailableSize()))
          );

          if (useContentBlockWithOperator && remainingCodeLineSize > 0) {
            nextCodeLine.addCodeBlocks(
              new CodeBlockModel(BLOCK_TYPES.OPERATOR),
              new CodeBlockModel(BLOCK_TYPES.VALUE, getRandomNumber(getAvailableSize())),
            )
          }

          nextCodeLine.addCodeBlocks(
            new CodeBlockModel(BLOCK_TYPES.START_ANGLE),
            new CodeBlockModel(BLOCK_TYPES.TAG_NAME, nextCodeLine.getCodeBlockSizes(BLOCK_TYPES.TAG_NAME)),
            new CodeBlockModel(BLOCK_TYPES.CLOSE_ANGLE)
          );

          remainingCodeLineSize -= nextCodeLine.getCodeBlockSizes(BLOCK_TYPES.VALUE);
          remainingCalculations -= (2 + useContentBlockWithOperator);
        }

        if (updatedCodeLines.length >= animatorConfig.codeLineMaxTotalCount) {
          updatedCodeLines.pop();
        }

        updatedCodeLines.unshift(nextCodeLine);
      }

      setCodeLines(updatedCodeLines);
    }, animatorConfig.animatorGenerateSpeed);

    return () => clearInterval(interval);
  }, [codeLines]);

  return (
    <header id='animator-wrapper'>
      <div id='animator-title'>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
      <div id='animator-body'>
        <div id='animator-name'>👨‍💻 Austin Williams</div>
        <div id='animator-code'>
          <div id="animator-spacer"/>
          {codeLines.map(codeLine =>
            <CodeLine
              key={codeLine.key}
              isActive={codeLine.isActive}
              codeBlocks={codeLine.codeBlocks}
            />)}
        </div>
      </div>
    </header>
  );
}

const getIndentSize = (lastIndentSize) => {
  if (CODE_LINE_MIN_INDENT_SIZE == lastIndentSize)
    return lastIndentSize + getRandomBool(.5);
  if (CODE_LINE_MAX_INDENT_SIZE == lastIndentSize)
    return lastIndentSize - getRandomBool(.5);

  const randomNumber = getRandomNumber(4);
  if (randomNumber == 3) return lastIndentSize + 1;
  if (randomNumber == 4) return lastIndentSize - 1;
  return lastIndentSize;
}