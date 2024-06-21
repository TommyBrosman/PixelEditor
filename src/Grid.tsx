import React, { useEffect } from 'react';
import './Grid.css';
import { thunkConnectToFluid, thunkSetCell } from './store/Reducers';
import { useAppDispatch, useAppSelector } from './store/Hooks';
import { boardHeight, boardWidth } from './store/InitialItemBoard';
import { Cell } from './Cell';

export function Grid() {
	const isLoaded = useAppSelector(state => state.isLoaded);
	const itemBoard = useAppSelector(state => state.itemBoard);
	const dispatch = useAppDispatch();

	// Only connect once
	useEffect(() => {
		if (!isLoaded) {
			dispatch(thunkConnectToFluid)();
		}
	}, [isLoaded, dispatch]);

	// Populate the board
	const items = itemBoard.length > 0
		? [...Array(boardWidth * boardHeight)].map((_, i) => {
			const x = i % boardWidth;
			const y = Math.floor(i / boardWidth);
			const value = itemBoard[y][x];

			const onClickCell = () => {
				// Toggle the color between white and black
				dispatch(thunkSetCell)(
					x,
					y,
					1 - value
				);
			}

			const key = `${x},${y}`;
			return <Cell key={key} onClickCell={onClickCell} value={value}/>
		}) : [];

	return (
		<div className="grid">
			{items}
		</div>
	);
}

export default Grid;
