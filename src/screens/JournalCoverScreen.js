import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

const journalCover = require("../../assets/journal-cover.jpg");

export default function JournalCoverScreen({ navigation }) {
  return (
    <PinkBackground image={journalCover}>
      <View style={styles.container}>
        <Text style={styles.title}>Personal Journal</Text>
        <Text style={styles.subtitle}>
          Open your cover page, then write your thoughts on journal pages.
        </Text>
        <Pressable style={styles.btn} onPress={() => navigation.navigate("JournalWrite")}>
          <Text style={styles.btnText}>Open Journal Pages</Text>
        </Pressable>
      </View>
    </PinkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { color: theme.palePink, fontSize: 34, fontWeight: "900", textAlign: "center", marginBottom: 10 },
  subtitle: { color: theme.classicPink, textAlign: "center", lineHeight: 22, marginBottom: 16 },
  btn: { backgroundColor: theme.salmonPink, borderRadius: 12, paddingVertical: 14 },
  btnText: { color: theme.palePink, textAlign: "center", fontWeight: "700", fontSize: 16 },
});
