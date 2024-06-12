import { Tree, type TreeView } from "fluid-framework";
import { type PixelEditorSchema, getBoardFromSharedTree, setBoardInSharedTree, start } from "./PixelEditorStorage";
import { type ThunkAction, configureStore } from "@reduxjs/toolkit";

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
	pixelEditorTreeView: TreeView<typeof PixelEditorSchema> | undefined;
};

/**
 * The initial app state. Copied but not modified directly.
 */
export const initialAppState: AppState = {
	itemBoard: initialItemBoard,
	pixelEditorTreeView: undefined
};

/**
 * All supported action names.
 */
export enum ActionName {
	TOGGLE_CELL_VALUE = "TOGGLE_CELL_VALUE",
	SUBSCRIBE_TO_FLUID_EVENTS = "SUBSCRIBE_TO_FLUID_EVENTS",
	CONNECT_TO_FLUID = "CONNECT_TO_FLUID",
	APPLY_REMOTE_TREE_CHANGE = "APPLY_REMOTE_TREE_CHANGE",
	BROADCAST_LOCAL_TREE_CHANGE = "BROADCAST_LOCAL_TREE_CHANGE"
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
export interface ConnectToFluidAction {
	type: ActionName.CONNECT_TO_FLUID;
	pixelEditorTreeView: TreeView<typeof PixelEditorSchema>;
}

/**
 * An action that sets the value of a cell on the board. Triggered by a remote change.
 */
export interface ApplyRemoteTreeChangeAction {
	type: ActionName.APPLY_REMOTE_TREE_CHANGE;
	board: number[][];
}

export interface BroadcastLocalTreeChangeAction {
	type: ActionName.BROADCAST_LOCAL_TREE_CHANGE;
	board: number[][];
}

/**
 * All actions supported by the root reducer.
 */
export type ActionTypes = ToggleCellValueAction | ConnectToFluidAction | ApplyRemoteTreeChangeAction | BroadcastLocalTreeChangeAction;

/**
 * The root reducer for the application.
 * @param state The current state.
 * @param action The action being applied to the state.
 * @returns The new state.
 */

// biome-ignore lint/style/useDefaultParameterLast: <explanation>
export function appReducer(state: AppState = initialAppState, action: ActionTypes): AppState {
	switch (action.type) {
		case ActionName.TOGGLE_CELL_VALUE:
			return toggleCellValue(state, action);
		case ActionName.CONNECT_TO_FLUID:
			return connectToFluid(state, action);
		case ActionName.APPLY_REMOTE_TREE_CHANGE:
			return applyRemoteTreeChange(state, action);
		case ActionName.BROADCAST_LOCAL_TREE_CHANGE:
			return broadcastLocalTreeChange(state, action);
		default:
			return state;
	}
}

export const store = configureStore({
	reducer: appReducer
});

// Get the type of our store variable as well as the RootState type that matches the store and an AppDispatch type that includes
// the thunk dispatcher signature.
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

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

export const thunkConnectToFluid =
	(dispatch, getState): ThunkAction<void, AppState, unknown, ActionTypes> =>
		async dispatch => {
			const pixelEditorTreeView = await start();
			Tree.on(pixelEditorTreeView.root, "treeChanged", () => {
				const currentBoard = getBoardFromSharedTree(pixelEditorTreeView)
				dispatch({
					type : ActionName.APPLY_REMOTE_TREE_CHANGE,
					board: currentBoard
				});
			});

			dispatch({
				type: ActionName.CONNECT_TO_FLUID,
				pixelEditorTreeView
			});
		}


function connectToFluid(state: AppState, action: ConnectToFluidAction): AppState {
	const { pixelEditorTreeView } = action;

	// Preserve other elements of the state object
	const { pixelEditorTreeView: _, ...other } = state;
	return { pixelEditorTreeView, ...other };
}

function broadcastLocalTreeChange(state: AppState, action: BroadcastLocalTreeChangeAction): AppState {
	if (state.pixelEditorTreeView === undefined) {
		// TODO: Should this throw?
		return state;
	}
	setBoardInSharedTree(state.pixelEditorTreeView, action.board);
	return state;
}

function applyRemoteTreeChange(state: AppState, action: ApplyRemoteTreeChangeAction): AppState {
	// Preserve other elements of the state object
	const { itemBoard, ...other } = state;
	return { itemBoard: action.board, ...other };
}
