import SwiftUI

enum BirthdayTheme {
    static let palePink = Color(red: 0.94, green: 0.82, blue: 0.85)
    static let classicPink = Color(red: 0.91, green: 0.67, blue: 0.74)
    static let cherryBlossom = Color(red: 0.88, green: 0.58, blue: 0.68)
    static let lightPink = Color(red: 0.90, green: 0.64, blue: 0.72)
    static let salmonPink = Color(red: 0.89, green: 0.48, blue: 0.61)

    static let backgroundGradient = LinearGradient(
        colors: [palePink, classicPink, cherryBlossom, lightPink, salmonPink],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let textPrimary = palePink
    static let textSecondary = classicPink
    static let surface = palePink.opacity(0.94)
    static let surfaceSoft = palePink.opacity(0.5)
    static let overlay = salmonPink.opacity(0.2)
}
