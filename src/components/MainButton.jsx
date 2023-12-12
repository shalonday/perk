import styles from "./MainButton.module.css";
function MainButton({ onClick, children }) {
  return (
    <button onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
}

export default MainButton;
