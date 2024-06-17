/**
 * The initial board contents.
 */
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
	isLoaded: boolean;
	itemBoard: number[][];
};

/**
 * The initial app state. Copied but not modified directly.
 */
export const initialAppState: AppState = {
	isLoaded: false,
	itemBoard: initialItemBoard
};
