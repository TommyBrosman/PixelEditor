import React from 'react';
import './Grid.css';

export function Grid() {
    const itemBoard = [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0]];
    const items = [...Array(64)].map((_, i) => {
      const entry = itemBoard[Math.floor(i / 8)][i % 8];
      const className = entry === 0 ? 'grid-item-black' : 'grid-item-white';
      return (<div className={className} key={i}></div>);
    });
    return (
      <div className="grid">
        {items}
      </div>
    );
}