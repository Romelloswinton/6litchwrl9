import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Galaxy application error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
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
          color: '#87ceeb',
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px',
          }}>
            🌌
          </div>
          
          <h1 style={{
            fontSize: '32px',
            marginBottom: '20px',
            fontWeight: '300',
          }}>
            Galaxy Generation Failed
          </h1>
          
          <p style={{
            fontSize: '16px',
            marginBottom: '30px',
            maxWidth: '600px',
            lineHeight: '1.6',
            opacity: 0.8,
          }}>
            The cosmic forces have aligned against us. There was an error initializing the 3D galaxy visualization.
          </p>
          
          {this.state.error && (
            <details style={{
              marginBottom: '30px',
              maxWidth: '800px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Technical Details
              </summary>
              <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid #87ceeb',
              color: '#87ceeb',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#87ceeb'
              e.currentTarget.style.color = '#000011'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#87ceeb'
            }}
          >
            Restart Galaxy
          </button>
          
          <p style={{
            fontSize: '12px',
            marginTop: '30px',
            opacity: 0.6,
          }}>
            Try refreshing the page or check your browser's developer console for more information.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}