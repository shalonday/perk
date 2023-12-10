import Markdown from "react-markdown";
import styles from "./TreeModuleView.module.css";
import { useEffect } from "react";

function TreeModuleView({
  tree,
  setTreeWithActiveNodes,
  module,
  setIsModuleVisible,
}) {
  const prerequisiteNodes = getPrerequisiteNodes();
  const linksTargetedToModule = tree.links.filter(
    (link) => link.target === module.id
  );

  useEffect(function activate() {
    // check if all prerequisite nodes are active. if yes, activate all
    // incoming links, and this module.
    if (prerequisiteNodes.every((node) => node.active)) {
      // activate module and incoming links
      setTreeWithActiveNodes((tree) => {
        return {
          nodes: tree.nodes.map((node) =>
            node.id === module.id ? { ...node, active: true } : node
          ),
          links: tree.links.map((link) =>
            linksTargetedToModule.includes(link)
              ? { ...link, active: true }
              : link
          ),
        };
      });
    }
  }, []);

  function getPrerequisiteNodes() {
    const linksTargetedToModule = tree.links.filter(
      (link) => link.target === module.id
    );
    const prerequisiteNodeIdsArray = linksTargetedToModule.map(
      (link) => link.source
    );
    const prerequisiteNodes = tree.nodes.filter((node) =>
      prerequisiteNodeIdsArray.includes(node.id)
    );
    return prerequisiteNodes;
  }

  function getObjectiveNodes() {
    //grab links whose sources are this module, get the targets of those, then get the nodes that correspond to those targets
    const linksSourcedFromModule = tree.links.filter(
      (link) => link.source === module.id
    );
    const objectiveNodeIdsArray = linksSourcedFromModule.map(
      (link) => link.target
    );
    const objectiveNodes = tree.nodes.filter((node) =>
      objectiveNodeIdsArray.includes(node.id)
    );
    return objectiveNodes;
  }

  function handleExit() {
    setIsModuleVisible(false);
  }

  function handleNext() {
    // set the skill nodes corresponding to objectiveNodes to Active.
    // then check modules whose prerequisiteNodes are all active. Open the first one.
  }
  return (
    <div>
      <form className={styles.form}>
        <button onClick={handleExit}>Exit</button>
        <fieldset className={styles.title}>
          <h3>{module.title}</h3>
        </fieldset>
        <fieldset className={styles.prereqs}>
          <h3>Prerequisites</h3>
          <ul className={styles.prerequisitesList}>
            {prerequisiteNodes.map((node, i) => (
              <li key={i}>&#x2022;{node.title}</li>
            ))}
          </ul>
        </fieldset>
        <fieldset className={styles.targets}>
          <h3>By the end of this module, the learner should be able to:</h3>
          <ul>
            {getObjectiveNodes().map((node, i) => (
              <li key={i}>&#x2022;{node.title}</li>
            ))}
          </ul>
        </fieldset>
        <fieldset className={styles.learn}>
          <h3>Learn</h3>
          <Markdown>{module.learnText}</Markdown>
        </fieldset>
        <fieldset className={styles.practice}>
          <h3>Practice</h3>
          <Markdown>{module.practiceText}</Markdown>
        </fieldset>
        <div className={styles.submitButtonDiv}>
          <button onClick={handleNext}>Done! &rarr;</button>
        </div>
        <div></div>
      </form>
    </div>
  );
}

export default TreeModuleView;
