import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, Vibration, View } from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

const HIGH_SCORE_KEY = "shine.bunnyPac.highScore";

export default function BioGameScreen() {
  const ROWS = 10;
  const COLS = 10;
  const BASE_OBSTACLES = useMemo(
    () =>
      new Set([
        "1-3", "1-4", "1-5",
        "2-3", "3-3", "4-3",
        "3-6", "4-6", "5-6",
        "6-2", "6-3",
        "7-7", "7-8",
      ]),
    []
  );
  const START = { row: 0, col: 0 };
  const ENEMY_STARTS = useMemo(() => [{ row: 9, col: 9 }, { row: 0, col: 9 }], []);
  const THIRD_ENEMY_START = { row: 9, col: 0 };
  const MOVING_OBSTACLE_SEEDS = useMemo(
    () => [
      { row: 6, col: 4, dr: 0, dc: 1 },
      { row: 8, col: 6, dr: 0, dc: -1 },
    ],
    []
  );
  const initialStrawberries = useMemo(
    () => createStrawberries(ROWS, COLS, BASE_OBSTACLES, START, ENEMY_STARTS, MOVING_OBSTACLE_SEEDS),
    [BASE_OBSTACLES, ENEMY_STARTS, MOVING_OBSTACLE_SEEDS]
  );

  const [bunny, setBunny] = useState(START);
  const [enemies, setEnemies] = useState(ENEMY_STARTS);
  const [movingObstacles, setMovingObstacles] = useState(MOVING_OBSTACLE_SEEDS);
  const [running, setRunning] = useState(true);
  const [message, setMessage] = useState("Guide bunny to eat all strawberries! 🍓");
  const [strawberries, setStrawberries] = useState(initialStrawberries);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [highScore, setHighScore] = useState(0);

  const totalStrawberries = initialStrawberries.size;
  const combinedObstacles = useMemo(() => {
    const next = new Set(BASE_OBSTACLES);
    movingObstacles.forEach((item) => next.add(cellKey(item.row, item.col)));
    return next;
  }, [BASE_OBSTACLES, movingObstacles]);

  useEffect(() => {
    loadHighScore();
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      AsyncStorage.setItem(HIGH_SCORE_KEY, String(score));
    }
  }, [score, highScore]);

  useEffect(() => {
    if (!running || gameOver || strawberries.size === 0) return;
    const eatenCount = totalStrawberries - strawberries.size;
    const speedBoost = Math.min(220, eatenCount * 8);
    const timer = setInterval(() => {
      moveEnemies();
    }, 500 - speedBoost);
    return () => clearInterval(timer);
  }, [running, gameOver, strawberries.size, bunny, totalStrawberries, combinedObstacles]);

  useEffect(() => {
    if (!running || gameOver || strawberries.size === 0) return;
    const timer = setInterval(() => {
      moveObstacles();
    }, 850);
    return () => clearInterval(timer);
  }, [running, gameOver, strawberries.size, bunny, enemies, combinedObstacles]);

  useEffect(() => {
    if (!running || gameOver || strawberries.size === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setRunning(false);
          setGameOver(true);
          setMessage("Time up! Bunny needs a retry ⏰");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Vibration.vibrate(160);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, gameOver, strawberries.size]);

  function cellKey(row, col) {
    return `${row}-${col}`;
  }

  function moveBunny(nextDirection) {
    if (!running || gameOver || strawberries.size === 0) return;
    let { row, col } = bunny;
    if (nextDirection === "up") row -= 1;
    if (nextDirection === "down") row += 1;
    if (nextDirection === "left") col -= 1;
    if (nextDirection === "right") col += 1;

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
    if (combinedObstacles.has(cellKey(row, col))) return;

    const nextPos = { row, col };
    setBunny(nextPos);

    if (enemies.some((enemy) => enemy.row === nextPos.row && enemy.col === nextPos.col)) {
      loseLife();
      return;
    }

    const key = cellKey(row, col);
    if (strawberries.has(key)) {
      const next = new Set(strawberries);
      next.delete(key);
      setStrawberries(next);
      setScore((current) => current + 10 * combo);
      setCombo((current) => Math.min(6, current + 1));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Vibration.vibrate(15);
      if (next.size === 0) {
        setRunning(false);
        setMessage("Yay! Bunny ate all strawberries! 🐰🍓");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Vibration.vibrate(120);
      }
    } else {
      setCombo(1);
    }
  }

  function moveEnemies() {
    setEnemies((current) => {
      const nextEnemies = current.map((enemy) => nextEnemyStep(enemy, bunny, combinedObstacles, ROWS, COLS));
      if (nextEnemies.some((enemy) => enemy.row === bunny.row && enemy.col === bunny.col)) {
        loseLife();
      }
      return nextEnemies;
    });
  }

  function moveObstacles() {
    setMovingObstacles((current) =>
      current.map((item) => {
        let nextRow = item.row + item.dr;
        let nextCol = item.col + item.dc;
        let nextDr = item.dr;
        let nextDc = item.dc;
        const blocked =
          nextRow < 0 ||
          nextRow >= ROWS ||
          nextCol < 0 ||
          nextCol >= COLS ||
          BASE_OBSTACLES.has(cellKey(nextRow, nextCol)) ||
          (nextRow === START.row && nextCol === START.col);
        if (blocked) {
          nextDr = -item.dr;
          nextDc = -item.dc;
          nextRow = item.row + nextDr;
          nextCol = item.col + nextDc;
        }
        return { row: nextRow, col: nextCol, dr: nextDr, dc: nextDc };
      })
    );
  }

  function loseLife() {
    setLives((current) => {
      const nextLives = current - 1;
      if (nextLives <= 0) {
        setGameOver(true);
        setRunning(false);
        setMessage("Game over! Bunny got caught too many times 💥");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Vibration.vibrate(160);
        return 0;
      }
      setBunny(START);
      setEnemies((currentEnemies) => currentEnemies.map((_, idx) => (idx < 2 ? ENEMY_STARTS[idx] : THIRD_ENEMY_START)));
      setMessage(`Caught! ${nextLives} lives left. Keep going!`);
      setCombo(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Vibration.vibrate(80);
      return nextLives;
    });
  }

  function resetGame() {
    setBunny(START);
    setEnemies(ENEMY_STARTS);
    setMovingObstacles(MOVING_OBSTACLE_SEEDS);
    setRunning(true);
    setGameOver(false);
    setLives(3);
    setTimeLeft(90);
    setScore(0);
    setCombo(1);
    setMessage("Guide bunny to eat all strawberries! 🍓");
    setStrawberries(createStrawberries(ROWS, COLS, BASE_OBSTACLES, START, ENEMY_STARTS, MOVING_OBSTACLE_SEEDS));
  }

  useEffect(() => {
    const eaten = totalStrawberries - strawberries.size;
    if (eaten >= Math.ceil(totalStrawberries * 0.5) && enemies.length === 2) {
      setEnemies((current) => [...current, THIRD_ENEMY_START]);
      setMessage("Challenge up! Third enemy entered the maze 👾");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [strawberries.size, totalStrawberries, enemies.length]);

  async function loadHighScore() {
    try {
      const raw = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      if (!raw) return;
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) {
        setHighScore(parsed);
      }
    } catch {
      // Ignore read failure and keep playing.
    }
  }

  function endGame() {
    setRunning(false);
    setGameOver(true);
    setMessage("Game ended. Tap Reset to play again.");
    setCombo(1);
  }

  return (
    <PinkBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Bunny Pac Game 🐰</Text>
        <Text style={styles.desc}>Pink maze + obstacles. Eat all strawberry balls!</Text>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>Eaten: {totalStrawberries - strawberries.size}</Text>
          <Text style={styles.statText}>Left: {strawberries.size}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>Lives: {lives}</Text>
          <Text style={styles.statText}>Time: {timeLeft}s</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>Score: {score}</Text>
          <Text style={styles.statText}>Combo: x{combo}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>Highest Score: {highScore}</Text>
          <Text style={styles.statText}>Mode: Hard</Text>
        </View>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.grid}>
          {Array.from({ length: ROWS }).map((_, row) => (
            <View key={`r-${row}`} style={styles.gridRow}>
              {Array.from({ length: COLS }).map((__, col) => {
                const key = cellKey(row, col);
                const isBunny = bunny.row === row && bunny.col === col;
                const isEnemy = enemies.some((enemy) => enemy.row === row && enemy.col === col);
                const isObstacle = combinedObstacles.has(key);
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
                    {!isBunny && isEnemy ? <Text style={styles.cellEmoji}>👾</Text> : null}
                    {!isBunny && isStrawberry ? <Text style={styles.cellEmoji}>🍓</Text> : null}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.controlBtn} onPress={() => moveBunny("up")}>
            <Text style={styles.controlText}>↑</Text>
          </Pressable>
          <View style={styles.middleControls}>
            <Pressable style={styles.controlBtn} onPress={() => moveBunny("left")}>
              <Text style={styles.controlText}>←</Text>
            </Pressable>
            <Pressable style={styles.controlBtn} onPress={() => moveBunny("right")}>
              <Text style={styles.controlText}>→</Text>
            </Pressable>
          </View>
          <Pressable style={styles.controlBtn} onPress={() => moveBunny("down")}>
            <Text style={styles.controlText}>↓</Text>
          </Pressable>
        </View>

        <Pressable style={[styles.btn, !running ? styles.btnMuted : null]} onPress={() => setRunning((v) => !v)}>
          <Text style={styles.btnText}>{running ? "Pause" : "Resume"}</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={endGame}>
          <Text style={styles.btnText}>End Game</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={resetGame}>
          <Text style={styles.secondaryBtnText}>Reset</Text>
        </Pressable>
      </ScrollView>
    </PinkBackground>
  );
}

function createStrawberries(rows, cols, obstacles, start, enemyStarts, movingSeeds) {
  const dots = new Set();
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const key = `${r}-${c}`;
      const blockedByEnemy = enemyStarts.some((enemy) => enemy.row === r && enemy.col === c);
      const blockedByMoving = movingSeeds.some((item) => item.row === r && item.col === c);
      if (!obstacles.has(key) && !(r === start.row && c === start.col) && !blockedByEnemy && !blockedByMoving) {
        dots.add(key);
      }
    }
  }
  return dots;
}

function nextEnemyStep(enemy, bunny, obstacles, rows, cols) {
  const candidates = [
    { row: enemy.row - 1, col: enemy.col },
    { row: enemy.row + 1, col: enemy.col },
    { row: enemy.row, col: enemy.col - 1 },
    { row: enemy.row, col: enemy.col + 1 },
  ].filter((pos) => {
    if (pos.row < 0 || pos.row >= rows || pos.col < 0 || pos.col >= cols) return false;
    return !obstacles.has(`${pos.row}-${pos.col}`);
  });

  if (candidates.length === 0) return enemy;

  candidates.sort((a, b) => {
    const da = Math.abs(a.row - bunny.row) + Math.abs(a.col - bunny.col);
    const db = Math.abs(b.row - bunny.row) + Math.abs(b.col - bunny.col);
    return da - db;
  });

  const topChoices = candidates.slice(0, Math.min(2, candidates.length));
  return topChoices[Math.floor(Math.random() * topChoices.length)];
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
