import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, Vibration, View } from "react-native";
import * as Haptics from "expo-haptics";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

export default function BioGameScreen() {
  const ROWS = 10;
  const COLS = 10;
  const OBSTACLES = useMemo(
    () =>
      new Set([
        "1-3", "1-4", "1-5",
        "2-3", "3-3", "4-3",
        "3-6", "4-6", "5-6",
        "6-2", "6-3", "6-4",
        "7-7", "7-8", "8-7",
      ]),
    []
  );
  const START = { row: 0, col: 0 };

  const [bunny, setBunny] = useState(START);
  const [direction, setDirection] = useState("right");
  const [running, setRunning] = useState(true);
  const [message, setMessage] = useState("Guide bunny to eat all strawberries! 🍓");
  const [strawberries, setStrawberries] = useState(() => createStrawberries(ROWS, COLS, OBSTACLES, START));

  const totalStrawberries = strawberries.size;

  useEffect(() => {
    if (!running || strawberries.size === 0) return;
    const timer = setInterval(() => {
      moveBunny(direction);
    }, 330);
    return () => clearInterval(timer);
  }, [direction, running, strawberries.size]);

  function cellKey(row, col) {
    return `${row}-${col}`;
  }

  function moveBunny(nextDirection) {
    setBunny((prev) => {
      let { row, col } = prev;
      if (nextDirection === "up") row -= 1;
      if (nextDirection === "down") row += 1;
      if (nextDirection === "left") col -= 1;
      if (nextDirection === "right") col += 1;

      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
        return prev;
      }
      if (OBSTACLES.has(cellKey(row, col))) {
        return prev;
      }

      const key = cellKey(row, col);
      setStrawberries((current) => {
        if (!current.has(key)) return current;
        const next = new Set(current);
        next.delete(key);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Vibration.vibrate(15);
        if (next.size === 0) {
          setRunning(false);
          setMessage("Yay! Bunny ate all strawberries! 🐰🍓");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Vibration.vibrate(120);
        }
        return next;
      });

      return { row, col };
    });
  }

  function resetGame() {
    setBunny(START);
    setDirection("right");
    setRunning(true);
    setMessage("Guide bunny to eat all strawberries! 🍓");
    setStrawberries(createStrawberries(ROWS, COLS, OBSTACLES, START));
  }

  return (
    <PinkBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Bunny Pac Game 🐰</Text>
        <Text style={styles.desc}>Pink maze + obstacles. Eat all strawberry balls!</Text>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>Eaten: {totalStrawberries - strawberries.size}</Text>
          <Text style={styles.statText}>Left: {strawberries.size}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.grid}>
          {Array.from({ length: ROWS }).map((_, row) => (
            <View key={`r-${row}`} style={styles.gridRow}>
              {Array.from({ length: COLS }).map((__, col) => {
                const key = cellKey(row, col);
                const isBunny = bunny.row === row && bunny.col === col;
                const isObstacle = OBSTACLES.has(key);
                const isStrawberry = strawberries.has(key);
                return (
                  <View
                    key={key}
                    style={[
                      styles.cell,
                      isObstacle ? styles.obstacle : styles.walkable,
                    ]}
                  >
                    {isBunny ? <Text style={styles.cellEmoji}>🐰</Text> : null}
                    {!isBunny && isStrawberry ? <Text style={styles.cellEmoji}>🍓</Text> : null}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.controlBtn} onPress={() => setDirection("up")}>
            <Text style={styles.controlText}>↑</Text>
          </Pressable>
          <View style={styles.middleControls}>
            <Pressable style={styles.controlBtn} onPress={() => setDirection("left")}>
              <Text style={styles.controlText}>←</Text>
            </Pressable>
            <Pressable style={styles.controlBtn} onPress={() => setDirection("right")}>
              <Text style={styles.controlText}>→</Text>
            </Pressable>
          </View>
          <Pressable style={styles.controlBtn} onPress={() => setDirection("down")}>
            <Text style={styles.controlText}>↓</Text>
          </Pressable>
        </View>

        <Pressable style={[styles.btn, !running ? styles.btnMuted : null]} onPress={() => setRunning((v) => !v)}>
          <Text style={styles.btnText}>{running ? "Pause" : "Resume"}</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={resetGame}>
          <Text style={styles.secondaryBtnText}>Reset</Text>
        </Pressable>
      </View>
    </PinkBackground>
  );
}

function createStrawberries(rows, cols, obstacles, start) {
  const dots = new Set();
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const key = `${r}-${c}`;
      if (!obstacles.has(key) && !(r === start.row && c === start.col)) {
        dots.add(key);
      }
    }
  }
  return dots;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, justifyContent: "center" },
  title: { color: theme.textPrimary, fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  desc: { color: theme.textSecondary, textAlign: "center", fontSize: 15, marginBottom: 8 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  statText: { color: theme.textPrimary, fontWeight: "700" },
  message: { color: theme.textMuted, textAlign: "center", marginBottom: 10, fontWeight: "700" },
  grid: {
    alignSelf: "center",
    backgroundColor: "rgba(239,196,211,0.65)",
    borderRadius: 12,
    padding: 6,
    marginBottom: 10,
  },
  gridRow: { flexDirection: "row" },
  cell: {
    width: 28,
    height: 28,
    margin: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  walkable: { backgroundColor: "rgba(248,223,233,0.95)" },
  obstacle: { backgroundColor: theme.cherryBlossom },
  cellEmoji: { fontSize: 15 },
  controls: { alignItems: "center", marginBottom: 8 },
  middleControls: { flexDirection: "row", gap: 10, marginVertical: 8 },
  controlBtn: {
    width: 52,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.salmonPink,
  },
  controlText: { color: theme.textPrimary, fontSize: 22, fontWeight: "900" },
  btn: { backgroundColor: theme.salmonPink, borderRadius: 12, paddingVertical: 14, marginTop: 6 },
  btnText: { color: theme.textPrimary, textAlign: "center", fontWeight: "700", fontSize: 16 },
  btnMuted: { opacity: 0.65 },
  secondaryBtn: {
    backgroundColor: theme.lightPink,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 10,
  },
  secondaryBtnText: { color: theme.textPrimary, textAlign: "center", fontWeight: "700" },
});
