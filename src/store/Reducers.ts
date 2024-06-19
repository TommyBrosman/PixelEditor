import { Tree, type TreeView } from "fluid-framework";
import { type PixelEditorSchema, getBoardFromSharedTree, start, setCell, type SharedTreeConnection } from "./Model";
import { type AppState, initialAppState } from "./State";

/**
 * All supported action names.W
 */
export enum ActionName {
	CONNECT_TO_FLUID = "CONNECT_TO_FLUID",
	APPLY_REMOTE_TREE_CHANGE = "APPLY_REMOTE_TREE_CHANGE",
	MARK_IS_CONNECTED = "MARK_IS_CONNECTED"
};

/**
 * An action that sets the value of a cell on the board. Triggered by a remote change.
 */
export interface ApplyRemoteTreeChangeAction {
	type: ActionName.APPLY_REMOTE_TREE_CHANGE;
	board: number[][];
}

export interface MarkIsConnected {
	type: ActionName.MARK_IS_CONNECTED
}

/**
 * All actions supported by the root reducer.
 */
export type ActionTypes = ApplyRemoteTreeChangeAction | MarkIsConnected;

/**
 * The root reducer for the application.
 * @param state The current state.
 * @param action The action being applied to the state.
 * @returns The new state.
 */

// biome-ignore lint/style/useDefaultParameterLast: <explanation>
export function appReducer(state: AppState = initialAppState, action: ActionTypes): AppState {
	switch (action.type) {
		case ActionName.APPLY_REMOTE_TREE_CHANGE:
			return applyRemoteTreeChange(state, action);
		case ActionName.MARK_IS_CONNECTED:
			return markIsConnected(state, action);
		default:
			return state;
	}
}

/**
 * Thunk. Connects to the Fluid session. Steps:
 * - Join or create a session
 * - Wire up events that dispatch reducers when the Shared Tree instance changes (either due to local or remote edits)
 * @param dispatch Redux dispatch method
 * @param _getState (ignored)
 * @param sharedTreeConnection Holds the root TreeView.
 * @returns The inner reducer.
 */
export const thunkConnectToFluid =
	(dispatch, _getState, sharedTreeConnection: SharedTreeConnection) =>
		async (): Promise<void> => {
			const pixelEditorTreeView = await start();
			Tree.on(pixelEditorTreeView.root, "treeChanged", () => {
				const currentBoard = getBoardFromSharedTree(pixelEditorTreeView)
				dispatch({
					type: ActionName.APPLY_REMOTE_TREE_CHANGE,
					board: currentBoard
				});
			});

			sharedTreeConnection.pixelEditorTreeView = pixelEditorTreeView;

			// Dispatch the first change notification. The board was loaded before the event was wired up via Tree, so we need
			// to dispatch it manually.
			dispatch({
				type: ActionName.APPLY_REMOTE_TREE_CHANGE,
				board: getBoardFromSharedTree(pixelEditorTreeView)
			});

			// Sets the isLoaded flag.
			dispatch({
				type: ActionName.MARK_IS_CONNECTED
			});
		}

/**
 * Thunk. Sets a cell on the board to a specific value.
 * @param _dispatch (ignored)
 * @param _getState (ignored)
 * @param sharedTreeConnection Holds the root TreeView.
 * @returns The inner reducer.
 */
export const thunkSetCell =
	(_dispatch, _getState, sharedTreeConnection: SharedTreeConnection) =>
		async (x: number, y: number, value: number): Promise<void> => {
			// TODO: Change so that this no longer needs to be cast
			setCell(sharedTreeConnection.pixelEditorTreeView as TreeView<typeof PixelEditorSchema>, x, y, value);
		}

/**
 * Reducer. Applies remote tree changes to the in-memory app state.
 * @param state The state to change.
 * @param action The action containing the new board.
 * @returns The updated state.
 */
function applyRemoteTreeChange(state: AppState, action: ApplyRemoteTreeChangeAction): AppState {
	// Preserve other elements of the state object
	const { itemBoard, ...other } = state;
	return { itemBoard: action.board, ...other };
}

/**
 * Reducer. Sets the isConnected flag.
 * @param state The state to change.
 * @param _action (ignored)
 * @returns The updated state.
 */
function markIsConnected(state: AppState, _action: MarkIsConnected): AppState {
	// Preserve other elements of the state object
	const { isLoaded, ...other } = state;
	return { isLoaded: true, ...other };
}
