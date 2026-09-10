import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import logo from "../../assets/images/asmita-logo-transparent.png";

// Coordinates for the 3 leaves from asmita-logo-transparent.png (720x431)
const LEAF_CLIPS = [
  // Leaf 1 - top center
  "polygon(26.7% 3.2%, 24.2% 10%, 24.6% 15.8%, 26.7% 19.3%, 28.9% 15.3%, 29.3% 10.2%)",

  // Leaf 2 - left
  "polygon(17.5% 16.9%, 21% 17.6%, 24.5% 20.4%, 26.1% 27.1%, 22.2% 26.9%, 19.4% 23.9%)",

  // Leaf 3 - right
  "polygon(27.5% 22.7%, 30.6% 18.1%, 34.4% 16.9%, 33.8% 22.7%, 31.1% 27.1%, 26.9% 29.5%)",
];

// Exact clip path for the purple person figure
// Excludes letter "A" and all text
const PERSON_CLIP =
  "polygon(0% 27%, 27% 27%, 27% 89%, 0% 89%)";

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
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white"
          style={{ pointerEvents: "all" }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Small subtle background glow */}
          <div
            className="absolute h-48 w-48 rounded-full bg-[#f6e6fb]/60 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center">
            {/* =========================================
                LOGO SYMBOL
                Person + Leaves only
                No logo text
            ========================================= */}

            <div className="relative w-28 sm:w-32 md:w-36 h-auto">
              <svg
                viewBox="0 0 260 380"
                className="w-full h-auto overflow-visible drop-shadow-sm"
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

            <div className="mt-5 h-0.5 w-24 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{
                  duration: 1.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full w-full bg-gradient-to-r from-[#79259c] to-[#b042dc] rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}