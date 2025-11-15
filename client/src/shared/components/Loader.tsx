import { motion } from "framer-motion";

export const Loader = () => {
  return (
    <div className="w-full flex justify-center py-10">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-500"
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};
