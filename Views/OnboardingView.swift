import SwiftUI

struct OnboardingView: View {
    @Binding var isPresented: Bool
    @State private var page = 0

    private let pages: [OnboardingPage] = [
        .init(
            title: "Welcome, Birthday Queen!",
            subtitle: "A tiny app made with love, pink vibes, and a bunny guide just for you.",
            emoji: "🎀"
        ),
        .init(
            title: "Meet Your Bunny Guide",
            subtitle: "Tap through to explore wishes, a calendar helper, and a mini bio challenge!",
            emoji: "🐰"
        ),
        .init(
            title: "Ready for the Surprise?",
            subtitle: "Open the app and enjoy your special birthday experience.",
            emoji: "🎉"
        )
    ]

    var body: some View {
        ZStack {
            BirthdayTheme.backgroundGradient
                .ignoresSafeArea()

            VStack(spacing: 20) {
                Spacer(minLength: 12)

                if let bunnyImage = UIImage(named: "Bunny") {
                    Image(uiImage: bunnyImage)
                        .resizable()
                        .scaledToFit()
                        .frame(maxHeight: 220)
                        .clipShape(RoundedRectangle(cornerRadius: 24))
                        .shadow(radius: 8)
                        .padding(.horizontal)
                } else {
                    Image(systemName: "hare.fill")
                        .font(.system(size: 90))
                        .foregroundStyle(BirthdayTheme.palePink)
                        .padding()
                }

                Text(pages[page].emoji)
                    .font(.system(size: 42))

                Text(pages[page].title)
                    .font(.title.bold())
                    .foregroundStyle(BirthdayTheme.palePink)
                    .multilineTextAlignment(.center)

                Text(pages[page].subtitle)
                    .font(.body)
                    .foregroundStyle(BirthdayTheme.classicPink)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)

                Spacer()

                HStack(spacing: 8) {
                    ForEach(0..<pages.count, id: \.self) { index in
                        Capsule()
                            .fill(index == page ? BirthdayTheme.palePink : BirthdayTheme.classicPink.opacity(0.45))
                            .frame(width: index == page ? 24 : 8, height: 8)
                    }
                }

                Button {
                    if page < pages.count - 1 {
                        withAnimation {
                            page += 1
                        }
                    } else {
                        isPresented = false
                    }
                } label: {
                    Text(page == pages.count - 1 ? "Start" : "Next")
                        .font(.headline)
                        .foregroundStyle(BirthdayTheme.palePink)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(BirthdayTheme.salmonPink, in: RoundedRectangle(cornerRadius: 14))
                }
                .padding(.horizontal)

                Button("Skip") {
                    isPresented = false
                }
                .foregroundStyle(BirthdayTheme.palePink.opacity(0.95))
                .padding(.bottom, 20)
            }
        }
    }
}

private struct OnboardingPage {
    let title: String
    let subtitle: String
    let emoji: String
}

#Preview {
    OnboardingView(isPresented: .constant(true))
}
