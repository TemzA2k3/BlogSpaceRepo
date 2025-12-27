import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
};

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
    <motion.div
        variants={fadeInUp}
        transition={{ duration: 0.5, delay }}
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
            <i className={`fa-solid ${icon} text-xl text-gray-900 dark:text-gray-100`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

interface StatItemProps {
    value: string;
    label: string;
}

const StatItem = ({ value, label }: StatItemProps) => (
    <motion.div variants={scaleIn} className="text-center">
        <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {value}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
);

export const HomePage = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: "fa-pen-to-square",
            title: t("home.featurePostsTitle"),
            description: t("home.featurePostsDesc"),
        },
        {
            icon: "fa-newspaper",
            title: t("home.featureArticlesTitle"),
            description: t("home.featureArticlesDesc"),
        },
        {
            icon: "fa-comments",
            title: t("home.featureChatTitle"),
            description: t("home.featureChatDesc"),
        },
        {
            icon: "fa-users",
            title: t("home.featureFriendsTitle"),
            description: t("home.featureFriendsDesc"),
        },
        {
            icon: "fa-hashtag",
            title: t("home.featureTrendsTitle"),
            description: t("home.featureTrendsDesc"),
        },
        {
            icon: "fa-shield-halved",
            title: t("home.featurePrivacyTitle"),
            description: t("home.featurePrivacyDesc"),
        },
    ];

    return (
        <div className="space-y-16">
            <section className="pt-8 sm:pt-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div variants={fadeInUp} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                            <i className="fa-solid fa-infinity" />
                            {t("home.badge")}
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight flex flex-col items-center gap-2"
                    >
                        <span>{t("home.welcomeTo")}</span>
                        <span className="inline-flex items-center gap-3">
                            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 inline-flex items-center justify-center">
                                <i className="fa-solid fa-infinity text-lg sm:text-xl" />
                            </span>
                            BlogSpace
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        {t("home.heroDescription")}
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold rounded-xl shadow-lg transition-all duration-300"
                        >
                            {t("home.startFree")}
                            <i className="fa-solid fa-arrow-right" />
                        </Link>
                        <Link
                            to="/posts"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                        >
                            {t("home.viewPosts")}
                            <i className="fa-solid fa-eye" />
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16 max-w-4xl mx-auto"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center">
                                        <i className="fa-solid fa-user text-white dark:text-neutral-900 text-xs" />
                                    </div>
                                    <div>
                                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
                                        <div className="h-2 w-16 bg-gray-100 dark:bg-gray-500 rounded mt-1" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded" />
                                    <div className="h-2 w-4/5 bg-gray-100 dark:bg-gray-500 rounded" />
                                </div>
                                <div className="flex gap-4 mt-4 text-gray-400">
                                    <span className="flex items-center gap-1 text-xs">
                                        <i className="fa-solid fa-heart text-red-400" /> 24
                                    </span>
                                    <span className="flex items-center gap-1 text-xs">
                                        <i className="fa-solid fa-comment" /> 8
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600 sm:col-span-2">
                                <div className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg mb-3" />
                                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
                                <div className="space-y-1.5">
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-500 rounded" />
                                    <div className="h-2 w-5/6 bg-gray-100 dark:bg-gray-500 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-12 grid grid-cols-2 sm:grid-cols-4 gap-8"
                >
                    <StatItem value="10K+" label={t("home.statsUsers")} />
                    <StatItem value="50K+" label={t("home.statsPublications")} />
                    <StatItem value="100K+" label={t("home.statsMessages")} />
                    <StatItem value="99%" label="Uptime" />
                </motion.div>
            </section>

            <section>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="text-center mb-12"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        {t("home.featuresTitle")}
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto"
                    >
                        {t("home.featuresSubtitle")}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} delay={index * 0.1} />
                    ))}
                </motion.div>
            </section>

            <section className="pb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-neutral-900 dark:bg-neutral-800 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                    </div>

                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-6 right-6 opacity-10"
                    >
                        <i className="fa-solid fa-infinity text-6xl" />
                    </motion.div>

                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                            {t("home.ctaTitle")}
                        </h2>
                        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                            {t("home.ctaSubtitle")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300"
                            >
                                {t("home.createAccount")}
                                <i className="fa-solid fa-user-plus" />
                            </Link>
                            <Link
                                to="/signin"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-300"
                            >
                                {t("home.alreadyHaveAccount")}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};