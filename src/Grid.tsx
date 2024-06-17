import React, { useEffect, useMemo } from 'react';
import './Grid.css';
import { thunkConnectToFluid, thunkSetCell } from './store/Reducers';
import { useAppDispatch, useAppSelector } from './store/Hooks';
import { initialItemBoard } from './store/State';

export function Grid() {
	const state = useAppSelector(state => state);
	const dispatch = useMemo(() => useAppDispatch(), []);

	// Only connect once
	useEffect(() => {
		dispatch(thunkConnectToFluid)(initialItemBoard);
	}, [dispatch]);

	// Populate the board
	const items = [...Array(64)].map((_, i) => {
		const x = i % 8;
		const y = Math.floor(i / 8);
		const entry = state.itemBoard[y][x];

		const onClickCell = () => {
			// Toggle the color between white and black
			dispatch(thunkSetCell)(
				x,
				y,
				1 - entry
			);
		}

		const key = `${x},${y}`;
		const className = entry === 0 ? 'grid-item-black' : 'grid-item-white';

		// biome-ignore lint/a11y/useKeyWithClickEvents: Non-useful event.
		return <div className={className} key={key} onClick={onClickCell} />;
	});

	return (
		<div className="grid">
			{items}
		</div>
	);
}
