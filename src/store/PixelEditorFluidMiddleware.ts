import type { Middleware, MiddlewareAPI, Store } from "redux";
import { Tree } from "fluid-framework";
import { getBoardFromSharedTree, setBoardInSharedTree, start } from "./PixelEditorStorage";
import type { AppState } from "./Reducers";

export enum FluidMiddlewareActionName {
	REMOTE_TREE_CHANGE = "REMOTE_TREE_CHANGE",
	LOCAL_TREE_CHANGE = "LOCAL_TREE_CHANGE"
};

/**
 * An action that sets the value of a cell on the board. Triggered by a remote change.
 */
export interface RemoteTreeChangeAction {
	type: FluidMiddlewareActionName.REMOTE_TREE_CHANGE;
	board: number[][];
}

export interface LocalTreeChangeAction {
	type: FluidMiddlewareActionName.LOCAL_TREE_CHANGE;
	board: number[][];
}

export const createFluidMiddleware: Middleware<unknown, AppState> = () => {
	return async (storeAPI: Store<AppState>) => {
		const pixelEditorTreeView = await start();

        /**
         * Todo:
         * - On treeChanged, we need to either a) trigger an edit to an in-memory (non-Fluid) copy of the board, which in turn
         *   will result in components rendering, or b) somehow forward the inval from redux (better memory use, but sketchy).
         * - start probably needs to be invoked elsewhere, or passed to the middleware function
         * - Unsubscribe somewhere?
         * - Reducers, PixelEditorStorage, and PixelEditorFluidMiddleware need a more sane relationship.
         */
        Tree.on(pixelEditorTreeView.root, "treeChanged", () => {
			const currentBoard = getBoardFromSharedTree(pixelEditorTreeView)
            storeAPI.dispatch({
                type : FluidMiddlewareActionName.REMOTE_TREE_CHANGE,
				board: currentBoard
            });
        });

		return next => action => {
			if (action.type === FluidMiddlewareActionName.LOCAL_TREE_CHANGE) {
				setBoardInSharedTree(pixelEditorTreeView, action.board);
				return;
			}

			if (action.type === FluidMiddlewareActionName.REMOTE_TREE_CHANGE) {
				const appState: AppState = storeAPI.getState();
				setBoardInState(appState, action);
			}

			return next(action);
		}
	}

	function setBoardInState(state: AppState, action: RemoteTreeChangeAction): AppState {
		// Preserve other elements of the state object
		const { itemBoard, ...other } = state;
		return { itemBoard: action.board, ...other };
	}
}
