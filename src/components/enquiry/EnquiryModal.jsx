import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { catalogService } from "../../services/catalogService";

const initialForm = {
  fullName: "",
  mobile: "",
  email: "",
  company: "",
  city: "",
  message: "",
};

export default function EnquiryModal({ product, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const adminNumber = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER;

  if (!product) return null;

  const productUrl = `${window.location.origin}${window.location.pathname}#/products/${product.id}`;

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const bookingPayload = {
      name: form.fullName,
      phoneNumber: form.mobile,
      email: form.email,
      categoryId: product.categoryId || product._id || product.id || "cat_default",
      categoryTitle: product.categoryTitle || product.category || "General",
      subCategoryId: product.subCategoryId || product._id || product.id || "subcat_default",
      subCategoryTitle: product.subCategoryTitle || product.subcategory || "General",
      productId: product._id || product.id || "prod_default",
      productTitle: product.name || product.productTitle || "Product",
      message: form.message || "",
    };

    try {
      await catalogService.bookProduct(bookingPayload);

      if (adminNumber) {
        const message = `Hello,

New Product Enquiry

Product:
${product.name}

Category:
${product.category}

Customer Name:
${form.fullName}

Phone:
${form.mobile}

Email:
${form.email}

Company:
${form.company}

City:
${form.city}

Message:
${form.message}

Product Link:
${productUrl}`;

        window.open(
          `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener,noreferrer"
        );
      }

      setForm(initialForm);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={Boolean(product)} onClose={onClose}>
      <div className="pr-4 sm:pr-7">
        <span className="text-xs font-bold tracking-widest text-[#79259c]">
          PRODUCT ENQUIRY
        </span>

        <h2 className="mt-2 font-serif text-2xl text-slate-900 sm:text-3xl">
          Enquire about {product.name}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Share your details and we'll process your enquiry immediately.
        </p>
      </div>

      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        onSubmit={submit}
      >
        <Field
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={update}
          required
        />

        <Field
          label="Mobile Number"
          name="mobile"
          type="tel"
          value={form.mobile}
          onChange={update}
          required
        />

        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          required
        />

        <Field
          label="Company (Optional)"
          name="company"
          value={form.company}
          onChange={update}
        />

        <Field
          label="City"
          name="city"
          value={form.city}
          onChange={update}
          required
        />

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-bold text-slate-700">
            Message
          </span>

          <textarea
            name="message"
            value={form.message}
            onChange={update}
            rows={4}
            required
            className="min-h-[120px] rounded-md border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#79259c] focus:ring-2 focus:ring-[#c578e0]/30 sm:py-2"
          />
        </label>

        {errorMsg && (
          <p className="text-sm text-red-600 sm:col-span-2 font-semibold">
            {errorMsg}
          </p>
        )}

        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


function Field({ label, ...inputProps }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">
        {label}
      </span>

      <input
        {...inputProps}
        className="rounded-md border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#79259c] focus:ring-2 focus:ring-[#c578e0]/30 sm:py-2"
      />
    </label>
  );
}