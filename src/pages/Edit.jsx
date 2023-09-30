import styles from "./Edit.module.css";
import { useState } from "react";
import Outline from "../components/Outline";
import {
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
} from "@babylonjs/core";
import SceneComponent from "../components/SceneComponent";
import Modal from "../components/Modal";

const tempNodesList = [
  {
    id: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
    title: "Node 1",
    type: "node",
    detailsArray: ["Prerequisite node"],
    coordinates: [0, 0, 0],
    prevList: [],
    nextList: ["path4cdd-4077-4c36-92bb-5a3b09fc44d1"],
  },
  {
    id: "1ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
    title: "Node 2",
    type: "node",
    detailsArray: ["Program a basic profile website"],
    coordinates: [],
    prevList: ["path4cdd-4077-4c36-92bb-5a3b09fc44d1"],
    nextList: ["n2-n3", "n2-n4"],
  },
];
const tempPathsList = [
  {
    id: "path4cdd-4077-4c36-92bb-5a3b09fc44d1",
    title: "N1->N2",
    type: "path",
    detailsArray: ["The Odin Project"],
    coordinates: [],
    prevList: ["0ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
    nextList: ["1ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
  },
  {
    id: "n2-n3",
    title: "N2->N3",
    type: "path",
    detailsArray: ["The Odin Project"],
    coordinates: [],
    prevList: ["1ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
    nextList: [],
  },
  {
    id: "n2-n4",
    title: "N2->N4",
    type: "path",
    detailsArray: ["The Odin Project"],
    coordinates: [],
    prevList: ["1ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
    nextList: [],
  },
];

//generate uuid; retrieved from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid 4Sep2023
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const tempTree = {
  id: "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  title: "ZTM's Become a Freelance Developer",
  desc: "The 'Become a Freelance Developer' Career Path from Zero To Mastery. Accessible via https://zerotomastery.io/career-paths/become-a-freelancer-2r7slf",
  rootId: "0ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
  elements: tempNodesList.concat(tempPathsList),
};

// UUID UUID -> Boolean
// return true if the UUIDs are equal, meaning that eltID is the start/root element.
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("returns true if the uuids are equal", () => {
    expect(
      isRoot(
        "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
        "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1"
      )
    ).toBe(true);
    expect(
      isRoot(
        "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
        "2ef94cdd-4077-4c36-92bb-5a3b09fc44q1"
      )
    ).toBe(false);
  });
}
function isRoot(eltId, rootEltId) {
  return eltId === rootEltId;
}

// Enum("node", "path") {[[Int*3]],[Int*3]} -> Effect
// render node or path at Vector3 position(s) represented by triplet Integer arrays.
// path types can have multiple triplet arrays as startCoordinates, eg.,
// renderElement("path", {[[1,1,1], [2, 2, 1], [3,3,1]],[4,4,4]}) , where [4,4,4]
// is the sole triplet array for endCoordinates and the startCoordinates array contains three triplets
// node types always have empty endCoordinates, and renders only at the startCoordinates
// !!!
function renderElement(type, { startCoordinates, endCoordinates }) {}

// PathElement ListOfElements -> [[Vector3]]
// get start coordinates of given pathElement by getting coordinate(s) of elts in its prevList
// !!!
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("returns coordinates of previous node(s) as startCoordinates", () => {
    expect(
      getStartCoordinates(
        {
          id: "path4cdd-4077-4c36-92bb-5a3b09fc44d1",
          title: "N1->N2",
          type: "path",
          detailsArray: ["The Odin Project"],
          coordinates: [],
          prevList: ["0ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
          nextList: ["1ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
        },
        tempNodesList.concat(tempPathsList)
      )
    ).toEqual([[0, 0, 0]]);
    // !!! add more tests once calculateEndCoordinates has been defined and tested
  });
}
function getStartCoordinates(pathElement, listOfElements) {
  const prevElements = pathElement.prevList.map((prevEltId) =>
    listOfElements.find((elt) => elt.id === prevEltId)
  );
  return prevElements.map((prevElement) => prevElement.coordinates);
}

// PathElement -> Integer
// returns the number of paths originating from the same node
// this path originates from; resulting number includes this path.
// !!!
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("returns number of paths originating from same node as given path", () => {
    expect(
      getNumberOfSiblings(
        {
          id: "path4cdd-4077-4c36-92bb-5a3b09fc44d1",
          title: "N1->N2",
          type: "path",
          detailsArray: ["The Odin Project"],
          coordinates: [],
          prevList: ["0ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
          nextList: ["1ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
        },
        tempNodesList.concat(tempPathsList)
      )
    ).toBe(1);
    expect(
      getNumberOfSiblings(
        {
          id: "n2-n3",
          title: "N2->N3",
          type: "path",
          detailsArray: ["The Odin Project"],
          coordinates: [],
          prevList: ["1ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
          nextList: [],
        },
        tempNodesList.concat(tempPathsList)
      )
    ).toBe(2);
    expect(
      getNumberOfSiblings(
        {
          id: "n2-n4",
          title: "N2->N4",
          type: "path",
          detailsArray: ["The Odin Project"],
          coordinates: [],
          prevList: ["1ef94cdd-4077-4c36-92bb-5a3b09fc44d1"],
          nextList: [],
        },
        tempNodesList.concat(tempPathsList)
      )
    ).toBe(2);
  });
}
function getNumberOfSiblings(elt, listOfElements) {
  return listOfElements.find((item) => item.id === elt.prevList[0]).nextList
    .length;
}

// ??? -> [Vector3]
// calculate suitable end coordinates for a path. The logic is as follows:
// straight: this path's prevElement has only this path in its nextList.
// diverging: if this path is one of multiple branches of a single prevElement
//    - compute coordinates by looking at the unit circle
// converging: if this path has multiple prevElements.
//    - go back to middle (y-axis same as origin of origin nodes)
// All paths whether diverging or converging end at only one endpoint
// !!!
function calculateEndCoordinates(elt, tree, startCoordinates) {
  const numSibs = getNumberOfSiblings(elt, tree);
}

// [UUID] ListOfElements -> [[Vector3]]
// get endCoordinates of previous path element
// !!!
function getNodeCoordinates(prevList, listOfElements) {
  return listOfElements.find((item) => item.id === prevList[0]).coordinates
    .endCoordinates;
}

// Tree -> Effect
// !!!
function renderTree(tree) {
  let startCoordinates;
  let endCoordinates;
  tree.elements.forEach((elt) => {
    if (isRoot(elt.id, tree.root.id)) {
      startCoordinates = [0, 0, 0];
      endCoordinates = [];
      elt.coordinates = { startCoordinates, endCoordinates };
      renderElement("node", elt.coordinates);
    } else {
      if (elt.type === "node") {
        startCoordinates = getNodeCoordinates();
      }
      if (elt.type === "path") {
        startCoordinates = getStartCoordinates(elt, tree.elements);
        endCoordinates = calculateEndCoordinates(elt, startCoordinates);
        elt.coordinates = { startCoordinates, endCoordinates };
        renderElement("path", elt.coordinates);
      }
    }
  });
}

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
  const [pathsArray, setPathsArray] = useState(tempPathsList);

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

  /////////////////////////////////////////////////////////////////
  ///////////REQUIRED FOR INSERTING BABYLONJS INTO REACT///////////
  /////////////////////////////////////////////////////////////////

  function onSceneReady(scene) {
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    //This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    const canvas = scene.getEngine().getRenderingCanvas();

    //This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    //This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    //Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    const sphereArray = nodesArray.map((node) =>
      MeshBuilder.CreateSphere("sphere", {}, scene)
    );

    sphereArray.map((sphere, i) => (sphere.position.x = i + 1));
  }

  /////////////////////////////////////////////////////////
  //////////////END OF BABYLON SECTION/////////////////////
  /////////////////////////////////////////////////////////

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
        <SceneComponent
          antialias
          onSceneReady={onSceneReady}
          className={styles.editVisualization}
        />
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
