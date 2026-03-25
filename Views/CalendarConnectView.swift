import SwiftUI

struct CalendarConnectView: View {
    private let calendarURL = URL(string: "https://calendar.google.com/calendar/u/0/r")!
    private let eventURL = URL(
        string: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Bestie+Birthday+Celebration&details=Celebrate+the+birthday+girl%21&location=Favorite+Cafe&dates=20260324T180000Z/20260324T210000Z"
    )!

    var body: some View {
        NavigationStack {
            ZStack {
                BirthdayTheme.backgroundGradient
                    .ignoresSafeArea()

                VStack(spacing: 18) {
                    Text("Attach Google Calendar")
                        .font(.title2.bold())
                        .foregroundStyle(BirthdayTheme.palePink)

                    Text("Use these buttons to open Google Calendar and quickly add a birthday event.")
                        .multilineTextAlignment(.center)
                        .foregroundStyle(BirthdayTheme.classicPink)
                        .padding(.horizontal)

                    Link(destination: calendarURL) {
                        Label("Open Google Calendar", systemImage: "calendar")
                            .modifier(PinkButtonStyle())
                    }

                    Link(destination: eventURL) {
                        Label("Add Birthday Event", systemImage: "calendar.badge.plus")
                            .modifier(PinkButtonStyle())
                    }

                    Text("Tip: Sign in with your Google account in Safari if prompted.")
                        .font(.footnote)
                        .foregroundStyle(BirthdayTheme.lightPink)
                        .padding(.top, 8)
                }
                .padding()
            }
            .navigationTitle("Calendar")
        }
    }
}

private struct PinkButtonStyle: ViewModifier {
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

#Preview {
    CalendarConnectView()
}
