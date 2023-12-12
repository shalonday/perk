import styles from "./MainTextSection.module.css";
import { useRef, useState } from "react";
import AddLinkModal from "./AddLinkModal";
import TextEditor from "./TextEditor";
import MainButton from "./MainButton";

function MainTextSection({ setLearnText, setPracticeText, setResourcesArray }) {
  const [learnLinkText, setLearnLinkText] = useState("");
  const [practiceLinkText, setPracticeLinkText] = useState("");
  const [isLearnAddLinkModalVisible, setIsLearnAddLinkModalVisible] =
    useState(false);
  const [isPracticeAddLinkModalVisible, setIsPracticeAddLinkModalVisible] =
    useState(false);
  const linkTextSetter = useRef();

  function handleAddLinkLearn() {
    linkTextSetter.current = setLearnLinkText;
    setIsLearnAddLinkModalVisible(true);
  }

  function handleAddLinkPractice() {
    // get ref to focused textarea
    // concatenate link url or some other text or span to textarea via ref
    linkTextSetter.current = setPracticeLinkText;
    setIsPracticeAddLinkModalVisible(true);
  }

  return (
    <>
      <fieldset className={styles.learn}>
        <h3>Learn</h3>
        {!isLearnAddLinkModalVisible && (
          <MainButton onClick={handleAddLinkLearn}>Link a resource</MainButton>
        )}
        {isLearnAddLinkModalVisible && (
          <AddLinkModal
            linkTextSetter={linkTextSetter.current}
            setIsAddLinkModalVisible={setIsLearnAddLinkModalVisible}
            setResourcesArray={setResourcesArray}
          />
        )}
        <TextEditor
          textToAppend={learnLinkText}
          onChange={(markdown) => setLearnText(markdown)}
        />
      </fieldset>
      <fieldset className={styles.practice}>
        <h3>Practice</h3>
        {!isPracticeAddLinkModalVisible && (
          <MainButton onClick={handleAddLinkPractice}>
            Link a resource
          </MainButton>
        )}
        {isPracticeAddLinkModalVisible && (
          <AddLinkModal
            linkTextSetter={linkTextSetter.current}
            setIsAddLinkModalVisible={setIsPracticeAddLinkModalVisible}
            setResourcesArray={setResourcesArray}
          />
        )}
        <TextEditor
          textToAppend={practiceLinkText}
          onChange={(markdown) => setPracticeText(markdown)}
        />
      </fieldset>
    </>
  );
}

export default MainTextSection;
