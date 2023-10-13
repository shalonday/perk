function NewTreeModal({ nodesArray, setIsNewTreeModalVisible }) {
  return (
    <div>
      <form>
        Pick starting node(s) for your tree:
        <select>
          {nodesArray.map((node) => (
            <option>{node.title}</option>
          ))}
        </select>
        ...Or{" "}
        <button onClick={() => setIsNewTreeModalVisible(false)}>create</button>{" "}
        your own
      </form>
    </div>
  );
}

export default NewTreeModal;
