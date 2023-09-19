import KonvaCanvas from "../components/KonvaCanvas";
import Outline from "../components/Outline";

function Edit() {
  return (
    <div>
      {/* <Outline/> represents the textual outline representation of the skill tree */}
      <Outline />
      {/* <KonvaCanvas/> uses Konva to give an image representation 
      of the skill tree based on the text outline */}
      <KonvaCanvas />
    </div>
  );
}

export default Edit;
