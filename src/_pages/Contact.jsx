import { useState } from "react";
import PageHero from "../components/layout/PageHero";
import Button from "../components/common/Button";
import { catalogService } from "../services/catalogService";
import contactHeroImage from "../assets/images/heroes/contact-stethoscope.jpeg";
import { useLanguage } from "../i18n/LanguageContext";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await catalogService.createContact(formData);
      setSent(true);
    } catch (err) {
      setErrorMsg(err.message || t("contact.error_default"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero title={t("contact.hero_title")} image={contactHeroImage} />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-10 md:px-8 md:py-12">
        {/* Contact Details */}
        <section>
          <p className="text-xs font-bold tracking-widest text-[#79259c]">
            {t("contact.eyebrow")}
          </p>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            {t("contact.title")}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            {t("contact.subtitle")}
          </p>

          <div className="mt-7 grid gap-4 text-sm text-slate-700">
            <p>☎ +244 923 456 789</p>
            <p>✉ info@asmitaangola.com</p>
            <p>⌖ Luanda, Angola</p>
            <p>◉ ♥ ◎ in</p>
          </div>

          <div className="mt-8 grid h-40 place-items-center rounded-xl bg-slate-100 text-center text-sm font-bold text-slate-500 sm:h-44">
            {t("contact.map_label")}
          </div>
        </section>

        {/* Contact Form */}
        <form
          className="grid gap-4 rounded-xl border border-slate-200 p-5 shadow-sm sm:p-6"
          onSubmit={handleSubmit}
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]"
            required
            placeholder={t("contact.placeholder_name")}
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]"
            required
            type="email"
            placeholder={t("contact.placeholder_email")}
          />

          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c]"
            placeholder={t("contact.placeholder_phone")}
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="min-h-28 rounded-lg border border-slate-200 p-3 outline-none focus:border-[#79259c] sm:min-h-32"
            required
            placeholder={t("contact.placeholder_message")}
          />

          {errorMsg && (
            <p className="text-sm text-red-600 font-semibold">{errorMsg}</p>
          )}

          {sent ? (
            <b className="rounded-lg bg-[#f7eafb] p-3 text-center text-[#79259c]">
              {t("contact.success_msg")}
            </b>
          ) : (
            <Button className="w-full sm:w-auto" type="submit" disabled={loading}>
              {loading ? t("contact.btn_sending") : t("contact.btn_send")}
            </Button>
          )}
        </form>
      </main>
    </>
  );
}
