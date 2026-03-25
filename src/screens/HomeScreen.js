import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

const background = require("../../assets/background.jpg");

export default function HomeScreen() {
  return (
    <PinkBackground image={background}>
      <View style={styles.container}>
        <Text style={styles.title}>Happy Birthday, Bestie! 🎂</Text>
        <Text style={styles.message}>
          You make every day brighter, kinder, and more fun. I am so lucky to have you in my
          life. Wishing you a year full of laughter, love, and big wins.
        </Text>
        <View style={styles.footer}>
          <Text style={styles.footerLine1}>Made with love for birthday girl</Text>
          <Text style={styles.footerLine2}>Bestie Forever ✨</Text>
        </View>
      </View>
    </PinkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", alignItems: "center", padding: 20 },
  title: {
    marginTop: 90,
    color: theme.textPrimary,
    fontSize: 33,
    textAlign: "center",
    fontWeight: "900",
  },
  message: {
    color: theme.textPrimary,
    fontSize: 20,
    textAlign: "center",
    lineHeight: 30,
    padding: 16,
    backgroundColor: "rgba(227,122,156,0.3)",
    borderRadius: 16,
  },
  footer: { marginBottom: 24, alignItems: "center" },
  footerLine1: { color: theme.textPrimary, fontWeight: "700" },
  footerLine2: { color: theme.textSecondary, marginTop: 4 },
});
