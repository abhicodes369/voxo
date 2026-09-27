import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../lib/store'

export function Toast() {
  const { toast } = useStore()
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center px-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 460, damping: 32 }}
            className="glass rounded-full px-5 py-3 text-sm font-medium"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
