
const initialItemBoard: number[][] = [
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

/**
 * All supported action names.
 */
export enum ActionName {
	TOGGLE_CELL_VALUE = "TOGGLE_CELL_VALUE",
	SUBSCRIBE_TO_FLUID_EVENTS = "SUBSCRIBE_TO_FLUID_EVENTS"
};

/**
 * An action that toggles the value of a cell on the board.
 */
export interface ToggleCellValueAction {
	type: ActionName.TOGGLE_CELL_VALUE;
	x: number;
	y: number;
}

/**
 * Sets up the Fluid event subscriptions.
 */
export interface SubscribeToFluidEventsAction {
	type: ActionName.SUBSCRIBE_TO_FLUID_EVENTS;
}

/**
 * All actions supported by the root reducer.
 */
export type Action = ToggleCellValueAction;

/**
 * The root reducer for the application.
 * @param state The current state.
 * @param action The action being applied to the state.
 * @returns The new state.
 */
export function appReducer(state: AppState, action: Action): AppState | undefined {
	switch (action.type) {
		case ActionName.TOGGLE_CELL_VALUE:
			return toggleCellValue(state, action);
		default:
			return state;
	}
}

function toggleCellValue(state: AppState, action: ToggleCellValueAction): AppState {
	const { x, y } = action;

	// Copy all row references. `itemBoard` now points to the rows of the previous version.
	const newItemBoard = [...state.itemBoard];

	// Clone the target row's elements so that we don't modify the previous version
	newItemBoard[y] = [...(state.itemBoard[y])];

	// Toggle the cell
	newItemBoard[y][x] = 1 - state.itemBoard[y][x];

	// Preserve other elements of the state object
	const { itemBoard, ...other } = state;
	return { itemBoard: newItemBoard, ...other };
}
