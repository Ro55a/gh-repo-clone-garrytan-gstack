import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function CardStack({ cards = [], renderCard }) {
  return (
    <div className="relative w-full">
      {cards.map((card, i) => {
        const offset = i * 8
        const scale = 1 - i * 0.04
        const zIndex = cards.length - i

        return (
          <motion.div
            key={card.id || i}
            initial={{ y: offset, scale, zIndex }}
            whileHover={i === 0 ? { y: -4 } : {}}
            style={{
              position: i === 0 ? 'relative' : 'absolute',
              top: i === 0 ? 0 : offset,
              left: 0,
              right: 0,
              zIndex,
              transformOrigin: 'top center',
            }}
            animate={{ y: offset, scale }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {renderCard(card, i)}
          </motion.div>
        )
      })}
    </div>
  )
}
