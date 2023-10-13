import styles from "./Edit.module.css";
import { useState } from "react";
import Outline from "../components/Outline";
import Modal from "../components/Modal";
import D3Chart from "../components/D3Chart";

//generate uuid; retrieved from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid 4Sep2023
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const tempEdgesList = [
  {
    source: 0,
    target: 1,
    value: 1,
    title: "N1->N2",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  {
    source: 1,
    target: 2,
    value: 1,
    title: "N2->N3",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  {
    source: 1,
    target: 3,
    value: 1,
    title: "N2->N4",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  { source: 1, target: 4, value: 1 },
  { source: 2, target: 5, value: 1 },
  { source: 3, target: 5, value: 1 },
  { source: 4, target: 5, value: 1 },
];

const SVG_WIDTH = 968;
const SVG_HEIGHT = 600;
const tempNodesList = [
  {
    id: 0,
    fx: SVG_WIDTH / 2,
    fy: (SVG_HEIGHT - 200) / 2,
    title: "Node 1",
    type: "node",
    detailsArray: ["Prerequisite node"],
  }, // fx and fy are fixed coordinates that the force sim won't touch
  {
    id: 1,
    title: "Node 2",
    type: "node",
    detailsArray: ["Program a basic profile website"],
  },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
];

const tree = {
  id: "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  title: "ZTM's Become a Freelance Developer",
  desc: "The 'Become a Freelance Developer' Career Path from Zero To Mastery. Accessible via https://zerotomastery.io/career-paths/become-a-freelancer-2r7slf",
  rootId: 0,
  nodes: tempNodesList,
  links: tempEdgesList,
};

function Edit() {
  /*
  pathsArray is Array[{Path}]
  interp. array of path objects

  Path is Object{
    id is Int
    title is String
    type is one of ["node", "path"] 
      - interp. always "path" for path objects. Allows Modal component to distinguish between paths and nodes.
    detailsArray is Array[String]
      - the strings that compose the description bullets. In the case of paths, these are learning activities, eg courses, workshops, books, etc.
    fromNode is String //!!! think about how to handle this when we add the ability to delete
      - title of the node earlier to this path
    toNode is String //!!! think about how to handle this when we add the ability to delete
      - title of the node later to this path
  }
  example: { id: 1, title: "N1->N2", type: "path", detailsArray: ["The Odin Project"], fromNode: 0,
    toNode: 1, }
   */
  const [pathsArray, setPathsArray] = useState(tempEdgesList);

  /*
      nodesArray is Array[{Node}]
      interp. array of node objects
    
      Node is Object{
        id is Int
        title is String
        type is one of ["node", "path"] 
          - interp. always "node" for node objects. Allows Modal component to distinguish between paths and nodes.
        detailsArray is Array[String]
          - the strings that compose the description bullets. In the case of nodes, these are SKILLS.
      }
      example: { id: 1, title: "Node 1", type: "node", detailsArray: ["Prerequisite node"] }
       */
  const [nodesArray, setNodesArray] = useState(tempNodesList);

  const [isModalVisible, setIsModalVisible] = useState(false);

  /*
  clickedSource is Node or Path
  -interp. the Node or Path that was clicked to open a modal.
  */
  const [clickedSource, setClickedSource] = useState(null);

  // Enum("path", "node") -> Effect
  // Opens a path modal if input is "path", otherwise open a node modal. In either case we set
  // clickedSource, which will be received by the modal as a prop, to an object containing only
  // values for id and type, resulting in a mostly empty modal.
  function handleAdd(type) {
    switch (type) {
      case "path":
        setClickedSource({
          id: uuidv4(),
          title: "",
          type: "path",
          detailsArray: [],
          fromNode: "",
          toNode: "",
        });
        break;
      case "node":
        setClickedSource({
          id: uuidv4(),
          title: "",
          type: "node",
          detailsArray: [],
        });
        break;
      default:
        throw new Error("unknown type was passed to handleAdd");
    }
    setIsModalVisible(true);
  }

  return (
    <>
      <div className={styles.editContainer}>
        {/* <Outline/> represents the textual outline representation of the skill tree */}
        <Outline
          pathsArray={pathsArray}
          nodesArray={nodesArray}
          handleAdd={handleAdd}
          className={styles.editOutline}
        />
        {/* Image representation 
      of the skill tree based on the text outline */}
        <D3Chart tree={tree} />
      </div>
      {isModalVisible && (
        <Modal
          source={clickedSource}
          setSourceArray={
            clickedSource.type === "path" ? setPathsArray : setNodesArray
          }
        />
      )}
    </>
  );
}

export default Edit;
