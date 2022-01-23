import "./CodeBlock.css";
import classNames from 'classnames';

const CodeBlock = ({ blockType, currentSize, isColored, isVisible }) => {
  return (
    isVisible && <div className={classNames(
      [blockType],
      {"color": isColored},
      {[`size-${currentSize}`]: currentSize > 1}
    )}/>
  );
};

export default CodeBlock;
