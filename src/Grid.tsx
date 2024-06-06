import React from 'react';
import './Grid.css';
import { appReducer, ActionName, initialAppState } from './Reducers';

export function Grid() {
	const [state, dispatch] = React.useReducer(appReducer, { ...initialAppState });

	const items = [...Array(64)].map((_, i) => {
		const x = i % 8;
		const y = Math.floor(i / 8);
		const entry = state.itemBoard[y][x];

		const onClickCell = () => {
			dispatch({
				type: ActionName.TOGGLE_CELL_VALUE,
				x,
				y
			});
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
