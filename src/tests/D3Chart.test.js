import { expect, it } from "vitest";

const tempEdgesList = [
  {
    source: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
    title: "N1->N2",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  {
    source: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2e094cdd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
    title: "N2->N3",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  {
    source: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef04cdd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
    title: "N2->N4",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  {
    source: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef90cdd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
  },
  {
    source: "2e094cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
  },
  {
    source: "2ef04cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
  },
  {
    source: "2ef90cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
  },
];

const SVG_WIDTH = 968;
const SVG_HEIGHT = 600;
const tempNodesList = [
  {
    id: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
    fx: SVG_WIDTH / 2,
    fy: (SVG_HEIGHT - 200) / 2,
    title: "Node 1",
    type: "node",
    detailsArray: ["Prerequisite node"],
  }, // fx and fy are fixed coordinates that the force sim won't touch
  {
    id: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    title: "Node 2",
    type: "node",
    detailsArray: ["Program a basic profile website"],
  },
  { id: "2e094cdd-4077-4c36-92bb-5a3b09fc44d1" },
  { id: "2ef04cdd-4077-4c36-92bb-5a3b09fc44d1" },
  { id: "2ef90cdd-4077-4c36-92bb-5a3b09fc44d1" },
  { id: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1" },
];

const tempTree1 = {
  id: "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  title: "ZTM's Become a Freelance Developer",
  description:
    "The 'Become a Freelance Developer' Career Path from Zero To Mastery. Accessible via https://zerotomastery.io/career-paths/become-a-freelancer-2r7slf",
  rootId: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  nodes: tempNodesList,
  links: tempEdgesList,
};

const tempTree2 = {
  id: "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  title: "ZTM's Become a Freelance Developer",
  description:
    "The 'Become a Freelance Developer' Career Path from Zero To Mastery. Accessible via https://zerotomastery.io/career-paths/become-a-freelancer-2r7slf",
  rootId: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  nodes: [...tempNodesList, { id: "0633eba8-fffe-4e7b-b26b-e331f6cec758" }],
  links: tempEdgesList,
};

const tempTree3 = {
  id: "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  title: "ZTM's Become a Freelance Developer",
  description:
    "The 'Become a Freelance Developer' Career Path from Zero To Mastery. Accessible via https://zerotomastery.io/career-paths/become-a-freelancer-2r7slf",
  rootId: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  nodes: tempNodesList,
  links: [
    ...tempEdgesList,
    {
      source: "2ef90cdd-4077-4c36-92bb-5a3b09fc44d1",
      target: "0633eba8-fffe-4e7b-b26b-e331f6cec758",
      value: 1,
    },
  ],
};

// Tree -> Boolean
// checks if all source and target nodes in tree.links exist, and if all nodes are linked.
it("returns true for a valid tree", () => {
  expect(isTreeRenderable(tempTree1)).toBe(true);
});

it("returns false if tree includes an unlinked node", () => {
  expect(isTreeRenderable(tempTree2)).toBe(false);
});

it("returns false if tree includes a link with a non-existent node", () => {
  expect(isTreeRenderable(tempTree3)).toBe(false);
});

function isTreeRenderable(tree) {
  return (
    tree.nodes.every((node) => isNodeLinked(node, tree.links)) &&
    tree.links.every((link) => isLinkUsingExistingNodes(link, tree.nodes))
  );
}

// Node, LinksArray -> Boolean
// check if node is mentioned in any of the sources or targets
it("returns true if node's id appears once in the list of all source and target id's", () => {
  expect(
    isNodeLinked({ id: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1" }, tempEdgesList)
  ).toBe(true);
});

it("returns true if node id appears more than once in the list of all source and target id's", () => {
  expect(
    isNodeLinked({ id: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1" }, tempEdgesList)
  ).toBe(true);
});

it("returns false if node id doesn't appear in the list of all source and target id's", () => {
  expect(
    isNodeLinked({ id: "0633eba8-fffe-4e7b-b26b-e331f6cec758" }, tempEdgesList)
  ).toBe(false);
});
function isNodeLinked(node, links) {
  return links
    .map((link) => link.source)
    .concat(links.map((link) => link.target))
    .includes(node.id);
}

// Link, NodesArray -> Boolean
// returns true if link uses a source and target that exist in nodesArray.
it("returns true if link source and target are in the array of nodes", () => {
  expect(
    isLinkUsingExistingNodes(
      {
        source: "2ef90cdd-4077-4c36-92bb-5a3b09fc44d1",
        target: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1",
        value: 1,
      },
      tempNodesList
    )
  ).toBe(true);
});

it("returns false if link source is not in the array of nodes even if link target is", () => {
  expect(
    isLinkUsingExistingNodes(
      {
        source: "0633eba8-fffe-4e7b-b26b-e331f6cec758",
        target: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1",
        value: 1,
      },
      tempEdgesList
    )
  ).toBe(false);
});

it("returns false if link target is not in the array of nodes even if link source is", () => {
  expect(
    isLinkUsingExistingNodes(
      {
        source: "2ef90cdd-4077-4c36-92bb-5a3b09fc44d1",
        target: "0633eba8-fffe-4e7b-b26b-e331f6cec758",
        value: 1,
      },
      tempEdgesList
    )
  ).toBe(false);
});

it("returns false if link source and target are not in the array of nodes", () => {
  expect(
    isLinkUsingExistingNodes(
      {
        source: "df0c472e-32d4-402a-b1ca-983c3be963f3",
        target: "0633eba8-fffe-4e7b-b26b-e331f6cec758",
        value: 1,
      },
      tempEdgesList
    )
  ).toBe(false);
});
function isLinkUsingExistingNodes(link, nodes) {
  return (
    nodes.map((node) => node.id).includes(link.source) &&
    nodes.map((node) => node.id).includes(link.target)
  );
}
