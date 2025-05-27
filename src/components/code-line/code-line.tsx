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
  const isHoveringRef = useRef<boolean>(false); // TODO: Might need to be state

  const lineNumberClasses = classNames(
    styles['line-number'],
    { [styles['clicked']]: isClicked },
    { [styles['hovered']]: isHoveringRef.current && !isClicked },
  );

  return (
    <div
      className={styles['code-line']}
      onBlur={() => (isHoveringRef.current = false)}
      onClick={() => onClick(!isClicked)}
      onFocus={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
      onMouseOver={() => (isHoveringRef.current = true)}
      role="presentation"
    >
      <div className={lineNumberClasses} />
      {codeBlocks.map(({ blockType, currentSize, key }, index) => {
        const isLastBlock = index === codeBlocks.length - 1;
        const isActiveBlock = isActiveLine && isLastBlock;
        const isColoredBlock = isClicked || isHoveringRef.current;

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
