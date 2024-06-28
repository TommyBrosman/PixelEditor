import { fireEvent, render, waitFor } from "@testing-library/react";
import { expect } from "chai";
import React from "react";
import { Provider } from "react-redux";
import Grid from "./Grid";
import { setupStore } from "./store/Store";
import type { PixelEditorSchema, SharedTreeConnection } from "./store/Model";
import { emptyItemBoard } from "./GridTestHelper";
import type { TreeView } from "fluid-framework";

describe("Integration tests for Grid", () => {
	it("Toggling a cell in the UI sets the corresponding cell in the backing Fluid Tree DDS", async (): Promise<void> => {
		const sharedTreeConnection: SharedTreeConnection = { pixelEditorTreeView: undefined };
		const store = setupStore(
			{ app: { isLoaded: true, itemBoard: emptyItemBoard } },
			sharedTreeConnection);
		const { container } = render(
			<Provider store={store}>
				<Grid/>
			</Provider>);
		const blackCellsBefore = Array.from(container.querySelectorAll('.grid-item-black'));
		fireEvent.click(blackCellsBefore[0]);

		waitFor(() => {
			expect(sharedTreeConnection.pixelEditorTreeView).not.undefined;
		});

		waitFor(() => {
			const treeView = sharedTreeConnection.pixelEditorTreeView as TreeView<typeof PixelEditorSchema>;
			const cellValues = Array.from(treeView.root.board.values());
			const whiteCellCountInModel = cellValues.reduce((total, current) => total + current);
			expect(whiteCellCountInModel).equals(1);
		});
	});
});
