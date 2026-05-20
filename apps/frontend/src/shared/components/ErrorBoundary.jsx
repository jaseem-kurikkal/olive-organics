import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Olive Organics Error]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center px-6"
          style={{ background: '#050a05' }}
        >
          <div className="text-center max-w-md">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-3xl">🌿</span>
            </div>
            <h2
              className="text-white font-light text-3xl mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Something went wrong
            </h2>
            <p className="text-white/40 text-sm mb-8 font-light leading-relaxed">
              We apologize for the inconvenience. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 rounded-full text-white text-sm font-medium uppercase tracking-widest"
              style={{
                background: 'linear-gradient(135deg, #496337, #749c56)',
                boxShadow: '0 10px 30px rgba(73,99,55,0.3)',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
