import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PinkBackground from "../components/PinkBackground";
import theme from "../theme";

const STORAGE_KEY = "shine.journal.entries";

export default function JournalWriteScreen() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedNote, setEditedNote] = useState("");

  React.useEffect(() => {
    loadEntries();
  }, []);

  React.useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  async function loadEntries() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      setEntries(JSON.parse(raw));
    } catch {
      // Keep UX simple if storage read fails.
    }
  }

  async function saveEntries(next) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep UX simple if storage write fails.
    }
  }

  function createEntry() {
    const cleanTitle = title.trim();
    const cleanNote = note.trim();
    if (!cleanTitle || !cleanNote) return;
    const next = [
      { id: String(Date.now()), title: cleanTitle, note: cleanNote, date: new Date().toISOString() },
      ...entries,
    ];
    setEntries(next);
    setTitle("");
    setNote("");
  }

  function startEdit(entry) {
    setEditingEntry(entry);
    setEditedTitle(entry.title);
    setEditedNote(entry.note);
  }

  function saveEdit() {
    if (!editingEntry) return;
    const cleanTitle = editedTitle.trim();
    const cleanNote = editedNote.trim();
    if (!cleanTitle || !cleanNote) return;
    const next = entries.map((item) =>
      item.id === editingEntry.id
        ? { ...item, title: cleanTitle, note: cleanNote, date: new Date().toISOString() }
        : item
    );
    setEntries(next);
    closeEdit();
  }

  function closeEdit() {
    setEditingEntry(null);
    setEditedTitle("");
    setEditedNote("");
  }

  function deleteEntry(id) {
    setEntries(entries.filter((item) => item.id !== id));
  }

  const filteredEntries = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) || entry.note.toLowerCase().includes(query)
    );
  }, [entries, searchText]);

  return (
    <PinkBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Journal Page</Text>

        <View style={styles.card}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Entry title"
            placeholderTextColor={theme.lightPink}
            style={styles.input}
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Write your thoughts..."
            placeholderTextColor={theme.lightPink}
            multiline
            style={[styles.input, styles.textArea]}
          />
          <Pressable
            style={[styles.primaryBtn, !title.trim() || !note.trim() ? { opacity: 0.6 } : null]}
            onPress={createEntry}
          >
            <Text style={styles.primaryBtnText}>Save Entry</Text>
          </Pressable>
        </View>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search title or note"
          placeholderTextColor={theme.lightPink}
          style={styles.search}
        />

        {filteredEntries.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {searchText.trim() ? "No matching entries found." : "No entries yet."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredEntries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 22 }}
            renderItem={({ item }) => (
              <Pressable style={styles.entry} onPress={() => startEdit(item)}>
                <Text style={styles.entryTitle}>{item.title}</Text>
                <Text style={styles.entryNote}>{item.note}</Text>
                <View style={styles.row}>
                  <Text style={styles.entryDate}>{new Date(item.date).toLocaleString()}</Text>
                  <Pressable onPress={() => deleteEntry(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>

      <Modal visible={!!editingEntry} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Entry</Text>
            <TextInput value={editedTitle} onChangeText={setEditedTitle} style={styles.input} />
            <TextInput
              value={editedNote}
              onChangeText={setEditedNote}
              multiline
              style={[styles.input, styles.textArea]}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={closeEdit} style={[styles.secondaryBtn]}>
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={saveEdit}
                style={[styles.primaryBtn, !editedTitle.trim() || !editedNote.trim() ? { opacity: 0.6 } : null]}
              >
                <Text style={styles.primaryBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </PinkBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { color: theme.palePink, textAlign: "center", fontSize: 28, fontWeight: "800", marginBottom: 10 },
  card: { backgroundColor: "rgba(239,196,211,0.45)", borderRadius: 14, padding: 12, marginBottom: 10 },
  input: {
    backgroundColor: "rgba(239,196,211,0.95)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.cherryBlossom,
    fontWeight: "600",
    marginBottom: 8,
  },
  textArea: { minHeight: 88, textAlignVertical: "top" },
  search: {
    backgroundColor: "rgba(239,196,211,0.95)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.cherryBlossom,
    fontWeight: "600",
    marginBottom: 10,
  },
  primaryBtn: { backgroundColor: theme.salmonPink, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14 },
  primaryBtnText: { color: theme.palePink, textAlign: "center", fontWeight: "700" },
  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: theme.classicPink, fontWeight: "700" },
  entry: { backgroundColor: "rgba(239,196,211,0.95)", borderRadius: 12, padding: 12, marginBottom: 10 },
  entryTitle: { color: theme.cherryBlossom, fontSize: 16, fontWeight: "800" },
  entryNote: { color: theme.salmonPink, marginTop: 5, marginBottom: 7 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  entryDate: { color: theme.lightPink, fontSize: 12 },
  deleteText: { color: theme.salmonPink, fontWeight: "800" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(227,122,156,0.35)", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: theme.classicPink,
    padding: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: { color: theme.palePink, fontSize: 20, fontWeight: "800", marginBottom: 10 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  secondaryBtn: { backgroundColor: theme.lightPink, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 18 },
  secondaryBtnText: { color: theme.palePink, fontWeight: "700" },
});
