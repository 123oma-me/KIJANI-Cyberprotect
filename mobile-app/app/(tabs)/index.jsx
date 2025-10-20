import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// IMPORTANT: Ensure your Node.js server is running on port 8080!
const BACKEND_URL = 'http://localhost:8080/api/analyse-threat'; 

// --- STYLESHEET ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        paddingTop: 0, 
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 20,
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
    // Fix-It-Now Button Styles
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
    // Attack Button Styles
    attackButton: {
        paddingVertical: 15,
        backgroundColor: '#FFD700', // Yellow/Gold for visibility
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
    },
    attackButtonText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 18,
    },
    // Success/Fixed State Styles
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
    // This is the starting state when the app loads
    score: 99, 
    message: 'System is healthy. Last scan clear.',
    action: 'SAFE',
    status_color: 'green'
};

// --- START OF THE MAIN COMPONENT ---
export default function App() {
    const [securityData, setSecurityData] = useState(initialSecurityData); 
    const [isLoading, setIsLoading] = useState(false);
    const [isFixed, setIsFixed] = useState(false);


    // --- Core Function: Manual Attack Trigger (for Demo) ---
    const triggerAttack = () => {
        // This simulates the Kijani Agent detecting a threat
        setSecurityData({
            score: 45,
            message: "CRITICAL ALERT: Mass file encryption detected! Threat level RED.",
            action: "FIX_IT_NOW",
            status_color: "red"
        });
        setIsFixed(false); 
    };


    // --- Core Function: Manual Status Check (Fetches from Server) ---
    const fetchSecurityStatus = async () => {
        setIsLoading(true);
        setIsFixed(false);
        setSecurityData(initialSecurityData); // Reset to initial state while loading

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    device: 'Office PC 1', 
                    log_trigger: 'manual_check'
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


    // Run the initial check (re-fetch status on load)
useEffect(() => {
    // We intentionally leave this empty. The app will now start with the 
    // initialSecurityData (Score 99) and wait for the user to click the buttons.
}, []); 


    // --- Core Function: The Fix It Now Action ---
    const handleFixItNow = () => {
        // 1. Set the data change that makes the screen turn GREEN (Score 99)
        setSecurityData(prev => ({ 
            ...prev, 
            score: 99, 
            message: "System fixed. All clear. Kijani protection active. Business operations restored instantly via Local Backup Cache.", 
            action: "SAFE",
            status_color: 'green'
        }));
        
        // 2. Set the "fixed" flag last, which hides the red button and shows the success text.
        setIsFixed(true); 
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

    // --- THE RENDER SECTION (THE SCREEN) ---
    return (
        <PaperProvider theme={customTheme}>
            <SafeAreaView style={styles.container}>
                <Title style={styles.header}>Kijani CyberProtect Dashboard</Title>
                <Paragraph style={styles.subheader}>Grow Secure.</Paragraph>

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

                {/* --- INTERACTIVE DEMO CONTROLS (Buttons) --- */}
                <View style={styles.controlContainer}> 
                    
                    {securityData.action === "FIX_IT_NOW" && !isFixed ? (
                        // State: RED ALERT - Show FIX IT NOW Button
                        <TouchableOpacity 
                            onPress={handleFixItNow}
                            style={styles.fixButton}
                        >
                            <Text style={styles.fixButtonText}>
                                FIX IT NOW (Automated Repair)
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        // State: SAFE or FIXED - Show Attack Trigger Button
                        <TouchableOpacity 
                            onPress={triggerAttack}
                            style={styles.attackButton}
                        >
                            <Text style={styles.attackButtonText}>
                                SIMULATE ATTACK
                            </Text>
                        </TouchableOpacity>
                    )}
                    
                    {isFixed && (
                        <View style={styles.successContainer}>
                            <Text style={styles.successText}>✅ System Successfully Repaired!</Text>
                            <Text style={styles.successSubtext}>Risk Score: 99/100</Text>
                        </View>
                    )}
                    
                    <TouchableOpacity onPress={fetchSecurityStatus} style={styles.refreshButton}>
                        <Text style={styles.refreshText}>⟳ Manual Status Check (Returns to Green)</Text>
                    </TouchableOpacity>

                </View> {/* End controlContainer */}
            </SafeAreaView>
        </PaperProvider>
    );
}

// NOTE: The styles object is now defined at the top for structural stability.