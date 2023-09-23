// Produces the main viewing page for a tree--a traversable visual representation of a tree that opens
// a node- or path-specific modal that shows their details upon click.
import "babylonjs-viewer";
function Tree() {
  return (
    <div style={{ height: 1000, width: 1000 }}>
      <babylon model="https://models.babylonjs.com/boombox.glb"></babylon>
    </div>
  );
}

export default Tree;
