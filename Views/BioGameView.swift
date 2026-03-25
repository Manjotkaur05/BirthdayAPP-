import SwiftUI

struct BioGameView: View {
    @State private var currentIndex = 0
    @State private var score = 0
    @State private var selectedAnswer: Int?
    @State private var showFinal = false

    private let questions: [BioQuestion] = [
        .init(
            prompt: "Which phase of mitosis aligns chromosomes at the cell's equator?",
            options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
            correct: 1
        ),
        .init(
            prompt: "What is the primary function of the rough endoplasmic reticulum?",
            options: ["Lipid breakdown", "Protein synthesis", "ATP generation", "DNA replication"],
            correct: 1
        ),
        .init(
            prompt: "In genetics, what does homozygous mean?",
            options: ["Two different alleles", "No alleles present", "Two identical alleles", "Only dominant alleles"],
            correct: 2
        ),
        .init(
            prompt: "Which molecule is directly used by ribosomes during translation?",
            options: ["mRNA", "DNA polymerase", "Glycogen", "Cholesterol"],
            correct: 0
        ),
        .init(
            prompt: "Which biomolecule forms the main structure of cell membranes?",
            options: ["Nucleic acids", "Triglycerides", "Phospholipids", "Starch"],
            correct: 2
        )
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                BirthdayTheme.backgroundGradient
                    .ignoresSafeArea()

                VStack(spacing: 18) {
                    Text("Bio Mini-Game 🧬")
                        .font(.title2.bold())
                        .foregroundStyle(BirthdayTheme.palePink)

                    if showFinal {
                        Text("Final Score: \(score)/\(questions.count)")
                            .font(.title3.bold())
                            .foregroundStyle(BirthdayTheme.palePink)

                        Text(score >= 4 ? "Amazing, future biologist! 🌟" : "Nice try! One more round? 💪")
                            .foregroundStyle(BirthdayTheme.classicPink)

                        Button("Play Again") {
                            restartGame()
                        }
                        .modifier(QuizButton())
                    } else {
                        let question = questions[currentIndex]

                        Text("Question \(currentIndex + 1) of \(questions.count)")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(BirthdayTheme.lightPink)

                        Text(question.prompt)
                            .font(.headline)
                            .foregroundStyle(BirthdayTheme.palePink)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)

                        ForEach(question.options.indices, id: \.self) { idx in
                            Button {
                                selectedAnswer = idx
                            } label: {
                                HStack {
                                    Text(question.options[idx])
                                        .foregroundStyle(BirthdayTheme.cherryBlossom)
                                    Spacer()
                                    if selectedAnswer == idx {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundStyle(BirthdayTheme.salmonPink)
                                    }
                                }
                                .padding()
                                .background(BirthdayTheme.surface, in: RoundedRectangle(cornerRadius: 12))
                            }
                            .padding(.horizontal)
                        }

                        Button("Submit") {
                            submitAnswer()
                        }
                        .modifier(QuizButton())
                        .disabled(selectedAnswer == nil)
                        .opacity(selectedAnswer == nil ? 0.6 : 1)
                    }
                }
                .padding()
            }
            .navigationTitle("Bio Game")
        }
    }

    private func submitAnswer() {
        guard let selectedAnswer else { return }

        if selectedAnswer == questions[currentIndex].correct {
            score += 1
        }

        if currentIndex == questions.count - 1 {
            showFinal = true
        } else {
            currentIndex += 1
            self.selectedAnswer = nil
        }
    }

    private func restartGame() {
        currentIndex = 0
        score = 0
        selectedAnswer = nil
        showFinal = false
    }
}

private struct QuizButton: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.headline)
            .foregroundStyle(BirthdayTheme.palePink)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(BirthdayTheme.salmonPink, in: RoundedRectangle(cornerRadius: 14))
            .padding(.horizontal)
    }
}

private struct BioQuestion {
    let prompt: String
    let options: [String]
    let correct: Int
}

#Preview {
    BioGameView()
}
