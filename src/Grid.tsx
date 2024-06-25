import React, { useEffect } from 'react';
import './Grid.css';
import { useAppDispatch, useAppSelector } from './store/Hooks';
import { boardHeight, boardWidth } from './store/InitialItemBoard';
import { connectToFluid, setCell } from './store/Reducers';

export function Grid() {
	const isLoaded = useAppSelector(state => state.isLoaded);
	const itemBoard = useAppSelector(state => state.itemBoard);
	const dispatch = useAppDispatch();

	// Only connect once
	useEffect(() => {
		if (!isLoaded) {
			dispatch(connectToFluid());
		}
	}, [isLoaded, dispatch]);

	// Populate the board
	const items = itemBoard.length > 0
		? [...Array(boardWidth * boardHeight)].map((_, i) => {
			const x = i % boardWidth;
			const y = Math.floor(i / boardWidth);
			const entry = itemBoard[y][x];

			const onClickCell = () => {
				// Toggle the color between white and black
				dispatch(setCell({
					x,
					y,
					value: 1 - entry
				}));
			}

			const key = `${x},${y}`;
			const className = entry === 0 ? 'grid-item-black' : 'grid-item-white';

			// biome-ignore lint/a11y/useKeyWithClickEvents: Non-useful event.
			return <div className={className} key={key} onClick={onClickCell} />;
		}) : [];

	return (
		<div className="grid">
			{items}
		</div>
	);
}
