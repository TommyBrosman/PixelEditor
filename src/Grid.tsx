import React, { useEffect, useState } from 'react';
import './Grid.css';
import { ActionName, thunkConnectToFluid, thunkSetCell } from './store/Reducers';
import { useAppDispatch, useAppSelector } from './store/Hooks';
import type { PixelEditorSchema } from './store/PixelEditorStorage';
import type { TreeView } from 'fluid-framework';

export function Grid() {
	const [_, setPixelEditorTreeView] = useState<TreeView<typeof PixelEditorSchema> | undefined>(undefined);
	const state = useAppSelector(state => state);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(thunkConnectToFluid(dispatch))
			.then(treeView => setPixelEditorTreeView(treeView));
	});

	const items = [...Array(64)].map((_, i) => {
		const x = i % 8;
		const y = Math.floor(i / 8);
		const entry = state.itemBoard[y][x];

		const onClickCell = () => {
			/*
			dispatch(thunkSetCell(dispatch, {
				x,
				y,
				value: 1 - entry
			})*/
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
