import "../styles/styles.css";
import Providers from "./providers";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Asmita Medical",
  description: "Your trusted partner in quality medical products and healthcare solutions.",
  icons: {
    icon: "/images/asmita-logo.jpeg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
