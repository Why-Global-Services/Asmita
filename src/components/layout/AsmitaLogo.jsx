import { motion } from 'framer-motion';
import logo from '../../assets/images/asmita-logo.jpeg';

const breeze = (origin, delay) => ({
  animate: { rotate: [-3, 3, -2, -3], y: [0, -1, 0, 0] },
  transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay },
  style: { transformOrigin: origin },
});

export default function AsmitaLogo() {
  return (
    <a href="#/" className="block w-[142px] shrink-0" aria-label="Asmita home">
      <svg viewBox="0 0 720 431" role="img" aria-label="Asmita Comercio, (Su), Lda" className="block h-auto w-full mix-blend-multiply">
        <image href={logo} x="0" y="0" width="720" height="431" />
        {/* This mask removes the original leaf pixels; the three clipped layers below use the exact uploaded artwork. */}
        <rect x="105" y="0" width="195" height="132" fill="white" />
        <motion.g {...breeze('192px 84px', 0)}>
          <image href={logo} x="0" y="0" width="720" height="431" style={{ clipPath: 'polygon(26.7% 3.2%, 24.2% 10%, 24.6% 15.8%, 26.7% 19.3%, 28.9% 15.3%, 29.3% 10.2%)' }} />
        </motion.g>
        <motion.g {...breeze('186px 116px', 0.2)}>
          <image href={logo} x="0" y="0" width="720" height="431" style={{ clipPath: 'polygon(17.5% 16.9%, 21% 17.6%, 24.5% 20.4%, 26.1% 27.1%, 22.2% 26.9%, 19.4% 23.9%)' }} />
        </motion.g>
        <motion.g {...breeze('198px 124px', 0.4)}>
          <image href={logo} x="0" y="0" width="720" height="431" style={{ clipPath: 'polygon(27.5% 22.7%, 30.6% 18.1%, 34.4% 16.9%, 33.8% 22.7%, 31.1% 27.1%, 26.9% 29.5%)' }} />
        </motion.g>
      </svg>
    </a>
  );
}
