import { motion } from 'framer-motion';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="sub-page placeholder-page">
      <motion.div
        className="placeholder-card glass-panel"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <span>Coming in the next milestone</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="loading-line"><i /></div>
      </motion.div>
    </div>
  );
}
