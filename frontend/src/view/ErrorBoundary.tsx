import React from 'react'

interface State {
  hasError: boolean
}

interface Props {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<Props, State> {
  
  state = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Error Boundary catch</h1>
    }

    return this.props.children
  }
}