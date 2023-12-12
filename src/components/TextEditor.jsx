import {
  AdmonitionDirectiveDescriptor,
  BoldItalicUnderlineToggles,
  InsertAdmonition,
  ListsToggle,
  MDXEditor,
  directivesPlugin,
  headingsPlugin,
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
  const markdown = `Add resources, then organize and put them into context here`;

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
