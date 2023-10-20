import styles from "./Edit.module.css";
import { useEffect, useRef, useState } from "react";
import Outline from "../components/Outline";
import Modal from "../components/Modal";
import D3Chart from "../components/D3Chart";
import NewTreeModal from "../components/NewTreeModal";
import { useParams } from "react-router-dom";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import { uuidv4 } from "../utils";

/*
  pathsArray is Array[{Path}]
  interp. array of path objects

  Path is Object{
    id is UUID
    title is String
    type is one of ["node", "path"] 
      - interp. always "path" for path objects. Allows Modal component to distinguish between paths and nodes.
    detailsArray is Array[String]
      - the strings that compose the description bullets. In the case of paths, these are learning activities, eg courses, workshops, books, etc.
    source* is UUID //!!! think about how to handle this when we add the ability to delete
      - *property name is required for D3 chart. This is the UUID of the path's source node
    target* is String //!!! think about how to handle this when we add the ability to delete
      - *required for D3 chart. This is the UUID of the path's target node.
  }
  example: { id:uuid, title: "N1->N2", type: "path", detailsArray: ["The Odin Project"], source: 0,
    target: 1, }
   */
const tempEdgesList = [
  {
    id: "f455eb57-71a1-4130-8cba-dc9ffc98bb6c",
    source: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
    title: "N1->N2",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  {
    id: "56379e11-1f4c-4781-aecf-6df8956b5957",
    source: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2e094cdd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
    title: "N2->N3",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  {
    id: "96a569be-a72c-49f4-be49-1201b0a7e2b7",
    source: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef04cdd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
    title: "N2->N4",
    type: "path",
    detailsArray: ["The Odin Project"],
  },
  {
    id: "a704551c-8d74-4056-9fd8-02e498fa3ec5",
    source: "20f94cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef90cdd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
  },
  {
    id: "b41802e5-b81f-4d1a-b688-a668d3b0c22c",
    source: "2e094cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
  },
  {
    id: "48954cd6-fab9-4396-b88f-9161823d563b",
    source: "2ef04cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
  },
  {
    id: "5fe5815d-1a59-431c-a31a-48000c91471b",
    source: "2ef90cdd-4077-4c36-92bb-5a3b09fc44d1",
    target: "2ef940dd-4077-4c36-92bb-5a3b09fc44d1",
    value: 1,
  },
];

/*
  nodesArray is Array[{Node}]
  interp. array of node objects
    
  Node is Object{
  id* is UUID. *required for D3 chart.
  title is String
  type is one of ["node", "path"] 
    - interp. always "node" for node objects. Allows Modal component to distinguish between paths and nodes.
  detailsArray is Array[String]
    - the strings that compose the description bullets. In the case of nodes, these are SKILLS.
      }
      example: { id: 1, title: "Node 1", type: "node", detailsArray: ["Prerequisite node"] }
*/
const tempNodesList = [
  {
    id: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
    title: "Node 1",
    type: "node",
    detailsArray: ["Prerequisite node"],
  },
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

const tempTree = {
  id: "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  title: "ZTM's Become a Freelance Developer",
  description:
    "The 'Become a Freelance Developer' Career Path from Zero To Mastery. Accessible via https://zerotomastery.io/career-paths/become-a-freelancer-2r7slf",
  rootId: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  nodes: tempNodesList,
  links: tempEdgesList,
};

function Edit() {
  // tree ID grabbed from URL Param
  const { id: urlId } = useParams();

  const emptyTree = {
    id: urlId,
    title: "",
    description: "",
    rootId: "",
    nodes: [],
    links: [],
  };

  const { currentTree, getTree, createTree, updateTree } =
    useSkillTreesContext();

  const [tree, setTree] = useState(emptyTree);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewTreeModalVisible, setIsNewTreeModalVisible] = useState(true);

  // clickedElement is Node or Path
  // -interp. the Node or Path that was clicked to open a modal.
  const [clickedElement, setClickedElement] = useState(null);

  // Boolean
  // interp. indicates whether the tree being edited is new (ie not yet in the database) or not.
  const isNewTree = useRef(false);

  // Upon opening an edit screen, grab the tree with id === urlId from the database, and place
  // that into currentTree variable
  useEffect(function grabTree() {
    getTree(urlId);
  }, []);

  // Set the edit screen display depending on whether a tree with id == urlId exists in the database.
  // Also set isNewTree flag accordingly.
  // This useEffect has to be separate from grabTree() because this requires currentTree as a
  // dependency, and that causes an endless loop of fetching if getTree tries to grab a
  // non-existent/new tree.
  useEffect(
    function initializeEditScreen() {
      if (Object.keys(currentTree).length > 0) {
        console.log("length:" + Object.keys(currentTree).length);
        setTree(currentTree);
        isNewTree.current = false;
        setIsNewTreeModalVisible(false);
      } else {
        isNewTree.current = true;
      }
      console.log(currentTree);
    },
    [currentTree]
  );

  // Enum("path", "node") -> Effect
  // Opens a path modal if input is "path", otherwise open a node modal. In either case we set
  // clickedElement, which will be received by the modal as a prop, to an object containing only
  // values for id and type, resulting in a mostly empty modal,  since this clickedElement object will
  // be used for the modal's initial states.
  function handleAdd(type) {
    switch (type) {
      case "path":
        const newPath = {
          id: uuidv4(),
          title: "",
          type: "path",
          detailsArray: [],
          source: "",
          target: "",
        };
        setClickedElement(newPath);
        break;
      case "node":
        const newNode = {
          id: uuidv4(),
          title: "",
          type: "node",
          detailsArray: [],
        };
        setClickedElement(newNode);
        break;
      default:
        throw new Error("unknown type was passed to handleAdd");
    }
    setIsModalVisible(true);
  }

  /*
  Element(ie Node or Path) -> Effect
  - opens a modal specific to the clicked Node or Path by assigning clickedElement that will be 
  sent to modal, and making the modal visible
   */
  function handleOutlineItemClick(element) {
    setClickedElement(element);
    setIsModalVisible(true);
  }

  // Save created tree to database, saving the tree details with its array of node IDs and link IDs
  // under the "trees" array, and all new nodes and links, or edited nodes and links into "nodes" and
  // "links" array.
  function handleSubmit() {
    //not a form button so no need for e.preventDefault
    console.log(tree);
    if (isNewTree.current === true) {
      createTree(tree);
    } else {
      updateTree(tree);
    }
  }

  return (
    <>
      <div className={styles.editContainer}>
        {/* <Outline/> represents the textual outline representation of the skill tree */}
        <Outline
          handleOutlineItemClick={handleOutlineItemClick}
          pathsArray={tree.links}
          nodesArray={tree.nodes}
          handleAdd={handleAdd}
          className={styles.editOutline}
        />
        {/* Image representation 
      of the skill tree based on the text outline */}
        <D3Chart tree={tree} className={styles.editVisualization} />
        <div
          className={styles.titleDescDiv}
          onClick={() => setIsNewTreeModalVisible(true)}
        >
          <h3 className={styles.title}>{tree.title}</h3>
          <p className={styles.description}>{tree.description}</p>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {isNewTreeModalVisible && (
        <NewTreeModal
          tree={tree}
          setIsNewTreeModalVisible={setIsNewTreeModalVisible}
          setTree={setTree}
          setClickedElement={setClickedElement}
          setIsModalVisible={setIsModalVisible}
        />
      )}
      {isModalVisible && (
        <Modal
          clickedElement={clickedElement}
          tree={tree}
          setTree={setTree}
          setIsModalVisible={setIsModalVisible}
        />
      )}
    </>
  );
}

export default Edit;
