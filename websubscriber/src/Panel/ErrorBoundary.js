import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 로깅 또는 에러 리포팅 서비스에 보고
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ hasError: true });
        console.log("ErrorBoundary")

  }

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 대체 UI 렌더링
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;