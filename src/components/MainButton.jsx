import styles from "./MainButton.module.css";
function MainButton({
  onClick,
  children,
  flexValue = "0 1 auto",
  disabledValue = false,
}) {
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={{ flex: flexValue }}
      disabled={disabledValue}
    >
      {children}
    </button>
  );
}

export default MainButton;
