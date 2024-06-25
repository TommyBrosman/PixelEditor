import React from "react";
import { expect } from 'chai';

// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/jsdom'
import { render } from "@testing-library/react";
import Grid from "./Grid";
import { boardHeight, boardWidth } from "./store/InitialItemBoard";

test("Displays expected text and contains expected link", async (): Promise<void> => {
	const { container } = render(<Grid/>);
	const cells = Array.from(await container.querySelectorAll('.grid-item-black,.grid-item.white'));
	expect(cells).length(boardWidth * boardHeight);
});
