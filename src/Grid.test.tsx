import React from "react";
import { expect } from "chai";

// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/dom"
import { fireEvent, render, waitFor } from "@testing-library/react";
import Grid from "./Grid";
import { boardHeight, boardWidth, initialItemBoard } from "./store/InitialItemBoard";
import { Provider } from "react-redux";
import { setupStore } from "./store/Store";

describe("Tests for Grid", () => {
	const emptyItemBoard: number[][] = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0]
	];

	it("Displays expected text and contains expected link", async (): Promise<void> => {
		const store = setupStore({ app: { isLoaded: true, itemBoard: initialItemBoard } });
		const { container } = render(
			<Provider store={store}>
				<Grid/>
			</Provider>);
		const cells = Array.from(container.querySelectorAll('.grid-item-black,.grid-item-white'));
		expect(cells).length(boardWidth * boardHeight);
	});

	it("Toggles a cell", async (): Promise<void> => {
		const store = setupStore({ app: { isLoaded: true, itemBoard: emptyItemBoard } });
		const { container } = render(
			<Provider store={store}>
				<Grid/>
			</Provider>);
		const blackCellsBefore = Array.from(container.querySelectorAll('.grid-item-black'));
		const whiteCellsBefore = Array.from(container.querySelectorAll('.grid-item-white'));
		fireEvent.click(blackCellsBefore[0]);

		waitFor(() => {
			const whiteCellsAfter = Array.from(container.querySelectorAll('.grid-item-white'));
			expect(whiteCellsBefore).length(whiteCellsAfter.length + 1);
		});
	});
});
