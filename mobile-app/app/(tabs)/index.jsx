import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native'; // Added SafeAreaView
import { Card, Title, Paragraph, Button, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// IMPORTANT: Use the IP address your Expo app sees the host machine as. 
// If using Expo Go, this is usually 'http://<YOUR_COMPUTER_IP_ADDRESS>:3000'
const BACKEND_URL = 'http://localhost:8080/api/analyse-threat'; 

const customTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#4CAF50', 
        accent: '#FFD700',  
        success: '#4CAF50',
        danger: '#F44336',
    },
};

const initialSecurityData = {
    score: '--',
    message: 'Initializing Kijani System...',
    action: 'SAFE',
    status_color: 'blue'
};

export default function App() {
  const [securityData, setSecurityData] = useState(initialSecurityData); 
  const [isLoading, setIsLoading] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  // --- Core Function: Fetching AI Analysis ---
  const fetchSecurityStatus = async () => {
    setIsLoading(true);
    setIsFixed(false);
    setSecurityData(initialSecurityData); 

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            device: 'Office PC 1', 
            log_trigger: 'mass_encryption' 
        }),
      });
      const data = await response.json();
      setSecurityData(data);
    } catch (error) {
      console.error("Fetch Error: Check your BACKEND_URL and ensure server.js is running.", error);
      setSecurityData({
        score: 40,
        message: "Network Error: Cannot contact AI Cloud. Local Agent active for critical threats.",
        action: "FIX_IT_NOW",
        status_color: "red"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  // --- Core Function: The Fix It Now Action ---
  const handleFixItNow = () => {
    
    // We are bypassing the Alert, forcing the Green Screen update immediately.
    // The presenter will narrate the "Isolation and Restore" process.
    
    // 1. Set the data change that makes the screen turn GREEN (Score 95)
    setSecurityData(prev => ({ 
        ...prev, 
        score: 95, 
        message: "System fixed. All clear. Kijani protection active. Business operations restored instantly via Local Backup Cache.", 
        action: "SAFE",
        status_color: "green"
    }));
    
    // 2. Set the "fixed" flag last, which hides the red button and shows the success text.
    setIsFixed(true); 

    // Optional: Add a console log to prove the function ran (check your browser's Console/Terminal)
    console.log("Kijani FIX IT NOW executed successfully. State updated to SAFE (95).");
  };

  const getStatusStyle = (color) => { 
    switch (color) {
      case 'red': return styles.scoreRed;
      case 'yellow': return styles.scoreYellow;
      case 'green': return styles.scoreGreen;
      case 'blue': return styles.scoreNeutral;
      default: return styles.scoreNeutral;
    }
  };

  const scoreColor = securityData.status_color; 
  
  return (
    <PaperProvider theme={customTheme}>
      <SafeAreaView style={styles.container}> {/* Using SafeAreaView for better layout */}
        <Title style={styles.header}>Kijani CyberProtect Dashboard</Title>
        <Paragraph style={styles.subheader}>Grow Secure. Grow Strong.</Paragraph>

        <Card style={styles.scoreCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Current Security Score</Title>
            {isLoading || securityData.score === '--' ? (
              <ActivityIndicator size="large" color={customTheme.colors.primary} style={{ marginTop: 20 }} />
            ) : (
              <Text style={[styles.securityScore, getStatusStyle(scoreColor)]}>
                {securityData.score}
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.messageCard}>
            <Card.Content>
                <Title style={styles.cardTitle}>AI-Generated Alert Message</Title>
                <Paragraph style={styles.alertMessage}>
                    {securityData.message}
                </Paragraph>
            </Card.Content>
        </Card>

        {/* --- THE ROBUST BUTTON IMPLEMENTATION --- */}
        {securityData.action === "FIX_IT_NOW" && !isFixed && (
            <TouchableOpacity 
                onPress={handleFixItNow}
                style={styles.fixButton}
            >
                <Text style={styles.fixButtonText}>
                    FIX IT NOW (Automated Repair)
                </Text>
            </TouchableOpacity>
        )}
        
        {isFixed && (
            <View style={styles.successContainer}>
                <Text style={styles.successText}>✅ System Successfully Repaired!</Text>
                <Text style={styles.successSubtext}>Risk Score: 95/100</Text>
            </View>
        )}
        
        <TouchableOpacity onPress={fetchSecurityStatus} style={styles.refreshButton}>
            <Text style={styles.refreshText}>⟳ Manual Status Check</Text>
        </TouchableOpacity>


      </SafeAreaView> {/* Changed to SafeAreaView. You may need to remove the closing tag in your file if Expo Router is wrapping it. */}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 0, // Reset padding top for SafeAreaView
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20, // Added margin for spacing
  },
  subheader: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#777',
    fontStyle: 'italic',
    fontSize: 16
  },
  scoreCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 10,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  securityScore: {
    fontSize: 80,
    fontWeight: '900', 
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  scoreRed: { color: '#F44336' },
  scoreYellow: { color: '#FFD700' },
  scoreGreen: { color: '#4CAF50' },
  scoreNeutral: { color: '#4CAF50' }, 

  messageCard: {
    marginBottom: 30,
    elevation: 2,
    borderRadius: 8,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
  },
  // NEW Button Styles
  fixButton: {
    paddingVertical: 15,
    backgroundColor: '#F44336', // RED color for ALERT
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  fixButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
  },
  successContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50'
  },
  successText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 18,
  },
  successSubtext: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  refreshButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  refreshText: {
    color: '#4CAF50',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});