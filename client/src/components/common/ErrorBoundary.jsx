import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#0A1F12', padding: 32,
        }}>
          <div style={{
            background: 'rgba(255,138,101,0.08)', border: '1px solid rgba(255,138,101,0.25)',
            borderRadius: 16, padding: '40px 48px', maxWidth: 480, textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🌿</div>
            <h2 style={{ color: '#F0FFF4', fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ color: 'rgba(240,255,244,0.55)', fontSize: 14, marginBottom: 24 }}>
              {this.state.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#6EDC5F', color: '#0A1F12', border: 'none',
                borderRadius: 8, padding: '10px 24px', fontWeight: 700,
                cursor: 'pointer', fontSize: 14,
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
