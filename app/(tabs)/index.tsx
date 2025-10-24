import { Redirect } from 'expo-router';

// This file is the entry point for the root URL '/'
// It immediately redirects to your main application screen (usually in tabs)
export default function InitialRootRedirect() {
  return <Redirect href="/(tabs)" />; 
}