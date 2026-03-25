import SwiftUI

struct HomeView: View {
    var body: some View {
        ZStack {
            backgroundLayer

            VStack(spacing: 24) {
                Spacer()

                Text("Happy Birthday, Bestie! 🎂")
                    .font(.largeTitle.bold())
                    .multilineTextAlignment(.center)
                    .foregroundStyle(BirthdayTheme.palePink)
                    .shadow(radius: 4)

                Text("You make every day brighter, kinder, and more fun. I am so lucky to have you in my life. Wishing you a year full of laughter, love, and big wins. 💖")
                    .font(.title3)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(BirthdayTheme.palePink.opacity(0.98))
                    .padding()
                    .background(BirthdayTheme.salmonPink.opacity(0.22), in: RoundedRectangle(cornerRadius: 20))
                    .padding(.horizontal)

                Spacer()

                VStack(spacing: 8) {
                    Text("Made with love for birthday girl")
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(BirthdayTheme.palePink.opacity(0.95))
                    Text("Bestie Forever ✨")
                        .font(.caption)
                        .foregroundStyle(BirthdayTheme.classicPink.opacity(0.95))
                }
                .padding(.bottom, 24)
            }
            .padding()
        }
    }

    @ViewBuilder
    private var backgroundLayer: some View {
        if let image = UIImage(named: "background") {
            Image(uiImage: image)
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()
                .overlay(BirthdayTheme.overlay)
        } else {
            BirthdayTheme.backgroundGradient
                .ignoresSafeArea()
        }
    }
}

#Preview {
    HomeView()
}
