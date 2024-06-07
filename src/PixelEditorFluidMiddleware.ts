import type { Store } from "redux";
import { Tree } from "fluid-framework";
import { start } from "./PixelEditorStorage";

export const createFluidMiddleware = () => {
	return async (storeAPI: Store) => {
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

        });
		/*
        let socket = createMyWebsocket(url);

        socket.on("message", (message) => {
            storeAPI.dispatch({
                type : "SOCKET_MESSAGE_RECEIVED",
                payload : message
            });
        });

        return next => action => {
            if(action.type == "SEND_WEBSOCKET_MESSAGE") {
                socket.send(action.payload);
                return;
            }

            return next(action);
        }
		*/
	}
}
