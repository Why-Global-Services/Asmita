import { motion } from "framer-motion";
import logo from "../../assets/images/asmita-logo-transparent.png";

const leaves = [
  {
    clipPath: "polygon(26.7% 3.2%, 24.2% 10%, 24.6% 15.8%, 26.7% 19.3%, 28.9% 15.3%, 29.3% 10.2%)",
    origin: "192px 84px",
    delay: 0,
    startY: 22,
  },
  {
    clipPath: "polygon(17.5% 16.9%, 21% 17.6%, 24.5% 20.4%, 26.1% 27.1%, 22.2% 26.9%, 19.4% 23.9%)",
    origin: "186px 116px",
    delay: 0.28,
    startY: 18,
  },
  {
    clipPath: "polygon(27.5% 22.7%, 30.6% 18.1%, 34.4% 16.9%, 33.8% 22.7%, 31.1% 27.1%, 26.9% 29.5%)",
    origin: "198px 124px",
    delay: 0.56,
    startY: 16,
  },
];

export default function AsmitaLogo() {
  return (
    <a
      href="#/"
      aria-label="Asmita home"
      className="block w-[120px] shrink-0 sm:w-[142px]"
    >
      <svg
        viewBox="0 0 720 431"
        role="img"
        aria-label="Asmita Comercio, (Su), Lda"
        className="block h-auto w-full"
      >
        <defs>
          <mask id="asmita-leaf-cutout" maskUnits="userSpaceOnUse" x="0" y="0" width="720" height="431">
            <rect width="720" height="431" fill="white" />
            {leaves.map(({ clipPath }, index) => (
              <polygon
                key={index}
                fill="black"
                points={clipPath
                  .match(/[\d.]+%/g)
                  .reduce((points, value, pointIndex, values) => {
                    if (pointIndex % 2 === 0) {
                      return `${points}${(parseFloat(value) * 7.2).toFixed(1)},${(parseFloat(values[pointIndex + 1]) * 4.31).toFixed(1)} `;
                    }
                    return points;
                  }, "")}
              />
            ))}
          </mask>
        </defs>

        <image
          href={logo}
          x="0"
          y="0"
          width="720"
          height="431"
          mask="url(#asmita-leaf-cutout)"
        />

        {leaves.map(({ clipPath, origin, delay, startY }, index) => (
          <motion.g
            key={index}
            initial={{ opacity: 0, scale: 0.2, y: startY }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: origin }}
          >
            <motion.g
              animate={{ rotate: [-1.5, 2, -1.2, 0], y: [0, -1.2, 0.8, 0] }}
              transition={{
                delay: delay + 0.62,
                duration: 3.8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{ transformOrigin: origin }}
            >
              <image
                href={logo}
                x="0"
                y="0"
                width="720"
                height="431"
                style={{ clipPath }}
              />
            </motion.g>
          </motion.g>
        ))}
      </svg>
    </a>
  );
}
