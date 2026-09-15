import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import styles from "./Preloader.module.css";
import logo from "../../assets/images/asmita-logo-transparent.png";

// Exact non-overlapping clip paths for each individual leaf and the person figure.
// Ensures each leaf is 100% intact and isolated with zero cross-clipping, splits, or detached fragments.
const LEAF_CLIPS = [
  // Leaf 1 - top center (x: 173-209, y: 14-82)
  "polygon(24% 0%, 30% 0%, 30% 19.2%, 24% 19.2%)",

  // Leaf 2 - left (x: 125-187, y: 70-126)
  "polygon(10% 12%, 24% 12%, 24% 19.2%, 26.4% 19.2%, 26.4% 30.1%, 10% 30.1%)",

  // Leaf 3 - right (x: 188-247, y: 73-126)
  "polygon(26.4% 19.2%, 30% 19.2%, 30% 12%, 38% 12%, 38% 30.1%, 26.4% 30.1%)",
];

// Exact clip path for the purple person figure (x: 0% to 26.5% strictly excluding letter "A" & text, y: 30.2% to 88% strictly below leaves)
const PERSON_CLIP =
  "polygon(0% 30.2%, 26.5% 30.2%, 26.5% 88%, 0% 88%)";

export default function Preloader({ visible }) {
  const reduced = useReducedMotion();

  // Lock body scroll while loader is active
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 500);

      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="asmita-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: reduced ? 1 : 1.03,
            transition: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          className={styles.preloader}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Small subtle background glow */}
          <div
            className={styles.glow}
            aria-hidden="true"
          />

          <div className={styles.centerContainer}>
            {/* =========================================
                LOGO SYMBOL
                Person + Leaves only
                No logo text
            ========================================= */}

            <div className={styles.logoWrapper}>
              <svg
                viewBox="0 0 260 380"
                className={styles.logoSvg}
                role="img"
                aria-label="Asmita Logo Icon"
              >
                {/* =====================================
                    PERSON / ICON
                ===================================== */}

                <motion.g
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          scale: 0.94,
                          y: 6,
                        }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: reduced ? 0.3 : 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    transformOrigin: "115px 235px",
                  }}
                >
                  <image
                    href={logo}
                    x="0"
                    y="0"
                    width="720"
                    height="431"
                    style={{
                      clipPath: PERSON_CLIP,
                    }}
                  />
                </motion.g>

                {/* =====================================
                    LEAF 1 - TOP
                ===================================== */}

                <motion.g
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: -12,
                          y: -38,
                          scale: 0.4,
                          rotate: -35,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: [-12, 6, -2, 0],
                    y: [-38, -6, 2, 0],
                    scale: [0.4, 1.15, 0.98, 1],
                    rotate: [-35, 18, -6, 0],
                  }}
                  transition={{
                    duration: reduced ? 0.3 : 1.4,
                    delay: reduced ? 0 : 0.1,
                    ease: [0.25, 1, 0.5, 1],
                    times: [0, 0.6, 0.85, 1],
                  }}
                  style={{
                    transformOrigin: "192px 48px",
                  }}
                >
                  {/* Small continuous leaf movement */}
                  <motion.g
                    animate={
                      reduced
                        ? {}
                        : {
                            rotate: [-1.5, 1.5, -1.5],
                            y: [0, -2, 0],
                          }
                    }
                    transition={{
                      delay: 1.4,
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      transformOrigin: "192px 48px",
                    }}
                  >
                    <image
                      href={logo}
                      x="0"
                      y="0"
                      width="720"
                      height="431"
                      style={{
                        clipPath: LEAF_CLIPS[0],
                      }}
                    />
                  </motion.g>
                </motion.g>

                {/* =====================================
                    LEAF 2 - LEFT
                ===================================== */}

                <motion.g
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: -45,
                          y: 25,
                          scale: 0.35,
                          rotate: -55,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: [-45, -8, 3, 0],
                    y: [25, -10, 2, 0],
                    scale: [0.35, 1.18, 0.96, 1],
                    rotate: [-55, 20, -8, 0],
                  }}
                  transition={{
                    duration: reduced ? 0.3 : 1.45,
                    delay: reduced ? 0 : 0.22,
                    ease: [0.25, 1, 0.5, 1],
                    times: [0, 0.6, 0.85, 1],
                  }}
                  style={{
                    transformOrigin: "157px 95px",
                  }}
                >
                  {/* Small continuous leaf movement */}
                  <motion.g
                    animate={
                      reduced
                        ? {}
                        : {
                            rotate: [1.2, -1.8, 1.2],
                            y: [0, -1.5, 0],
                          }
                    }
                    transition={{
                      delay: 1.45,
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      transformOrigin: "157px 95px",
                    }}
                  >
                    <image
                      href={logo}
                      x="0"
                      y="0"
                      width="720"
                      height="431"
                      style={{
                        clipPath: LEAF_CLIPS[1],
                      }}
                    />
                  </motion.g>
                </motion.g>

                {/* =====================================
                    LEAF 3 - RIGHT
                ===================================== */}

                <motion.g
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: 40,
                          y: 18,
                          scale: 0.35,
                          rotate: 45,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: [40, 6, -3, 0],
                    y: [18, -8, 2, 0],
                    scale: [0.35, 1.15, 0.97, 1],
                    rotate: [45, -18, 6, 0],
                  }}
                  transition={{
                    duration: reduced ? 0.3 : 1.5,
                    delay: reduced ? 0 : 0.34,
                    ease: [0.25, 1, 0.5, 1],
                    times: [0, 0.6, 0.85, 1],
                  }}
                  style={{
                    transformOrigin: "221px 100px",
                  }}
                >
                  {/* Small continuous leaf movement */}
                  <motion.g
                    animate={
                      reduced
                        ? {}
                        : {
                            rotate: [-1.4, 1.6, -1.4],
                            y: [0, -1.8, 0],
                          }
                    }
                    transition={{
                      delay: 1.5,
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      transformOrigin: "221px 100px",
                    }}
                  >
                    <image
                      href={logo}
                      x="0"
                      y="0"
                      width="720"
                      height="431"
                      style={{
                        clipPath: LEAF_CLIPS[2],
                      }}
                    />
                  </motion.g>
                </motion.g>
              </svg>
            </div>

            {/* =========================================
                SMALL PROGRESS BAR
            ========================================= */}

            <div className={styles.progressBarTrack}>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{
                  duration: 1.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={styles.progressBarFill}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}