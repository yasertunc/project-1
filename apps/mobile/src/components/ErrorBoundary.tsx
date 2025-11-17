import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
// import * as SentryExpo from "sentry-expo"; // Temporarily disabled - Sentry removed due to RCT-Folly dependency issue
import { palette } from "../theme/tokens";

type ErrorBoundaryProps = {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report to Sentry if available (temporarily disabled)
    // try {
    //   // sentry-expo uses Native.captureException for React Native
    //   if (SentryExpo.Native?.captureException) {
    //     SentryExpo.Native.captureException(error, {
    //       contexts: {
    //         react: {
    //           componentStack: errorInfo.componentStack,
    //         },
    //       },
    //     });
    //   }
    // } catch (sentryError) {
    //   // Sentry not initialized or error in Sentry itself
    //   if (__DEV__) {
    //     console.warn("Failed to report error to Sentry:", sentryError);
    //   }
    // }
    
    // Log error to console for now
    if (__DEV__) {
      console.error("ErrorBoundary caught error:", error, errorInfo);
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else if (__DEV__) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            backgroundColor: palette.background.light,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: palette.text.primary,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: palette.text.secondary,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity
            onPress={this.handleReset}
            style={{
              backgroundColor: palette.primary.main,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
            accessibilityRole="button"
            accessibilityLabel="Retry"
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
