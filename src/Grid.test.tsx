import React from "react";
import { expect } from 'chai';

// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/dom'
import { render } from "@testing-library/react";
import Grid from "./Grid";
import { boardHeight, boardWidth } from "./store/InitialItemBoard";
import { Provider } from "react-redux";
import { store } from "./store/Store";

describe("Tests for Grid", () => {
	it("Displays expected text and contains expected link", async (): Promise<void> => {
		const { container } = render(
			<Provider store={store}>
				<Grid/>
			</Provider>);
		const cells = Array.from(await container.querySelectorAll('.grid-item-black,.grid-item.white'));
		expect(cells).length(boardWidth * boardHeight);
	});
});
