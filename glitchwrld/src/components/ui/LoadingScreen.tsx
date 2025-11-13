import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#000011',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          width: '60px',
          height: '60px',
          border: '3px solid rgba(135, 206, 235, 0.3)',
          borderTop: '3px solid #87ceeb',
          borderRadius: '50%',
          marginBottom: '20px',
        }}
      />
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          color: '#87ceeb',
          fontSize: '24px',
          fontWeight: '300',
          marginBottom: '10px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Loading Galaxy
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          color: '#666',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Generating stellar formations...
      </motion.p>
      
      {/* Animated stars in background */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              backgroundColor: '#87ceeb',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
    </div>
  )
}