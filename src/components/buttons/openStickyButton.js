import React from "react";
import styles from "./styles.module.css";

export default function openStickyButton() {
  return (
    <a href="/docs/portal-contribute">
      <button className={`${styles.iconBtn} ${styles.addBtn}`}>
        <div className={styles.addIcon}></div>
        <div className={styles.btnText}>
          <span className={styles.btnSpan}>지금 기여하세요</span>
        </div>
      </button>
    </a>
  );
}
