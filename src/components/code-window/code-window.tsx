import { CodeGenerationConfig } from '@/config/app-config';
import { getFormattedNumber, getRandomBit, getRandomBool, getRandomNumber } from '@/utilities';
import { PersonEmoji } from '@/assets/images';
import { type RootState, type AppDispatch } from '@/redux';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import * as slice from '@/redux/code-window-slice';
import blockTypes from '../code-block/code-block.module.scss';
import classNames from 'classnames';
import CodeBlockModel from '@/types/code-block-model';
import CodeLine from '../code-line/code-line';
import CodeLineModel from '@/types/code-line-model';
import EraserIcon from '@/assets/icons/eraser-icon.svg?react';
import FastForwardIcon from '@/assets/icons/fast-forward-icon.svg?react';
import PauseIcon from '@/assets/icons/pause-icon.svg?react';
import PinOffIcon from '@/assets/icons/pin-off-icon.svg?react';
import PinOnIcon from '@/assets/icons/pin-on-icon.svg?react';
import PlayIcon from '@/assets/icons/play-icon.svg?react';
import React, { useEffect, useRef, useState } from 'react';
import RewindIcon from '@/assets/icons/rewind-icon.svg?react';
import styles from './code-window.module.scss';

/**
 * The CodeWindow component renders CodeLineModel objects, which
 * wrap CodeBlockModel objects. CodeBlocks are generated in bulk
 * and stored in the CodeLine, to be manipulated iteratively and
 * imitate typing. These models are used for accuracy and stored
 * in the CodeWindow state.
 */

/**
 * TODO: Description placeholder
 * @param {CodeLineModel[]} codeLines
 * @returns {number}
 */
const getCodeScopeCount = (codeLines: CodeLineModel[]): number => {
  const indentSize: number = codeLines[0] && codeLines[0].findCodeBlockSize(blockTypes.indent);
  let result = 0;

  for (const codeLine of codeLines) {
    if (codeLine.findCodeBlockSize(blockTypes.indent) === indentSize) result += 1;
    else break;
  }

  return result;
};

/**
 * TODO: Description placeholder
 * @param {CodeLineModel[]} codeLines
 * @param {number} codeScopeCount
 * @returns {number}
 */
const getNextIndentSize = (codeLines: CodeLineModel[], codeScopeCount: number): number => {
  const lastIndentSize: number = codeLines[0] && codeLines[0].findCodeBlockSize(blockTypes.indent);

  const shouldChangeIndent: boolean =
    codeScopeCount >= CodeGenerationConfig.CODE_SCOPE_MAX_COUNT ||
    codeScopeCount >= getRandomNumber({ max: CodeGenerationConfig.CODE_SCOPE_MAX_COUNT });
  if (!shouldChangeIndent) return lastIndentSize;

  // determine if scope closing tags were created on the last code line
  // (closing tags cannot be used to increase indent or spawn children)
  const wasValueBlockUsed: boolean = codeLines[0] && Boolean(codeLines[0].findCodeBlockSize(blockTypes.content));
  const wasScopeDecreased: boolean =
    codeLines[1] && codeLines[1].findCodeBlockSize(blockTypes.indent) > lastIndentSize;

  const canIncreaseIndent: boolean =
    lastIndentSize < CodeGenerationConfig.CODE_LINE_MAX_INDENT_SIZE && !wasValueBlockUsed && !wasScopeDecreased;
  const canDecreaseIndent: boolean = lastIndentSize > 1;
  if (canIncreaseIndent) return lastIndentSize + 1;
  if (canDecreaseIndent) return lastIndentSize - 1;
  return lastIndentSize;
};

// ------------ //
// react render //
// ------------ //

