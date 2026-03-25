import SwiftUI

struct ContentView: View {
    @State private var showOnboarding = true

    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }

            CalendarConnectView()
                .tabItem {
                    Label("Calendar", systemImage: "calendar.badge.plus")
                }

            BioGameView()
                .tabItem {
                    Label("Bio Game", systemImage: "leaf.fill")
                }

            PersonalJournalView()
                .tabItem {
                    Label("Journal", systemImage: "book.closed.fill")
                }
        }
        .tint(BirthdayTheme.salmonPink)
        .fullScreenCover(isPresented: $showOnboarding) {
            OnboardingView(isPresented: $showOnboarding)
        }
    }
}

#Preview {
    ContentView()
}
