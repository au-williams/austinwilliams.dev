import { setIsHovered } from '../../redux/code-line-slice';
import { type RootState, type AppDispatch } from '../../redux';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import CodeBlock from '../code-block/code-block';
import CodeBlockModel from '../../types/code-block-model';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './code-line.module.scss';

/**
 * @returns {React.JSX.Element}
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
}) => {
  // Load the state from Redux.
  const dispatch = useDispatch<AppDispatch>();
  const isHovered = useSelector(
    (state: RootState) => state.codeLine[codeLineId]?.isHovered ?? false,
  );

  const lineNumberClasses = classNames(
    styles.lineNumber,
    { [styles.clicked]: isClicked },
    { [styles.hovered]: isHovered && !isClicked },
  );

  return (
    <div
      className={styles.codeLine}
      onClick={() => onClick(!isClicked)}
      onFocus={() => dispatch(setIsHovered(codeLineId, true))}
      onMouseLeave={() => dispatch(setIsHovered(codeLineId, false))}
      onMouseOver={() => dispatch(setIsHovered(codeLineId, true))}
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

CodeLine.propTypes = {
  codeBlocks: PropTypes.arrayOf(
    PropTypes.shape({
      blockType: PropTypes.string.isRequired,
      currentSize: PropTypes.number.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isActiveLine: PropTypes.bool.isRequired,
  isClicked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CodeLine;