const CodeWindow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  /////////////////////////////////////////////////////////////////////////////
  // #region Component properties                                            //
  /////////////////////////////////////////////////////////////////////////////

  // TODO: refs! Only state if ui update

  const [codeLines, setCodeLines] = useState<CodeLineModel[]>([]);
  const [codeSpeed, setCodeSpeed] = useState<number>(CodeGenerationConfig.CODE_GENERATION_DEFAULT_SPEED);

  const [charCount, setCharCount] = useState<number>(0);
  const [lineCount, setLineCount] = useState<number>(0);

  const [isCodePaused, setIsCodePaused] = useState<boolean>(false);
  const [isFooterPinned, setIsFooterPinned] = useState<boolean>(false);
  const [isComponentReady, setIsComponentReady] = useState<boolean>(false);

  const [isWindowAnimatedX, setIsWindowAnimatedX] = useState(false);
  const [isWindowAnimatedY, setIsWindowAnimatedY] = useState(false);
  const [windowAnimationStack, setWindowAnimationStack] = useState('x,0'); // TODO: ref?

  const isHovered = useSelector((state: RootState) => state.codeWindow.isHovered);
  const isInitialized = useSelector((state: RootState) => state.codeWindow.isInitialized);
  const nameTransitionDuration = useSelector((state: RootState) => state.codeWindow.nameTransitionDuration);

  const isRedirectPopupRedirecting = useSelector((state: RootState) => state.redirectPopup.isRedirecting);
  const isRedirectPopupVisible = useSelector((state: RootState) => state.redirectPopup.isVisible);
  const isRouteChange = location.pathname !== '/';

  const updatedCodeLines = codeLines.slice();

  const formattedCharCount = getFormattedNumber(charCount);
  const formattedLineCount = getFormattedNumber(lineCount);

  const isFooterVisible: boolean = isFooterPinned || isHovered || isCodePaused;

  const footerClasses: string = classNames(
    styles.footer,
    { [styles.visible]: isFooterVisible },
    { [styles.pause]: isFooterVisible && isCodePaused },
    { [styles.debug]: isFooterVisible && !isCodePaused && codeLines.some((x) => x.isClicked) },
  );

  const nameClasses: string = classNames(styles.name, {
    [styles.visible]: !isFooterVisible && isInitialized && !codeLines.some((x) => x.isClicked),
  });

  const windowClasses: string = classNames(
    styles.wrapper,
    { [styles.hide]: !isInitialized && !isComponentReady },
    { [styles.fade]: !isInitialized && isComponentReady },
    { [styles.shakenX]: isWindowAnimatedX },
    { [styles.shakenY]: isWindowAnimatedY },
  );

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component properties                                         //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region Component methods                                               //
  /////////////////////////////////////////////////////////////////////////////

  const decreaseCodeSpeed = () => {
    if (isCodePaused) return;
    setCodeSpeed((x) => Math.min(x + 25, CodeGenerationConfig.CODE_GENERATION_MIN_SPEED));
  };

  const increaseCodeSpeed = () => {
    if (isCodePaused) return;
    setCodeSpeed((x) => Math.max(x - 25, CodeGenerationConfig.CODE_GENERATION_MAX_SPEED));
  };

  const onBlurOrMouseOut = () => {
    dispatch(slice.setIsCodeWindowHovered(false));
  };

  const onCodeLineClick = (key: string, isClicked: boolean) => {
    updatedCodeLines.find((x) => x.key === key)!.isClicked = isClicked;
    setCodeLines(updatedCodeLines);
  };

  const onFocusOrMouseOver = () => {
    if (isInitialized && nameTransitionDuration != styles.codeWindowNameTransitionDurationHover) {
      dispatch(slice.setNameTransitionDuration(styles.codeWindowNameTransitionDurationHover));
    }
    dispatch(slice.setIsCodeWindowHovered(true));
  };

  const onMouseClick = () => {
    getRandomBool({ probability: 0.5 }) ? setIsWindowAnimatedX(true) : setIsWindowAnimatedY(true);
  };

  const onPauseClick = () => setIsCodePaused((x) => !x);

  const onPinClick = () => setIsFooterPinned((x) => !x);

  const onResetClick = () => {
    updatedCodeLines
      .filter((x) => x.isClicked)
      .forEach((x) => {
        x.isClicked = false;
      });

    setIsCodePaused(false);
    setIsFooterPinned(false);
    setCodeLines(updatedCodeLines);
    setCodeSpeed(CodeGenerationConfig.CODE_GENERATION_DEFAULT_SPEED);
  };

  const onWindowAnimationEnd = () => {
    if (!isInitialized) {
      dispatch(slice.setIsCodeWindowInitialized(true));
    } else {
      setIsWindowAnimatedX(false);
      setIsWindowAnimatedY(false);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component methods                                            //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region Component render                                                //
  /////////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    if (isComponentReady || isRedirectPopupRedirecting || isRedirectPopupVisible || isRouteChange) return;
    setIsComponentReady(true);
  }, [isComponentReady, isRedirectPopupRedirecting, isRedirectPopupVisible, isRouteChange]);

  React.useEffect(() => {
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
        // Force the first line to imitate the HTML doctype declaration.
        case 0:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel({ blockType: blockTypes.openAngle }),
            new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: 3 }),
            new CodeBlockModel({ blockType: blockTypes.attribute }),
            new CodeBlockModel({ blockType: blockTypes.closeAngle }),
          );
          break;

        // Force the second line to imitate the HTML html tag.
        case 1:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel({ blockType: blockTypes.openAngle }),
            new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: 2 }),
            new CodeBlockModel({ blockType: blockTypes.closeAngle }),
          );
          break;

        // Force the third line to imitate the HTML body tag.
        case 2:
          nextCodeLine.codeBlocks.push(
            new CodeBlockModel({ blockType: blockTypes.indent }),
            new CodeBlockModel({ blockType: blockTypes.openAngle }),
            new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: 2 }),
            new CodeBlockModel({ blockType: blockTypes.closeAngle }),
          );
          break;

        // Generate a random line after the forced lines are created.
        default: {
          const lastCodeLine: CodeLineModel = updatedCodeLines[0];
          const codeScopeCount: number = getCodeScopeCount(updatedCodeLines);
          const lastIndentSize: number = lastCodeLine.findCodeBlockSize(blockTypes.indent);
          const nextIndentSize: number = getNextIndentSize(updatedCodeLines, codeScopeCount);

          const indentCodeBlock = new CodeBlockModel({
            blockType: blockTypes.indent,
            blockSize: nextIndentSize,
          });
          indentCodeBlock.currentSize = nextIndentSize; // set the current size to bypass the increment animation
          nextCodeLine.codeBlocks.push(indentCodeBlock);

          if (nextIndentSize < lastIndentSize) {
            // -------------------------------------------------------- //
            // indent was decreased, generate a closing tag from parent //
            // -------------------------------------------------------- //
            const parentCodeLine: CodeLineModel | undefined = codeLines.find(
              (x: CodeLineModel) => x.findCodeBlockSize(blockTypes.indent) === nextIndentSize,
            );

            const parentBlockSize: number =
              parentCodeLine?.findCodeBlockSize(blockTypes.tagName) || getRandomNumber({ min: 2, max: 3 });

            nextCodeLine.codeBlocks.push(
              new CodeBlockModel({ blockType: blockTypes.openAngle }),
              new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: parentBlockSize }),
              new CodeBlockModel({ blockType: blockTypes.closeAngle }),
            );
          } else {
            // -------------------------------------------------------- //
            // indent stayed the same or was increased, generate random //
            // -------------------------------------------------------- //
            const isScopeChangeImminent: boolean =
              codeScopeCount === CodeGenerationConfig.CODE_SCOPE_MAX_COUNT - 1;

            const useAttributeBlock: boolean = getRandomBool({ probability: 0.8 });
            const useStringBlock: boolean = useAttributeBlock && getRandomBool({ probability: 0.675 });
            const useValueBlock: boolean =
              !isScopeChangeImminent && getRandomBool({ probability: useStringBlock ? 0.25 : 0.5 });

            // get the remaining code line space available to generate blocks on
            // [2] = reserved space for the pair of start and close angle blocks
            let remainingCodeLineSize: number =
              CodeGenerationConfig.CODE_LINE_MAX_BLOCK_COUNT - indentCodeBlock.maximumSize - 2;
            if (useStringBlock) remainingCodeLineSize -= 1; // [1] used by operator block before string
            if (useValueBlock) remainingCodeLineSize -= 2; // [2] used by second start and close angles

            // get the remaining number of block size calculations to execute
            // [1] = reserved space for tag name (used twice on value blocks)
            let remainingCalculations: number = 1 + +useAttributeBlock + +useStringBlock + +useValueBlock * 2;

            // get the next size a generated code block can consume on the code line
            const getBlockSize = (codeBlockMaxSize = CodeGenerationConfig.CODE_BLOCK_MAX_SIZE) => {
              const averageSize: number = Math.floor(remainingCodeLineSize / remainingCalculations);
              const maximumSize: number = Math.min(averageSize, codeBlockMaxSize);
              let minimumSize = Math.min(1 + getRandomBit({ probability: 0.25 }), averageSize);

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
            nextCodeLine.codeBlocks.push(
              new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: nextTagNameSize }),
            );
            useAttributeBlock &&
              nextCodeLine.codeBlocks.push(
                new CodeBlockModel({ blockType: blockTypes.attribute, blockSize: getBlockSize() }),
              );
            useStringBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.operator }));
            useStringBlock &&
              nextCodeLine.codeBlocks.push(
                new CodeBlockModel({ blockType: blockTypes.string, blockSize: getBlockSize() }),
              );
            nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.closeAngle }));
            useValueBlock &&
              nextCodeLine.codeBlocks.push(
                new CodeBlockModel({ blockType: blockTypes.content, blockSize: getBlockSize() }),
              );
            useValueBlock && nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.openAngle }));
            useValueBlock &&
              nextCodeLine.codeBlocks.push(
                new CodeBlockModel({ blockType: blockTypes.tagName, blockSize: nextTagNameSize }),
              );
            useValueBlock &&
              nextCodeLine.codeBlocks.push(new CodeBlockModel({ blockType: blockTypes.closeAngle }));
          }

          break;
        }
      }

      updatedCodeLines.length = Math.min(codeLines.length, CodeGenerationConfig.CODE_LINE_MAX_SIBLING_COUNT - 1);
      updatedCodeLines.unshift(nextCodeLine);
      setLineCount((number) => number + 1);
    };

    const interval = setInterval(() => {
      if (isCodePaused || isWindowAnimatedX || isWindowAnimatedY || !isInitialized) {
        // Pause button was clicked. Generation is paused until resume button is clicked.
      } else if (activeCodeLine) {
        // Code line has code blocks that can be animated. Animate by updating their state data.
        animateCodeBlock();
      } else {
        // Code line has no code blocks that can be animated. Create the next code line / code blocks.
        if (!isHovered && !isFooterPinned && codeLines.length) {
          let isNextDirectionX;
          let nextStackCounter;

          const stackDirection = windowAnimationStack.split(',')[0];
          const stackCounter = Number(windowAnimationStack.split(',')[1]);

          // Code window has shaken too many times in the same direction.
          if (stackCounter === CodeGenerationConfig.CODE_WINDOW_SHAKE_MAX) {
            isNextDirectionX = stackDirection !== 'x';
            nextStackCounter = 1;
          } else {
            isNextDirectionX = getRandomBool({ probability: 0.5 });

            if ((isNextDirectionX && stackDirection === 'x') || (!isNextDirectionX && stackDirection !== 'x')) {
              nextStackCounter = stackCounter + 1;
            } else {
              nextStackCounter = 1;
            }
          }

          setWindowAnimationStack(`${isNextDirectionX ? 'x' : 'y'},${nextStackCounter}`);
          isNextDirectionX ? setIsWindowAnimatedX(true) : setIsWindowAnimatedY(true);
        }
        generateCodeLine();
      }
      setCodeLines(updatedCodeLines);
    }, codeSpeed);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [
    codeLines,
    codeSpeed,
    isCodePaused,
    isFooterPinned,
    isHovered,
    isInitialized,
    isWindowAnimatedX,
    isWindowAnimatedY,
    updatedCodeLines,
    windowAnimationStack,
  ]);

  return (
    <div
      className={windowClasses}
      onAnimationEnd={onWindowAnimationEnd}
      onBlur={onBlurOrMouseOut}
      onFocus={onFocusOrMouseOver}
      onMouseOut={onBlurOrMouseOut}
      onMouseOver={onFocusOrMouseOver}
      tabIndex={0}
    >
      <div className={styles.title}>
        <div onClick={onMouseClick} />
        <div onClick={onMouseClick} />
        <div onClick={onMouseClick} />
        <div onClick={onMouseClick} />
      </div>
      <div className={styles.body} tabIndex={-1}>
        <div className={styles.code} tabIndex={-1}>
          {codeLines.map(({ codeBlocks, key, isClicked }, index) => (
            <CodeLine
              key={key}
              codeBlocks={codeBlocks.filter((x) => x.isVisible)}
              codeLineId={key}
              isActiveLine={!index}
              isClicked={isClicked}
              onClick={(isClicked) => onCodeLineClick(key, isClicked)}
            />
          ))}
        </div>
        <div className={nameClasses} style={{ transitionDuration: nameTransitionDuration }}>
          <img src={PersonEmoji} alt="person emoji" />
          <span>Austin Williams</span>
        </div>
      </div>
      <div className={footerClasses}>
        <button onClick={onPinClick} tabIndex={-1} type="button">
          <div className={styles.tooltip}>Pin</div>
          {isFooterPinned ? <PinOffIcon /> : <PinOnIcon />}
        </button>
        <button onClick={decreaseCodeSpeed} tabIndex={-1} type="button">
          <div className={styles.tooltip}>Slow down</div>
          <RewindIcon />
        </button>
        <button onClick={onPauseClick} tabIndex={-1} type="button">
          <div className={styles.tooltip}>{isCodePaused ? 'Play' : 'Pause'}</div>
          {isCodePaused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button onClick={increaseCodeSpeed} tabIndex={-1} type="button">
          <div className={styles.tooltip}>Speed up</div>
          <FastForwardIcon />
        </button>
        <span>{isCodePaused ? 'Paused' : `${codeSpeed}ms`}</span>
        <button onClick={onResetClick} tabIndex={-1} type="button">
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

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component render                                             //
  /////////////////////////////////////////////////////////////////////////////
};

export default CodeWindow;
