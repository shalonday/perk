function NodeDescription({ currentNode, className }) {
  return (
    <div className={className}>
      <div>
        <h3>{currentNode?.title}</h3>
      </div>
      <p>{currentNode?.description}</p>
    </div>
  );
}

export default NodeDescription;
