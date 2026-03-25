import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, Vibration, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

export default function BioGameScreen() {
  const [lipstick, setLipstick] = useState(theme.salmonPink);
  const [blush, setBlush] = useState(theme.classicPink);
  const [eyeshadow, setEyeshadow] = useState(theme.cherryBlossom);
  const [lookMessage, setLookMessage] = useState("Create your cutest birthday glam look! ✨");
  const [tapSound, setTapSound] = useState(null);
  const [winSound, setWinSound] = useState(null);

  const colorChoices = [theme.palePink, theme.classicPink, theme.cherryBlossom, theme.lightPink, theme.salmonPink];

  useEffect(() => {
    let mounted = true;

    async function loadSounds() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });
        const tap = await Audio.Sound.createAsync({
          uri: "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
        });
        const win = await Audio.Sound.createAsync({
          uri: "https://actions.google.com/sounds/v1/cartoon/concussive_drum_hit.ogg",
        });
        if (!mounted) {
          await tap.sound.unloadAsync();
          await win.sound.unloadAsync();
          return;
        }
        setTapSound(tap.sound);
        setWinSound(win.sound);
      } catch {
        // Sound is optional; game still works without audio.
      }
    }

    loadSounds();

    return () => {
      mounted = false;
      if (tapSound) tapSound.unloadAsync();
      if (winSound) winSound.unloadAsync();
    };
  }, []);

  function playTapFeedback() {
    if (tapSound) {
      tapSound.replayAsync();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Vibration.vibrate(20);
  }

  function randomizeLook() {
    playTapFeedback();
    setLipstick(colorChoices[Math.floor(Math.random() * colorChoices.length)]);
    setBlush(colorChoices[Math.floor(Math.random() * colorChoices.length)]);
    setEyeshadow(colorChoices[Math.floor(Math.random() * colorChoices.length)]);
    setLookMessage("Fresh makeover generated! 💄");
  }

  function revealStyle() {
    if (winSound) {
      winSound.replayAsync();
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Vibration.vibrate(120);
    const styles = [
      "Soft Princess Look 👑",
      "Cherry Blossom Glow 🌸",
      "Classic Pink Muse 🎀",
      "Salmon Chic Star 💫",
    ];
    setLookMessage(styles[Math.floor(Math.random() * styles.length)]);
  }

  function resetLook() {
    setLipstick(theme.salmonPink);
    setBlush(theme.classicPink);
    setEyeshadow(theme.cherryBlossom);
    setLookMessage("Create your cutest birthday glam look! ✨");
  }

  return (
    <PinkBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Makeup Stylist 💄</Text>
        <Text style={styles.desc}>Pick shades and style your birthday-glam bestie look.</Text>

        <View style={styles.faceCard}>
          <View style={styles.face}>
            <View style={[styles.eyeShadow, styles.leftEye, { backgroundColor: eyeshadow }]} />
            <View style={[styles.eyeShadow, styles.rightEye, { backgroundColor: eyeshadow }]} />
            <View style={[styles.blush, styles.leftBlush, { backgroundColor: blush }]} />
            <View style={[styles.blush, styles.rightBlush, { backgroundColor: blush }]} />
            <View style={[styles.lips, { backgroundColor: lipstick }]} />
          </View>
          <Text style={styles.lookMessage}>{lookMessage}</Text>
        </View>

        <Text style={styles.sectionTitle}>Lipstick</Text>
        <ColorRow colors={colorChoices} onPick={(c) => { playTapFeedback(); setLipstick(c); }} />

        <Text style={styles.sectionTitle}>Eyeshadow</Text>
        <ColorRow colors={colorChoices} onPick={(c) => { playTapFeedback(); setEyeshadow(c); }} />

        <Text style={styles.sectionTitle}>Blush</Text>
        <ColorRow colors={colorChoices} onPick={(c) => { playTapFeedback(); setBlush(c); }} />

        <Pressable style={styles.btn} onPress={randomizeLook}>
          <Text style={styles.btnText}>Random Style</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={revealStyle}>
          <Text style={styles.btnText}>Reveal My Style</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={resetLook}>
          <Text style={styles.secondaryBtnText}>Reset</Text>
        </Pressable>
      </View>
    </PinkBackground>
  );
}

function ColorRow({ colors, onPick }) {
  return (
    <View style={styles.colorRow}>
      {colors.map((color) => (
        <Pressable
          key={color}
          onPress={() => onPick(color)}
          style={[styles.colorDot, { backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, justifyContent: "center" },
  title: { color: theme.textPrimary, fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  desc: { color: theme.textSecondary, textAlign: "center", fontSize: 16, marginBottom: 14 },
  faceCard: {
    backgroundColor: "rgba(239,196,211,0.5)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  face: {
    width: 140,
    height: 170,
    borderRadius: 80,
    backgroundColor: theme.palePink,
    position: "relative",
  },
  eyeShadow: {
    width: 36,
    height: 16,
    borderRadius: 8,
    position: "absolute",
    top: 54,
    opacity: 0.85,
  },
  leftEye: { left: 24 },
  rightEye: { right: 24 },
  blush: {
    width: 30,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    top: 88,
    opacity: 0.75,
  },
  leftBlush: { left: 18 },
  rightBlush: { right: 18 },
  lips: {
    width: 42,
    height: 14,
    borderRadius: 9,
    position: "absolute",
    bottom: 34,
    alignSelf: "center",
  },
  lookMessage: { color: theme.textPrimary, marginTop: 10, fontWeight: "700" },
  sectionTitle: { color: theme.textPrimary, fontWeight: "700", marginTop: 4, marginBottom: 6 },
  colorRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  colorDot: { width: 30, height: 30, borderRadius: 20, borderWidth: 2, borderColor: theme.classicPink },
  btn: { backgroundColor: theme.salmonPink, borderRadius: 12, paddingVertical: 14, marginTop: 6 },
  btnText: { color: theme.textPrimary, textAlign: "center", fontWeight: "700", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: theme.lightPink,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 10,
  },
  secondaryBtnText: { color: theme.textPrimary, textAlign: "center", fontWeight: "700" },
});
