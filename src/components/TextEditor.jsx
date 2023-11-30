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
  linkDialogPlugin,
  linkPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { listsPlugin } from "@mdxeditor/editor/plugins/lists";
import { useEffect, useRef } from "react";

function TextEditor({ textToAppend, onChange }) {
  const ref = useRef();
  const markdown = `
  * Item 1
  * Item 2
  * Item 3
    * nested item

  1. Item 1
  2. Item 2
`;

  // Dynamically set text on editor by passing textToAppend to this component
  // See https://mdxeditor.dev/editor/docs/getting-started or my commit message
  // to see why both this and onChange are necessary for my case.
  useEffect(
    function setText() {
      const currentText = ref.current?.getMarkdown();
      ref.current?.setMarkdown(currentText + `${textToAppend}`);
    },
    [textToAppend]
  );
  return (
    <MDXEditor
      ref={ref}
      onChange={onChange} // Detect changes upon typing
      markdown={markdown}
      plugins={[
        linkPlugin(),
        linkDialogPlugin(),
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
