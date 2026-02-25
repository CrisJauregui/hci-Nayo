import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 24,
          fontFamily: 'system-ui, sans-serif',
          background: '#121212',
          color: '#f0f0f0',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: 16 }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              background: '#1a365d',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Reload app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
