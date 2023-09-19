import { useState } from "react";
import KonvaCanvas from "../components/KonvaCanvas";
import Outline from "../components/Outline";

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
    <div>
      {/* <Outline/> represents the textual outline representation of the skill tree */}
      <Outline pathsArray={pathsArray} nodesArray={nodesArray} />
      {/* <KonvaCanvas/> uses Konva to give an image representation 
      of the skill tree based on the text outline */}
      <KonvaCanvas pathsArray={pathsArray} nodesArray={nodesArray} />
    </div>
  );
}

export default Edit;
