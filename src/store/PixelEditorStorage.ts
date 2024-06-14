/* eslint-disable no-restricted-globals */
import { SharedTree, TreeConfiguration, SchemaFactory, type TreeView } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client/internal";

const client = new TinyliciousClient();
const containerSchema = {
    initialObjects: { pixelEditorTree: SharedTree },
};

// The string passed to the SchemaFactory should be unique
const factory: SchemaFactory = new SchemaFactory("PixelEditorSample");

// Defines the root schema.
export class PixelEditorSchema extends factory.object("PixelEditor-1.0.0", {
    board: factory.map(factory.number)
}) {}

const treeConfiguration = new TreeConfiguration(
    PixelEditorSchema,
    () =>
        new PixelEditorSchema({
            board: new Map([
                ["0, 0", 1]
            ]),
        }),
);

const createNewPixelEditor = async (): Promise<{id: string, pixelEditorTreeView: TreeView<typeof PixelEditorSchema>}> => {
	const { container } = await client.createContainer(containerSchema);
	const pixelEditorTreeView = container.initialObjects.pixelEditorTree.schematize(treeConfiguration);
	const id = await container.attach();
	return { id, pixelEditorTreeView };
};

const loadExistingPixelEditor = async (id: string): Promise<TreeView<typeof PixelEditorSchema>> => {
	const { container } = await client.getContainer(id, containerSchema);
	const pixelEditorTreeView = container.initialObjects.pixelEditorTree.schematize(treeConfiguration);
    return pixelEditorTreeView;
};

/**
 * Join or start a Shared Tree session.
 * @returns The Tree View.
 */
export const start = async (): Promise<TreeView<typeof PixelEditorSchema>> => {
    let pixelEditorTreeView: TreeView<typeof PixelEditorSchema> | undefined;
	if (location.hash) {
		pixelEditorTreeView = await loadExistingPixelEditor(location.hash.substring(1));
	} else {
		const result = await createNewPixelEditor();
		location.hash = result.id;
        pixelEditorTreeView = result.pixelEditorTreeView;
	}

    return pixelEditorTreeView;
}

/**
 * Create a key for indexing into the board Shared Tree.
 * @param x x index
 * @param y y index
 * @returns The cell value.
 */
export const getKey = (x: number, y: number) => `${x},${y}`;

/**
 * Get the current board from Shared Tree.
 * @param pixelEditorTreeView The Tree View to read from.
 * @returns The board.
 */
export const getBoardFromSharedTree = (pixelEditorTreeView: TreeView<typeof PixelEditorSchema>): number[][] => {
	const board: number[][] = new Array();
	for (let y = 0; y < 8; y++) {
		const row = new Array();
		for (let x = 0; x < 8; x++) {
			const cell = pixelEditorTreeView.root.board.get(getKey(x, y));
			row.push(cell);
		}
		board.push(row);
	}

	return board;
}

/**
 * Set the copy of the board in Shared Tree.
 * @param pixelEditorTreeView The Tree View whose underlying tree is to be modified.
 * @param board The board.
 */
export const setBoardInSharedTree = (pixelEditorTreeView: TreeView<typeof PixelEditorSchema>, board: number[][]): void => {
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			const cell = board[y][x];
			pixelEditorTreeView.root.board.set(getKey(x, y), cell);
		}
	}
}

export const setCell = (pixelEditorTreeView: TreeView<typeof PixelEditorSchema>, x: number, y: number, value: number): void => {
	pixelEditorTreeView.root.board.set(getKey(x, y), value);
}
