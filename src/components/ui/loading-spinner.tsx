import { motion } from "framer-motion";

export const LoadingSpinner = () => {
    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <motion.div
                    className="w-16 h-16 border-4 border-gray-200 rounded-full"
                    style={{ borderTopColor: "#6366f1" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-4 text-gray-600 text-center"
                >
                    Loading...
                </motion.div>
            </motion.div>
        </div>
    );
};