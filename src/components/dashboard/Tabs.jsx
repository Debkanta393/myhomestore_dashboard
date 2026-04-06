import { motion } from "framer-motion";

export default function Tabs({ options, value, onChange }) {
  return (
    <div className="flex gap-1 bg-bg border border-border rounded-lg p-[3px]">
      {options.map((opt) => (
        <motion.button
          key={opt}
          onClick={() => onChange(opt)}
          whileTap={{ scale: 0.95 }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer
            ${value === opt ? "bg-primary text-white" : "bg-transparent text-muted hover:text-tx"}`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  );
}