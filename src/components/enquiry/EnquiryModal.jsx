import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const initialForm = { fullName: '', mobile: '', email: '', company: '', city: '', message: '' };

export default function EnquiryModal({ product, onClose }) {
  const [form, setForm] = useState(initialForm);
  const adminNumber = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER;

  if (!product) return null;

  const productUrl = `${window.location.origin}${window.location.pathname}#/products/${product.id}`;
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (!adminNumber) return;
    const message = `Hello,\n\nNew Product Enquiry\n\nProduct:\n${product.name}\n\nCategory:\n${product.category}\n\nCustomer Name:\n${form.fullName}\n\nPhone:\n${form.mobile}\n\nEmail:\n${form.email}\n\nCompany:\n${form.company}\n\nCity:\n${form.city}\n\nMessage:\n${form.message}\n\nProduct Link:\n${productUrl}`;
    window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Modal open={Boolean(product)} onClose={onClose}>
      <div className="pr-7">
        <span className="text-xs font-bold tracking-widest text-[#79259c]">PRODUCT ENQUIRY</span>
        <h2 className="mt-1 font-serif text-3xl text-slate-900">Enquire about {product.name}</h2>
        <p className="mt-2 text-sm text-slate-600">Share your details and we’ll continue the conversation on WhatsApp.</p>
      </div>
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
        <Field label="Full Name" name="fullName" value={form.fullName} onChange={update} required />
        <Field label="Mobile Number" name="mobile" type="tel" value={form.mobile} onChange={update} required />
        <Field label="Email" name="email" type="email" value={form.email} onChange={update} required />
        <Field label="Company (Optional)" name="company" value={form.company} onChange={update} />
        <Field label="City" name="city" value={form.city} onChange={update} required />
        <label className="grid gap-1.5 sm:col-span-2"><span className="text-sm font-bold text-slate-700">Message</span><textarea name="message" value={form.message} onChange={update} rows="4" required className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-[#79259c] focus:ring-2 focus:ring-[#c578e0]/30" /></label>
        {!adminNumber && <p className="sm:col-span-2 text-sm text-red-600">WhatsApp is not configured yet. Add VITE_WHATSAPP_ADMIN_NUMBER to your environment.</p>}
        <div className="sm:col-span-2"><Button type="submit" disabled={!adminNumber} className="w-full sm:w-auto">Submit Enquiry</Button></div>
      </form>
    </Modal>
  );
}

function Field({ label, ...inputProps }) {
  return <label className="grid gap-1.5"><span className="text-sm font-bold text-slate-700">{label}</span><input {...inputProps} className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-[#79259c] focus:ring-2 focus:ring-[#c578e0]/30" /></label>;
}
