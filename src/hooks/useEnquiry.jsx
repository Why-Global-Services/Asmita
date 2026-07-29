



import { createContext, useContext, useMemo, useState } from "react";
import EnquiryModal from "../components/enquiry/EnquiryModal";

const EnquiryContext = createContext(null);

export function EnquiryProvider({ children }) {
  const [product, setProduct] = useState(null);

  const value = useMemo(
    () => ({
      openEnquiry: setProduct,
    }),
    []
  );

  return (
    <EnquiryContext.Provider value={value}>
      {children}

      <EnquiryModal
        product={product}
        onClose={() => setProduct(null)}
      />
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);

  if (!context) {
    throw new Error(
      "useEnquiry must be used within EnquiryProvider"
    );
  }

  return context;
}
