import { Circles } from "react-loader-spinner";
import styles from "./Loader.module.css";
function Loader() {
  return (
    <div className={styles.loaderDiv}>
      <Circles
        height="80"
        width="100%"
        color="hsl(60 100% 50%)"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass={styles.loader}
        visible={true}
      />
    </div>
  );
}

export default Loader;
