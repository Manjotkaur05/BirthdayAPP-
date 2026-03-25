import SwiftUI

struct PersonalJournalView: View {
    @State private var entries: [JournalEntry] = JournalStorage.loadEntries()

    var body: some View {
        NavigationStack {
            ZStack {
                coverBackgroundLayer
                    .ignoresSafeArea()

                VStack(spacing: 16) {
                    Spacer()

                    Text("Personal Journal")
                        .font(.largeTitle.bold())
                        .foregroundStyle(BirthdayTheme.palePink)
                        .shadow(radius: 6)

                    Text("Open your cover page, then write your thoughts on journal pages.")
                        .multilineTextAlignment(.center)
                        .foregroundStyle(BirthdayTheme.classicPink)
                        .padding(.horizontal)

                    NavigationLink {
                        JournalWriteView(entries: $entries)
                    } label: {
                        Label("Open Journal Pages", systemImage: "book.pages.fill")
                            .font(.headline)
                            .foregroundStyle(BirthdayTheme.palePink)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(BirthdayTheme.salmonPink, in: RoundedRectangle(cornerRadius: 12))
                    }
                    .padding(.horizontal)

                    Spacer()
                }
                .padding(.top)
            }
            .navigationTitle("Journal")
        }
        .onChange(of: entries) { updatedEntries in
            JournalStorage.saveEntries(updatedEntries)
        }
    }

    @ViewBuilder
    private var coverBackgroundLayer: some View {
        if let image = UIImage(named: "Journel cover page") {
            Image(uiImage: image)
                .resizable()
                .scaledToFill()
                .overlay(BirthdayTheme.overlay)
        } else {
            BirthdayTheme.backgroundGradient
        }
    }
}

private struct JournalEntry: Identifiable, Codable {
    let id: UUID
    let title: String
    let note: String
    let date: Date

    init(id: UUID = UUID(), title: String, note: String, date: Date) {
        self.id = id
        self.title = title
        self.note = note
        self.date = date
    }
}

private enum JournalStorage {
    private static let key = "shine.journal.entries"

    static func loadEntries() -> [JournalEntry] {
        guard
            let data = UserDefaults.standard.data(forKey: key),
            let entries = try? JSONDecoder().decode([JournalEntry].self, from: data)
        else {
            return []
        }
        return entries
    }

    static func saveEntries(_ entries: [JournalEntry]) {
        guard let data = try? JSONEncoder().encode(entries) else { return }
        UserDefaults.standard.set(data, forKey: key)
    }
}

private struct JournalWriteView: View {
    @Binding var entries: [JournalEntry]
    @State private var title = ""
    @State private var note = ""
    @State private var searchText = ""
    @State private var editingEntry: JournalEntry?

