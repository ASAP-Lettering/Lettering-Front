import { theme } from "@/styles/theme";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      style={{
        display: "inline-block",
        width: "40px",
        height: "40px",
        border: "2px solid rgba(0, 0, 0, 0.1)",
        borderTopColor: "white",
        borderRadius: "60%",
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.6 }}
    />
  );
};

export default Loader;
