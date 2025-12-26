import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const contactInfo = [
        { icon: "fa-envelope", title: "Email", value: "support@blogspace.com", link: "mailto:support@blogspace.com" },
        { icon: "fa-phone", title: "Телефон", value: "+7 (999) 123-45-67", link: "tel:+79991234567" },
        { icon: "fa-location-dot", title: "Адрес", value: "Москва, Россия" },
        { icon: "fa-clock", title: "Время работы", value: "Пн-Пт: 9:00 - 18:00" },
    ];

    const faqItems = [
        {
            question: "Как создать аккаунт?",
            answer: "Нажмите кнопку «Регистрация» в правом верхнем углу, заполните форму с вашими данными и подтвердите email. После этого вы сможете начать пользоваться всеми функциями BlogSpace.",
        },
        {
            question: "Как восстановить пароль?",
            answer: "На странице входа нажмите «Забыли пароль?», введите ваш email и следуйте инструкциям в письме. Ссылка для сброса пароля действует 24 часа.",
        },
        {
            question: "Как удалить свой аккаунт?",
            answer: "Перейдите в Настройки → Аккаунт → Удалить аккаунт. Обратите внимание, что это действие необратимо и все ваши данные будут удалены.",
        },
        {
            question: "Как пожаловаться на контент?",
            answer: "Нажмите на три точки рядом с постом и выберите «Пожаловаться». Выберите причину жалобы, и наша команда модерации рассмотрит её в течение 24 часов.",
        },
        {
            question: "Как связаться с поддержкой?",
            answer: "Вы можете написать нам через форму на этой странице, отправить email на support@blogspace.com или связаться с нами в социальных сетях.",
        },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSending(false);
        setSent(true);
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Reset success message after 5 seconds
        setTimeout(() => setSent(false), 5000);
    };

    const isFormValid = formData.name && formData.email && formData.subject && formData.message;

    return (
        <div className="space-y-16 py-8">
            {/* Hero Section */}
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
                            Поддержка
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                    >
                        Свяжитесь с нами
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                    >
                        Есть вопросы или предложения? Мы всегда рады помочь! 
                        Выберите удобный способ связи или заполните форму ниже.
                    </motion.p>
                </motion.div>
            </section>

            {/* Contact Info Cards */}
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

            {/* Contact Form & Map Section */}
            <section className="grid lg:grid-cols-2 gap-8">
                {/* Contact Form */}
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
                        Напишите нам
                    </motion.h2>

                    {sent && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-3"
                        >
                            <i className="fa-solid fa-check-circle" />
                            <span>Сообщение отправлено! Мы ответим вам в ближайшее время.</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ваше имя
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent outline-none transition-all"
                                    placeholder="Иван Иванов"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent outline-none transition-all"
                                    placeholder="ivan@example.com"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Тема обращения
                            </label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Выберите тему</option>
                                <option value="general">Общий вопрос</option>
                                <option value="technical">Техническая проблема</option>
                                <option value="billing">Вопрос по оплате</option>
                                <option value="partnership">Сотрудничество</option>
                                <option value="feedback">Отзыв или предложение</option>
                                <option value="other">Другое</option>
                            </select>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Сообщение
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Опишите ваш вопрос или проблему..."
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
                                        Отправка...
                                    </>
                                ) : (
                                    <>
                                        Отправить сообщение
                                        <i className="fa-solid fa-paper-plane" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

                {/* Social & Additional Info */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="space-y-6"
                >
                    {/* Social Links */}
                    <motion.div
                        variants={fadeInUp}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Мы в социальных сетях
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: "fa-telegram", name: "Telegram", color: "hover:bg-blue-500", link: "#" },
                                { icon: "fa-vk", name: "VK", color: "hover:bg-blue-600", link: "#" },
                                { icon: "fa-twitter", name: "Twitter", color: "hover:bg-sky-500", link: "#" },
                                { icon: "fa-youtube", name: "YouTube", color: "hover:bg-red-600", link: "#" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    className={`flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 ${social.color} hover:text-white transition-all duration-300 group`}
                                >
                                    <i className={`fa-brands ${social.icon} text-xl`} />
                                    <span className="font-medium">{social.name}</span>
                                    <i className="fa-solid fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Response Time */}
                    <motion.div
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-800 dark:to-neutral-600 rounded-3xl p-8 text-white"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <i className="fa-solid fa-bolt text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Быстрый ответ</h3>
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    Среднее время ответа на обращения — 2 часа в рабочее время. 
                                    Для срочных вопросов используйте Telegram.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* FAQ Section */}
            <section>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Часто задаваемые вопросы
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            Ответы на популярные вопросы наших пользователей
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