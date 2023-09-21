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
import "./Edit.css";

/////////////////////////////////////////////////////////////////
///////////REQUIRED FOR INSERTING BABYLONJS INTO REACT///////////
/////////////////////////////////////////////////////////////////
let box;

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

  //Our built-in 'box' shape
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  //Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
}

// Will run on every frame render. We are spinning the box on y-axis.

function onRender(scene) {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();
    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
}
/////////////////////////////////////////////////////////
//////////////END OF BABYLON SECTION/////////////////////
/////////////////////////////////////////////////////////

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

  return (
    <div className="edit-container">
      {/* <Outline/> represents the textual outline representation of the skill tree */}
      <Outline pathsArray={pathsArray} nodesArray={nodesArray} />
      {/* Image representation 
      of the skill tree based on the text outline */}
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        className="edit-visualization"
      />
    </div>
  );
}

export default Edit;
