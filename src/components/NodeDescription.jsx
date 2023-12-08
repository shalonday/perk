function NodeDescription({ currentNode, className }) {
  return (
    <div className={className}>
      <div>
        <h3>{currentNode?.__data__.title}</h3>
      </div>
      <p>{currentNode?.__data__.description}</p>
    </div>
  );
}

export default NodeDescription;
