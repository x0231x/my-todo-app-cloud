import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

const API = "https://my-todo-app-cloud.onrender.com/api/tasks/";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);       // 正在編輯的任務 ID
  const [editingText, setEditingText] = useState("");     // 編輯中的文字
  const scheme = useColorScheme();
  const textColor = scheme === "dark" ? "#fff" : "#000";

  // 讀取任務列表
  const fetchTasks = async () => {
    try {
      const res = await fetch(API);
      setTasks(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  // 新增任務
  const addTask = async () => {
    if (!newTitle.trim()) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, done: false }),
    });
    setNewTitle("");
    fetchTasks();
  };

  // 切換完成狀態
  const toggleDone = async (item) => {
    await fetch(`${API}${item.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !item.done }),
    });
    fetchTasks();
  };

  // 刪除任務
  const deleteTask = async (id) => {
    await fetch(`${API}${id}/`, { method: "DELETE" });
    fetchTasks();
  };

  // 儲存編輯後的任務
  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    await fetch(`${API}${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingText }),
    });
    setEditingId(null);
    setEditingText("");
    fetchTasks();
  };

  // 取消編輯
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);

  const renderTaskItem = ({ item }) => (
    <View style={styles.itemRow}>
      {editingId === item.id ? (
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              marginRight: 8,
              color: textColor,
              borderColor: textColor,
            },
          ]}
          value={editingText}
          onChangeText={setEditingText}
          onSubmitEditing={() => saveEdit(item.id)}
          autoFocus
        />
      ) : (
        <TouchableOpacity
          onPress={() => toggleDone(item)}
          style={styles.itemTextWrapper}
        >
          <Text style={[styles.item, { color: textColor }]}>
            {item.done ? "✅ " : "🔲 "}
            {item.title}
          </Text>
        </TouchableOpacity>
      )}

      {editingId === item.id ? (
        <>
          <Button title="✔️" onPress={() => saveEdit(item.id)} />
          <Button title="✖️" onPress={cancelEdit} />
        </>
      ) : (
        <>
          <Button
            title="修改"
            onPress={() => {
              setEditingId(item.id);
              setEditingText(item.title);
            }}
          />
          <Button title="刪除" color="#d00" onPress={() => deleteTask(item.id)} />
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>我的 Todo List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: textColor }]}
          placeholder="輸入新任務"
          placeholderTextColor={scheme === "dark" ? "#888" : "#aaa"}
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <Button title="＋" onPress={addTask} />
      </View>

      <FlatList
        data={pendingTasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTaskItem}
      />

      <Text style={[styles.title, { color: textColor }]}>已完成項目</Text>

      <FlatList
        data={completedTasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTaskItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemTextWrapper: { flex: 1 },
  item: { fontSize: 18 },
});