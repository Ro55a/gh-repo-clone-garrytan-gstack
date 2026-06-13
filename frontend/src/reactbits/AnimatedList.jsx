import { motion, AnimatePresence } from 'framer-motion'

export default function AnimatedList({ items = [], renderItem, keyFn, className = '' }) {
  return (
    <ul className={className}>
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.li
            key={keyFn ? keyFn(item) : i}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
          >
            {renderItem(item, i)}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
