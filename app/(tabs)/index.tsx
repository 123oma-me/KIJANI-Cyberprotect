import { Redirect } from 'expo-router';

// This component hijacks the default root route (/)
// and immediately redirects the user to the correct nested starting point.
export default function RedirectToApp() {
  // We assume your main screen is inside the (tabs) group.
  return <Redirect href="/(tabs)" />; 
}