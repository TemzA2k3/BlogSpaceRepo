import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { sendContactMessage, type ContactSubject } from "@/shared/services/contactService";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

interface ContactCardProps {
    icon: string;
    title: string;
    value: string;
    link?: string;
}

const ContactCard = ({ icon, title, value, link }: ContactCardProps) => (
    <motion.div
        variants={fadeInUp}
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow duration-300"
    >
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className={`fa-solid ${icon} text-xl text-gray-900 dark:text-gray-100`} />
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
        {link ? (
            <a
                href={link}
                className="text-gray-900 dark:text-white font-semibold hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                {value}
            </a>
        ) : (
            <p className="text-gray-900 dark:text-white font-semibold">{value}</p>
        )}
    </motion.div>
);

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            variants={fadeInUp}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
            >
                <span className="font-medium text-gray-900 dark:text-white">{question}</span>
                <motion.i
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="fa-solid fa-chevron-down text-gray-500 dark:text-gray-400"
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
            >
                <p className="px-6 py-4 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 text-sm leading-relaxed">
                    {answer}
                </p>
            </motion.div>
        </motion.div>
    );
};

export const ContactPage = () => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);

    const contactInfo = [
        { icon: "fa-envelope", title: t("contact.email"), value: "support@blogspace.com", link: "mailto:support@blogspace.com" },
        { icon: "fa-phone", title: t("contact.phone"), value: "+370 999 12 345", link: "tel:+37099912345" },
        { icon: "fa-location-dot", title: t("contact.address"), value: t("contact.addressValue") },
        { icon: "fa-clock", title: t("contact.workingHours"), value: t("contact.workingHoursValue") },
    ];

    const faqItems = [
        { question: t("contact.faq1Question"), answer: t("contact.faq1Answer") },
        { question: t("contact.faq2Question"), answer: t("contact.faq2Answer") },
        { question: t("contact.faq3Question"), answer: t("contact.faq3Answer") },
        { question: t("contact.faq4Question"), answer: t("contact.faq4Answer") },
        { question: t("contact.faq5Question"), answer: t("contact.faq5Answer") },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            await sendContactMessage({
                name: formData.name,
                email: formData.email,
                subject: formData.subject as ContactSubject,
                message: formData.message,
            });

            showAlert(t("contact.messageSent"), "success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err: any) {
            showAlert(err.message || t("contact.messageError"), "error");
        } finally {
            setSending(false);
        }
    };

    const isFormValid = formData.name && formData.email && formData.subject && formData.message;

    return (
        <div className="space-y-16 py-8">
            <section>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center max-w-3xl mx-auto"
                >
                    <motion.div variants={fadeInUp} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                            <i className="fa-solid fa-headset" />
                            {t("contact.badge")}
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                    >
                        {t("contact.heroTitle")}
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                    >
                        {t("contact.heroDescription")}
                    </motion.p>
                </motion.div>
            </section>

            <section>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {contactInfo.map((info, index) => (
                        <ContactCard key={index} {...info} />
                    ))}
                </motion.div>
            </section>

            <section className="grid lg:grid-cols-2 gap-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        {t("contact.formTitle")}
                    </motion.h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("contact.nameLabel")}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent outline-none transition-all"
                                    placeholder={t("contact.namePlaceholder")}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("contact.emailLabel")}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent outline-none transition-all"
                                    placeholder={t("contact.emailPlaceholder")}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("contact.subjectLabel")}
                            </label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">{t("contact.subjectPlaceholder")}</option>
                                <option value="general">{t("contact.subjectGeneral")}</option>
                                <option value="technical">{t("contact.subjectTechnical")}</option>
                                <option value="billing">{t("contact.subjectBilling")}</option>
                                <option value="partnership">{t("contact.subjectPartnership")}</option>
                                <option value="feedback">{t("contact.subjectFeedback")}</option>
                                <option value="other">{t("contact.subjectOther")}</option>
                            </select>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("contact.messageLabel")}
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent outline-none transition-all resize-none"
                                placeholder={t("contact.messagePlaceholder")}
                            />
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <button
                                type="submit"
                                disabled={!isFormValid || sending}
                                className="w-full px-6 py-4 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin" />
                                        {t("contact.sending")}
                                    </>
                                ) : (
                                    <>
                                        {t("contact.sendMessage")}
                                        <i className="fa-solid fa-paper-plane" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="space-y-6"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {t("contact.socialTitle")}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: "fa-telegram", name: "Telegram", link: "#", hover: "hover:bg-blue-500 dark:hover:bg-blue-600" },
                                { icon: "fa-vk", name: "VK", link: "#", hover: "hover:bg-blue-600 dark:hover:bg-blue-700" },
                                { icon: "fa-twitter", name: "Twitter", link: "#", hover: "hover:bg-sky-500 dark:hover:bg-sky-600" },
                                { icon: "fa-youtube", name: "YouTube", link: "#", hover: "hover:bg-red-600 dark:hover:bg-red-700" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    className={`group flex items-center gap-3 p-4 rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 ${social.hover} hover:text-white transition-all duration-300 dark:shadow-md dark:hover:shadow-lg`}
                                >
                                    <i className={`fa-brands ${social.icon} text-xl`} />
                                    <span className="font-medium">{social.name}</span>
                                    <i className="fa-solid fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-800 dark:to-neutral-600 rounded-3xl p-8 text-white"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <i className="fa-solid fa-bolt text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t("contact.fastResponseTitle")}</h3>
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    {t("contact.fastResponseText")}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-48 overflow-hidden"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d509.97385060836115!2d25.253333607922144!3d54.67553936314658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd95a83cf60ce5%3A0x9bd6f182d9a6aca5!2sSchool%20of%20Digital%20Technologies%20-%20EHU%20Informatics%20Program!5e0!3m2!1sru!2slt!4v1766783813876!5m2!1sru!2slt"
                            className="w-full h-full border-0"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>
                </motion.div>
            </section>

            <section>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {t("contact.faqTitle")}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            {t("contact.faqSubtitle")}
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-3">
                        {faqItems.map((item, index) => (
                            <FAQItem key={index} {...item} />
                        ))}
                    </div>
                </motion.div>
            </section>
        </div>
    );
};