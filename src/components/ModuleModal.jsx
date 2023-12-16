import "@mdxeditor/editor/style.css";
import { Suspense, useState } from "react";
import styles from "./ModuleModal.module.css";
import AddTargetNodeSection from "./AddTargetNodeSection";
import MainTextSection from "./MainTextSection";
import { uuidv4 } from "../utils";
import Loader from "./Loader";

function ModuleModal({
  prerequisiteNodes,
  setCurrentTree,
  setIsModuleModalVisible,
}) {
  const [title, setTitle] = useState("");
  const [targetNodeDescriptions, setTargetNodeDescriptions] = useState([]);
  const [learnText, setLearnText] = useState("");
  const [practiceText, setPracticeText] = useState("");

  // Array of links added onto Learn and Practice sections.
  const [resourcesArray, setResourcesArray] = useState([]);

  // Int -> Effect
  // delete item in bullets array that corresponds to index
  function handleDeleteItem(index) {
    setTargetNodeDescriptions((array) =>
      array.filter((item, i) => i !== index)
    );
  }

  // Add an empty item to detailsArray to be edited by user
  function handleAddItem(e) {
    e.preventDefault();
    setTargetNodeDescriptions((array) => [...array, ""]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const id = uuidv4();

    // create a module object and target nodes objects
    const newModule = {
      id: id,
      type: "module",
      title: title ? title : "untitled",
      learnText: learnText,
      practiceText: practiceText,
      resourcesArray: resourcesArray,
    };

    const newIsPrerequisiteToLinks = prerequisiteNodes.map((prereqNode) => {
      const newLink = {
        id: uuidv4(),
        source: prereqNode.id,
        target: id,
      };
      return newLink;
    });

    const targetNodes = targetNodeDescriptions.map((description) => {
      const newTargetNode = {
        id: uuidv4(),
        title: "",
        type: "skill",
        description: description,
      };
      return newTargetNode;
    });

    const newTeachesLinks = targetNodes.map((targetNode) => {
      const newLink = {
        id: uuidv4(),
        source: id,
        target: targetNode.id,
      };
      return newLink;
    });
    const newLinks = newIsPrerequisiteToLinks.concat(newTeachesLinks);
    const newNodes = targetNodes.concat([newModule]);

    // set the currentTree value by adding the new nodes and links to it
    setCurrentTree((tree) => {
      const newTree = {
        nodes: tree.nodes.concat(newNodes),
        links: tree.links.concat(newLinks),
      };

      return newTree;
    });

    // close the modal
    setIsModuleModalVisible(false);
  }

  return (
    <Suspense fallback={<Loader />}>
      <form className={styles.form}>
        <fieldset className={styles.title}>
          <h3>
            <input
              placeholder="[optional title]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </h3>
        </fieldset>
        <fieldset className={styles.prereqs}>
          <h3>Prerequisites</h3>
          <ul className={styles.prerequisitesList}>
            {prerequisiteNodes.map((node, i) => (
              <li key={i}>&#x2022;{node.description}</li>
            ))}
          </ul>
        </fieldset>
        <fieldset className={styles.targets}>
          <AddTargetNodeSection
            targetNodes={targetNodeDescriptions}
            setTargetNodes={setTargetNodeDescriptions}
            handleDeleteItem={handleDeleteItem}
            handleAddItem={handleAddItem}
          />
        </fieldset>
        <MainTextSection
          setLearnText={setLearnText}
          setPracticeText={setPracticeText}
          setResourcesArray={setResourcesArray}
        />
        <div className={styles.submitButtonDiv}>
          <button onClick={handleSubmit}>Submit &rarr;</button>
        </div>
        <div></div>
      </form>
    </Suspense>
  );
}

export default ModuleModal;
