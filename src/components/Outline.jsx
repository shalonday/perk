// Produces a textual epresentation of the Tree being edited by rendering pathsArray and nodesArray
// into lists.
// - handleOutlineItemClick, defined in Edit, allows the opening of an editing Modal that
// is based on the clicked item.
// - handleAdd adds a new node and path; this should add both to this Outline and to the visual
// representation. It is also defined in Edit because it's Edit that has access to the arrays.

function Outline({
  handleOutlineItemClick,
  pathsArray,
  nodesArray,
  handleAdd,
  className,
}) {
  return (
    <div className={className}>
      <div>
        <h1>Paths</h1>
        <ul>
          {pathsArray.map((path, index) => (
            <li onClick={() => handleOutlineItemClick(path)} key={index}>
              {path.title}
            </li>
          ))}
        </ul>
        <button onClick={() => handleAdd("path")}>Add Path</button>
      </div>
      <div>
        <h1>Nodes</h1>
        <ul>
          {nodesArray.map((node, index) => (
            <li onClick={() => handleOutlineItemClick(node)} key={index}>
              {node.title}
            </li>
          ))}
        </ul>
        <button onClick={() => handleAdd("node")}>Add Node</button>
      </div>
    </div>
  );
}

export default Outline;
