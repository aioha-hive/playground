import { Component, ErrorInfo, ReactNode } from 'react'

interface State {
  error: Error | null
  info: ErrorInfo | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null, info: null }

  static getDerivedStateFromError(error: Error) {
    return { error, info: null }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info })
    ;(window as { __lastError?: unknown }).__lastError = { message: error.message, stack: error.stack, componentStack: info.componentStack }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="m-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded">
          <h2 className="font-bold text-red-800 dark:text-red-200 mb-2">Render error</h2>
          <pre className="whitespace-pre-wrap text-xs text-red-900 dark:text-red-100">
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          {this.state.info?.componentStack && (
            <pre className="mt-3 text-[10px] text-red-700 dark:text-red-300 whitespace-pre-wrap">
              {this.state.info.componentStack}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
