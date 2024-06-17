export const initialItemBoard: number[][] = [
	[0, 0, 0, 1, 1, 0, 0, 0],
	[0, 0, 1, 0, 0, 1, 0, 0],
	[0, 0, 1, 0, 0, 1, 0, 0],
	[0, 1, 0, 0, 0, 0, 1, 0],
	[1, 0, 0, 0, 0, 0, 0, 1],
	[0, 0, 0, 1, 1, 0, 0, 0],
	[0, 0, 1, 0, 0, 1, 0, 0],
	[0, 0, 1, 0, 0, 1, 0, 0]
];

/**
 * Holds app state.
 */
export interface AppState {
	itemBoard: number[][];
};

/**
 * The initial app state. Copied but not modified directly.
 */
export const initialAppState: AppState = {
	itemBoard: initialItemBoard
};