    var body: some View {
        ZStack {
            pageBackgroundLayer
                .ignoresSafeArea()

            VStack(spacing: 12) {
                Text("Journal Page")
                    .font(.title2.bold())
                    .foregroundStyle(BirthdayTheme.palePink)
                    .shadow(radius: 4)

                VStack(spacing: 10) {
                    TextField("Entry title", text: $title)
                        .textFieldStyle(.roundedBorder)
                        .tint(BirthdayTheme.salmonPink)

                    TextField("Write your thoughts...", text: $note, axis: .vertical)
                        .lineLimit(4...10)
                        .textFieldStyle(.roundedBorder)
                        .tint(BirthdayTheme.salmonPink)

                    Button("Save Entry") {
                        saveEntry()
                    }
                    .disabled(!canSave)
                    .font(.headline)
                    .foregroundStyle(BirthdayTheme.palePink)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(BirthdayTheme.salmonPink, in: RoundedRectangle(cornerRadius: 12))
                    .opacity(canSave ? 1 : 0.6)
                }
                .padding()
                .background(BirthdayTheme.surfaceSoft, in: RoundedRectangle(cornerRadius: 16))
                .padding(.horizontal)

                if filteredEntries.isEmpty {
                    Spacer()
                    Text(searchText.isEmpty ? "No entries yet." : "No matching entries found.")
                        .foregroundStyle(BirthdayTheme.classicPink)
                    Spacer()
                } else {
                    List {
                        ForEach(filteredEntries) { entry in
                            Button {
                                editingEntry = entry
                            } label: {
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(entry.title)
                                        .font(.headline)
                                    Text(entry.note)
                                        .font(.subheadline)
                                    Text(entry.date.formatted(date: .abbreviated, time: .shortened))
                                        .font(.caption)
                                        .foregroundStyle(BirthdayTheme.lightPink)
                                }
                                .padding(.vertical, 4)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            }
                            .buttonStyle(.plain)
                        }
                        .onDelete(perform: deleteEntry)
                    }
                    .scrollContentBackground(.hidden)
                    .searchable(text: $searchText, prompt: "Search title or note")
                    .tint(BirthdayTheme.salmonPink)
                }
            }
            .padding(.top)
        }
        .navigationTitle("Write")
        .sheet(item: $editingEntry) { entry in
            JournalEntryEditorView(
                entry: entry,
                onSave: updateEntry
            )
        }
    }

    private var canSave: Bool {
        !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !note.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private var filteredEntries: [JournalEntry] {
        guard !searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return entries
        }
        let query = searchText.lowercased()
        return entries.filter {
            $0.title.lowercased().contains(query) || $0.note.lowercased().contains(query)
        }
    }

    private func saveEntry() {
        guard canSave else { return }
        let newEntry = JournalEntry(
            title: title.trimmingCharacters(in: .whitespacesAndNewlines),
            note: note.trimmingCharacters(in: .whitespacesAndNewlines),
            date: Date()
        )
        entries.insert(newEntry, at: 0)
        title = ""
        note = ""
    }

    private func deleteEntry(at offsets: IndexSet) {
        let idsToDelete = Set(offsets.map { filteredEntries[$0].id })
        entries.removeAll { idsToDelete.contains($0.id) }
    }

    private func updateEntry(_ updatedEntry: JournalEntry) {
        guard let index = entries.firstIndex(where: { $0.id == updatedEntry.id }) else { return }
        entries[index] = updatedEntry
    }

    @ViewBuilder
    private var pageBackgroundLayer: some View {
        if let image = UIImage(named: "journel page") {
            Image(uiImage: image)
                .resizable()
                .scaledToFill()
                .overlay(BirthdayTheme.overlay)
        } else {
            BirthdayTheme.backgroundGradient
        }
    }
}

private struct JournalEntryEditorView: View {
    @Environment(\.dismiss) private var dismiss
    let entry: JournalEntry
    let onSave: (JournalEntry) -> Void

    @State private var editedTitle: String
    @State private var editedNote: String

    init(entry: JournalEntry, onSave: @escaping (JournalEntry) -> Void) {
        self.entry = entry
        self.onSave = onSave
        _editedTitle = State(initialValue: entry.title)
        _editedNote = State(initialValue: entry.note)
    }

    var body: some View {
        NavigationStack {
            ZStack {
                BirthdayTheme.backgroundGradient
                    .ignoresSafeArea()

                VStack(spacing: 12) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Title")
                            .font(.headline)
                            .foregroundStyle(BirthdayTheme.palePink)
                        TextField("Entry title", text: $editedTitle)
                            .textFieldStyle(.roundedBorder)
                            .tint(BirthdayTheme.salmonPink)
                    }
                    .padding()
                    .background(BirthdayTheme.surfaceSoft, in: RoundedRectangle(cornerRadius: 14))

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Thoughts")
                            .font(.headline)
                            .foregroundStyle(BirthdayTheme.palePink)
                        TextField("Write your thoughts...", text: $editedNote, axis: .vertical)
                            .lineLimit(4...12)
                            .textFieldStyle(.roundedBorder)
                            .tint(BirthdayTheme.salmonPink)
                    }
                    .padding()
                    .background(BirthdayTheme.surfaceSoft, in: RoundedRectangle(cornerRadius: 14))

                    Spacer()
                }
                .padding()
            }
            .navigationTitle("Edit Entry")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(BirthdayTheme.palePink)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        let updated = JournalEntry(
                            id: entry.id,
                            title: editedTitle.trimmingCharacters(in: .whitespacesAndNewlines),
                            note: editedNote.trimmingCharacters(in: .whitespacesAndNewlines),
                            date: Date()
                        )
                        onSave(updated)
                        dismiss()
                    }
                    .disabled(!canSave)
                    .foregroundStyle(BirthdayTheme.palePink)
                }
            }
        }
    }

    private var canSave: Bool {
        !editedTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !editedNote.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
}

#Preview {
    PersonalJournalView()
}
