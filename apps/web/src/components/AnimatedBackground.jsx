import { motion } from 'framer-motion';

const particles = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 17) % 88)}%`,
  delay: (index % 5) * 0.7,
  duration: 5 + (index % 4),
}));

export default function AnimatedBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <motion.div
        className="ambient__orb ambient__orb--gold"
        animate={{ x: [0, 18, -9, 0], y: [0, -18, 12, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient__orb ambient__orb--blue"
        animate={{ x: [0, -20, 11, 0], y: [0, 16, -12, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />
      {particles.map((particle) => (
        <motion.span
          className="ambient__particle"
          key={particle.id}
          style={{ left: particle.left }}
          initial={{ y: '105vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.75, 0] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
