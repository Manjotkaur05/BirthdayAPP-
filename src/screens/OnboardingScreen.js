import React, { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

const bunny = require("../../assets/bunny.jpg");

export default function OnboardingScreen({ onDone }) {
  const [page, setPage] = useState(0);

  const pages = useMemo(
    () => [
      {
        title: "Welcome, Birthday Queen!",
        subtitle: "A tiny app made with love, pink vibes, and a bunny guide just for you.",
        emoji: "🎀",
      },
      {
        title: "Meet Your Bunny Guide",
        subtitle: "Tap through to explore wishes, a calendar helper, and a mini game!",
        emoji: "🐰",
      },
      {
        title: "Ready for the Surprise?",
        subtitle: "Open the app and enjoy your special birthday experience.",
        emoji: "🎉",
      },
    ],
    []
  );

  const current = pages[page];

  return (
    <PinkBackground>
      <View style={styles.container}>
        <Image source={bunny} style={styles.bunny} />
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>

        <View style={styles.dots}>
          {pages.map((_, idx) => (
            <View
              key={String(idx)}
              style={[styles.dot, idx === page ? styles.dotActive : null]}
            />
          ))}
        </View>

        <Pressable
          onPress={() => (page < pages.length - 1 ? setPage(page + 1) : onDone())}
          style={styles.mainBtn}
        >
          <Text style={styles.mainBtnText}>{page === pages.length - 1 ? "Start" : "Next"}</Text>
        </Pressable>

        <Pressable onPress={onDone}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
    </PinkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 18 },
  bunny: { width: "90%", height: 220, borderRadius: 22, marginBottom: 16 },
  emoji: { fontSize: 40, marginBottom: 8 },
  title: { color: theme.textPrimary, fontSize: 28, fontWeight: "800", textAlign: "center" },
  subtitle: {
    color: theme.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },
  dots: { flexDirection: "row", gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 10, backgroundColor: theme.classicPink },
  dotActive: { width: 24, backgroundColor: theme.palePink },
  mainBtn: {
    width: "100%",
    backgroundColor: theme.salmonPink,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  mainBtnText: { color: theme.textPrimary, fontWeight: "700", textAlign: "center", fontSize: 16 },
  skip: { color: theme.textPrimary, fontWeight: "600" },
});
