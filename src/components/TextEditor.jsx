import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeAdmonitionType,
  CodeToggle,
  InsertAdmonition,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  directivesPlugin,
  headingsPlugin,
  imagePlugin,
  linkPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { listsPlugin } from "@mdxeditor/editor/plugins/lists";

function TextEditor() {
  const markdown = `
  * Item 1
  * Item 2
  * Item 3
    * nested item

  1. Item 1
  2. Item 2
`;
  return (
    <MDXEditor
      markdown={markdown}
      plugins={[
        linkPlugin(),
        headingsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        listsPlugin(),
        tablePlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <InsertAdmonition />
            </>
          ),
        }),
      ]}
    />
  );
}

export default TextEditor;
