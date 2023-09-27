import styles from "./Edit.module.css";
import { useState } from "react";
import KonvaCanvas from "../components/KonvaCanvas";
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
  { id: 0, title: "Node 1", type: "node", detailsArray: ["Prerequisite node"] },
  {
    id: 1,
    title: "Node 2",
    type: "node",
    detailsArray: ["Program a basic profile website"],
  },
];
const tempPathsList = [
  {
    id: 0,
    title: "N1->N2",
    type: "path",
    detailsArray: ["The Odin Project"],
    fromNode: "Node 1",
    toNode: "Node 2",
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
      {isModalVisible && (
        <Modal
          source={clickedSource}
          setSourceArray={
            clickedSource.type === "path" ? setPathsArray : setNodesArray
          }
        />
      )}
    </div>
  );
}

export default Edit;
