import styles from './Spinner.module.scss'

function Spinner({style}) {
    return (
      <div style={style}>
        <div className={styles.ldsSpinner}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
}

export default Spinner
