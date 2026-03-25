import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

const CALENDAR_URL = "https://calendar.google.com/calendar/u/0/r";
const EVENT_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Bestie+Birthday+Celebration&details=Celebrate+the+birthday+girl%21&location=Favorite+Cafe&dates=20260324T180000Z/20260324T210000Z";

function Btn({ label, onPress }) {
  return (
    <Pressable style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

export default function CalendarScreen() {
  return (
    <PinkBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Attach Google Calendar</Text>
        <Text style={styles.desc}>
          Use these buttons to open Google Calendar and quickly add a birthday event.
        </Text>
        <Btn label="Open Google Calendar" onPress={() => Linking.openURL(CALENDAR_URL)} />
        <Btn label="Add Birthday Event" onPress={() => Linking.openURL(EVENT_URL)} />
        <Text style={styles.tip}>Tip: Sign in with your Google account in browser if prompted.</Text>
      </View>
    </PinkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { color: theme.textPrimary, fontSize: 28, fontWeight: "800", textAlign: "center" },
  desc: {
    color: theme.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: theme.salmonPink,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  btnText: { color: theme.textPrimary, textAlign: "center", fontWeight: "700", fontSize: 16 },
  tip: { color: theme.textMuted, textAlign: "center", marginTop: 8 },
});
