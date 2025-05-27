import { AppDispatch, RootState } from '@/redux';
import { useDispatch, useSelector } from 'react-redux';
import * as slice from '@/redux/code-line-slice';
import classNames from 'classnames';
import CodeBlock from '@/components/code-block/code-block';
import CodeBlockModel from '@/types/code-block-model';
import React, { useRef } from 'react';
import styles from './code-line.module.scss';

// TODO: improve hover style of breakpoint

/**
 *
 */
const CodeLine = ({
  codeBlocks,
  codeLineId,
  isActiveLine,
  isClicked,
  onClick,
}: {
  codeBlocks: CodeBlockModel[];
  codeLineId: string;
  isActiveLine: boolean;
  isClicked: boolean;
  onClick: (param: boolean) => void;
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const isHovered = useSelector((state: RootState) => state.codeLine[codeLineId]?.isHovered ?? false);

  const lineNumberClasses = classNames(
    styles['line-number'],
    { [styles['clicked']]: isClicked },
    { [styles['hovered']]: isHovered && !isClicked },
  );

  return (
    <div
      className={styles['code-line']}
      onBlur={() => dispatch(slice.setIsHovered(codeLineId, false))}
      onClick={() => onClick(!isClicked)}
      onFocus={() => dispatch(slice.setIsHovered(codeLineId, true))}
      onMouseLeave={() => dispatch(slice.setIsHovered(codeLineId, false))}
      onMouseOver={() => dispatch(slice.setIsHovered(codeLineId, true))}
      role="presentation"
    >
      <div className={lineNumberClasses} />
      {codeBlocks.map(({ blockType, currentSize, key }, index) => {
        const isLastBlock = index === codeBlocks.length - 1;
        const isActiveBlock = isActiveLine && isLastBlock;
        const isColoredBlock = isClicked || isHovered;

        return (
          <CodeBlock
            key={key}
            blockId={key}
            blockType={blockType}
            currentSize={currentSize}
            isActiveBlock={isActiveBlock}
            isColoredBlock={isColoredBlock}
          />
        );
      })}
    </div>
  );
};

export default CodeLine;
