import "./CodeBlock.css";
import classNames from 'classnames';

export default function CodeBlock(props) {
  const { blockType, currentSize, isColored, isVisible } = props;

  const codeBlockClasses = classNames(
    {[blockType]: isVisible},
    {[`size-${currentSize}`]: isVisible && currentSize > 1},
    {"color": isColored}
  );

  return (
    <div className={codeBlockClasses}/>
  );
}
