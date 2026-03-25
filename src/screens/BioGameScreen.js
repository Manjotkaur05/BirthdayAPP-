import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

export default function BioGameScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFinal, setShowFinal] = useState(false);

  const questions = useMemo(
    () => [
      {
        prompt: "Which phase of mitosis aligns chromosomes at the cell's equator?",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        correct: 1,
      },
      {
        prompt: "What is the primary function of the rough endoplasmic reticulum?",
        options: ["Lipid breakdown", "Protein synthesis", "ATP generation", "DNA replication"],
        correct: 1,
      },
      {
        prompt: "In genetics, what does homozygous mean?",
        options: ["Two different alleles", "No alleles present", "Two identical alleles", "Only dominant alleles"],
        correct: 2,
      },
      {
        prompt: "Which molecule is directly used by ribosomes during translation?",
        options: ["mRNA", "DNA polymerase", "Glycogen", "Cholesterol"],
        correct: 0,
      },
      {
        prompt: "Which biomolecule forms the main structure of cell membranes?",
        options: ["Nucleic acids", "Triglycerides", "Phospholipids", "Starch"],
        correct: 2,
      },
    ],
    []
  );

  function submit() {
    if (selectedAnswer === null) return;
    const isRight = selectedAnswer === questions[currentIndex].correct;
    const nextScore = isRight ? score + 1 : score;
    setScore(nextScore);
    if (currentIndex === questions.length - 1) {
      setShowFinal(true);
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
  }

  function restart() {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFinal(false);
  }

  const q = questions[currentIndex];

  return (
    <PinkBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Bio Mini-Game 🧬</Text>

        {showFinal ? (
          <>
            <Text style={styles.score}>Final Score: {score}/{questions.length}</Text>
            <Text style={styles.desc}>
              {score >= 4 ? "Amazing, future biologist! 🌟" : "Nice try! One more round? 💪"}
            </Text>
            <Pressable style={styles.btn} onPress={restart}>
              <Text style={styles.btnText}>Play Again</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.progress}>Question {currentIndex + 1} of {questions.length}</Text>
            <Text style={styles.prompt}>{q.prompt}</Text>
            {q.options.map((opt, idx) => (
              <Pressable
                key={opt}
                onPress={() => setSelectedAnswer(idx)}
                style={[
                  styles.option,
                  selectedAnswer === idx ? { borderColor: theme.salmonPink, borderWidth: 2 } : null,
                ]}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            ))}
            <Pressable
              style={[styles.btn, selectedAnswer === null ? { opacity: 0.6 } : null]}
              onPress={submit}
            >
              <Text style={styles.btnText}>Submit</Text>
            </Pressable>
          </>
        )}
      </View>
    </PinkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, justifyContent: "center" },
  title: { color: theme.palePink, fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 14 },
  score: { color: theme.palePink, fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 10 },
  desc: { color: theme.classicPink, textAlign: "center", fontSize: 16, marginBottom: 14 },
  progress: { color: theme.lightPink, textAlign: "center", marginBottom: 10, fontWeight: "700" },
  prompt: { color: theme.palePink, textAlign: "center", fontSize: 18, marginBottom: 14, lineHeight: 25 },
  option: { backgroundColor: "rgba(239,196,211,0.95)", borderRadius: 12, padding: 12, marginBottom: 10 },
  optionText: { color: theme.cherryBlossom, fontWeight: "700" },
  btn: { backgroundColor: theme.salmonPink, borderRadius: 12, paddingVertical: 14, marginTop: 6 },
  btnText: { color: theme.palePink, textAlign: "center", fontWeight: "700", fontSize: 16 },
});
