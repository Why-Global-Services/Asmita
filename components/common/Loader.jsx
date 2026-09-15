"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageContext";

const logo = "/images/asmita-logo-transparent.png";

const LEAF_CLIPS = [
  "polygon(23.5% 2%, 30.5% 2%, 30.5% 21%, 23.5% 21%)",
  "polygon(16% 16%, 27% 16%, 27% 31%, 16% 31%)",
  "polygon(24.5% 16%, 36% 16%, 36% 32%, 24.5% 32%)",
];

const PERSON_CLIP =
  "polygon(0% 27%, 27% 27%, 27% 89%, 0% 89%)";

export default function Loader({ label }) {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const displayLabel = label || t("common.loading");

  return (
    <div
      className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 py-8 text-center sm:min-h-[260px]"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-16 w-12 sm:h-20 sm:w-14">
        <svg
          viewBox="0 0 260 380"
          className="h-full w-full overflow-visible drop-shadow-sm"
          role="img"
          aria-hidden="true"
        >
          {/* PERSON */}
          <motion.g
            animate={
              reduced
                ? {}
                : {
                    scale: [1, 1.03, 1],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "115px 235px" }}
          >
            <image
              href={logo}
              x="0"
              y="0"
              width="720"
              height="431"
              style={{ clipPath: PERSON_CLIP }}
            />
          </motion.g>

          {/* TOP LEAF */}
          <motion.g
            animate={
              reduced
                ? {}
                : {
                    rotate: [-12, 14, -12],
                    y: [-4, 3, -4],
                    scale: [0.95, 1.05, 0.95],
                  }
            }
            transition={{
              duration: 2.2,
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

          {/* LEFT LEAF */}
          <motion.g
            animate={
              reduced
                ? {}
                : {
                    rotate: [15, -10, 15],
                    x: [-2, 3, -2],
                    y: [2, -3, 2],
                    scale: [1.05, 0.94, 1.05],
                  }
            }
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
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

          {/* RIGHT LEAF */}
          <motion.g
            animate={
              reduced
                ? {}
                : {
                    rotate: [-14, 12, -14],
                    x: [2, -2, 2],
                    y: [-2, 3, -2],
                    scale: [0.96, 1.06, 0.96],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
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
        </svg>
      </div>

      <span className="text-xs font-semibold tracking-wide text-[#79259c]">
        {displayLabel}
      </span>
    </div>
  );
}