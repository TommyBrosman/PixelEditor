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
