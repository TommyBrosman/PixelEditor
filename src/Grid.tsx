import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import './Grid.css';

export function Grid() {
  const [forceRender, setForceRender] = useState(false);
  const initialItemBoard = [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0]];
  const itemBoardRef = useRef(initialItemBoard);

  const items = [...Array(64)].map((_, i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const entry = itemBoardRef.current[y][x];
    const className = entry === 0 ? 'grid-item-black' : 'grid-item-white';
    const onClickCell = () => {
      // Flip the color
      itemBoardRef.current[y][x] = 1 - itemBoardRef.current[y][x];

      // Tell React to re-render (note: won't be needed if the grid is passed down from a parent component)
      setForceRender(!forceRender);
    }

    const key = `${x},${y}`;

    // biome-ignore lint/a11y/useKeyWithClickEvents: Non-useful event.
    return (<div className={className} key={key} onClick={onClickCell} />);
  });
  return (
    <div className="grid">
      {items}
    </div>
  );
}