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
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

interface ValueCardProps {
    icon: string;
    title: string;
    description: string;
}

const ValueCard = ({ icon, title, description }: ValueCardProps) => (
    <motion.div
        variants={fadeInUp}
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
    >
        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className={`fa-solid ${icon} text-2xl text-gray-900 dark:text-gray-100`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

interface TeamMemberProps {
    name: string;
    role: string;
    avatar: string;
}

const TeamMember = ({ name, role, avatar }: TeamMemberProps) => (
    <motion.div
        variants={scaleIn}
        className="flex flex-col items-center"
    >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-4 overflow-hidden">
            <i className={`fa-solid ${avatar} text-3xl text-gray-500 dark:text-gray-400`} />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
    </motion.div>
);

interface TimelineItemProps {
    year: string;
    title: string;
    description: string;
    isLast?: boolean;
}

const TimelineItem = ({ year, title, description, isLast = false }: TimelineItemProps) => (
    <motion.div variants={fadeInUp} className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm">
                {year}
            </div>
            {!isLast && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />}
        </div>
        <div className="pb-8">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
    </motion.div>
);

export const AboutPage = () => {
    const { t } = useTranslation();

    const values = [
        {
            icon: "fa-users",
            title: t("about.valueCommunity"),
            description: t("about.valueCommunityDesc"),
        },
        {
            icon: "fa-shield-halved",
            title: t("about.valueSecurity"),
            description: t("about.valueSecurityDesc"),
        },
        {
            icon: "fa-lightbulb",
            title: t("about.valueInnovation"),
            description: t("about.valueInnovationDesc"),
        },
        {
            icon: "fa-heart",
            title: t("about.valueOpenness"),
            description: t("about.valueOpennessDesc"),
        },
    ];

    const team = [
        { name: t("about.teamMember1Name"), role: t("about.teamMember1Role"), avatar: "fa-user-tie" },
        { name: t("about.teamMember2Name"), role: t("about.teamMember2Role"), avatar: "fa-user-gear" },
        { name: t("about.teamMember3Name"), role: t("about.teamMember3Role"), avatar: "fa-user-pen" },
        { name: t("about.teamMember4Name"), role: t("about.teamMember4Role"), avatar: "fa-user-group" },
    ];

    const timeline = [
        { year: "23", title: t("about.timeline23Title"), description: t("about.timeline23Desc") },
        { year: "24", title: t("about.timeline24Title"), description: t("about.timeline24Desc") },
        { year: "25", title: t("about.timeline25Title"), description: t("about.timeline25Desc") },
    ];

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
                            <i className="fa-solid fa-info-circle" />
                            {t("about.badge")}
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                    >
                        {t("about.heroTitle")}{" "}
                        <span className="text-gray-500 dark:text-gray-400">{t("about.heroTitleHighlight")}</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                    >
                        {t("about.heroDescription")}
                    </motion.p>
                </motion.div>
            </section>

            {/* Mission Section */}
            <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 gap-8 items-center"
                >
                    <motion.div variants={fadeInUp}>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {t("about.missionTitle")}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            {t("about.missionText1")}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {t("about.missionText2")}
                        </p>
                    </motion.div>

                    <motion.div 
                        variants={scaleIn}
                        className="relative"
                    >
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 flex items-center justify-center aspect-square max-w-sm mx-auto">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center mx-auto mb-4">
                                    <i className="fa-solid fa-infinity text-3xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">BlogSpace</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("about.infinitePossibilities")}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Values Section */}
            <section>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {t("about.valuesTitle")}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            {t("about.valuesSubtitle")}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <ValueCard key={index} {...value} />
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Timeline Section */}
            <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {t("about.historyTitle")}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            {t("about.historySubtitle")}
                        </p>
                    </motion.div>

                    <div className="max-w-lg mx-auto">
                        {timeline.map((item, index) => (
                            <TimelineItem 
                                key={index} 
                                {...item} 
                                isLast={index === timeline.length - 1} 
                            />
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Team Section */}
            <section>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {t("about.teamTitle")}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            {t("about.teamSubtitle")}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <TeamMember key={index} {...member} />
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Contact CTA Section */}
            <section>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-neutral-900 dark:bg-neutral-800 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                            {t("about.ctaTitle")}
                        </h2>
                        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                            {t("about.ctaSubtitle")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300"
                            >
                                {t("about.ctaButton")}
                                <i className="fa-solid fa-envelope" />
                            </Link>
                            <a
                                href="mailto:support@blogspace.com"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-300"
                            >
                                support@blogspace.com
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};