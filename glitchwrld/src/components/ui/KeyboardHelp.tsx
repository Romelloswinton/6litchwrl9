/**
 * Keyboard Controls Help Overlay
 * Shows users available keyboard shortcuts
 */

import { useState } from 'react'

export function KeyboardHelp() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(20, 20, 40, 0.8)',
          border: '1px solid #4A90E2',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: '#87ceeb',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1001,
          backdropFilter: 'blur(5px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(74, 144, 226, 0.3)'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(20, 20, 40, 0.8)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        title="Keyboard Controls"
      >
        ?
      </button>

      {/* Help Overlay */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: 'rgba(0, 0, 17, 0.95)',
            border: '1px solid #4A90E2',
            borderRadius: '12px',
            padding: '20px',
            color: '#87ceeb',
            fontSize: '14px',
            zIndex: 1000,
            maxWidth: '350px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(74, 144, 226, 0.3)',
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', color: '#FDB813', fontSize: '18px' }}>
            ⌨️ Keyboard Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Section title="Navigation">
              <Control keys="Arrow Keys / WASD" action="Rotate & move camera" />
              <Control keys="Q / E (or - / +)" action="Zoom in / out" />
              <Control keys="Spacebar" action="Reset camera view" />
            </Section>

            <Section title="Planet Focus (1-8)">
              <Control keys="1" action="Focus on Mercury" />
              <Control keys="2" action="Focus on Venus" />
              <Control keys="3" action="Focus on Earth" />
              <Control keys="4" action="Focus on Mars" />
              <Control keys="5" action="Focus on Jupiter" />
              <Control keys="6" action="Focus on Saturn" />
              <Control keys="7" action="Focus on Uranus" />
              <Control keys="8" action="Focus on Neptune" />
            </Section>
          </div>

          <p style={{
            marginTop: '15px',
            fontSize: '12px',
            color: '#888',
            borderTop: '1px solid #333',
            paddingTop: '10px',
            marginBottom: '0'
          }}>
            💡 Tip: Use mouse to orbit and zoom with OrbitControls
          </p>
        </div>
      )}
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontWeight: 'bold',
        marginBottom: '6px',
        color: '#FDB813',
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {children}
      </div>
    </div>
  )
}

function Control({ keys, action }: { keys: string; action: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 0'
    }}>
      <span style={{
        background: 'rgba(74, 144, 226, 0.2)',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        border: '1px solid rgba(74, 144, 226, 0.3)',
        minWidth: '120px',
        textAlign: 'center'
      }}>
        {keys}
      </span>
      <span style={{ marginLeft: '12px', fontSize: '12px', color: '#bbb' }}>
        {action}
      </span>
    </div>
  )
}
