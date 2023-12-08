import Markdown from "react-markdown";
import styles from "./TreeModuleView.module.css";

function TreeModuleView({ linksArray, module }) {
  function getPrerequisiteNodes(links) {}
  function getObjectiveNodes(links) {}
  function handleNext() {}
  return (
    <>
      <form className={styles.form}>
        <fieldset className={styles.title}>
          <h3>{module.title}</h3>
        </fieldset>
        <fieldset className={styles.prereqs}>
          <h3>Prerequisites</h3>
          <ul className={styles.prerequisitesList}>
            {getPrerequisiteNodes(linksArray).map((node, i) => (
              <li key={i}>&#x2022;{node.title}</li>
            ))}
          </ul>
        </fieldset>
        <fieldset className={styles.targets}>
          <h3>By the end of this module, the learner should be able to:</h3>
          <ul>
            {getObjectiveNodes(linksArray).map((node, i) => (
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
    </>
  );
}

export default TreeModuleView;
