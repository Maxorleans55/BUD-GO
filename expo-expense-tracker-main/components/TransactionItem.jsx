import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../lib/utils";

const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Income: "cash",
  Other: "ellipsis-horizontal",
};

export const TransactionItem = ({ item, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const isIncome = parseFloat(item.amount) > 0;
  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

  const handleDelete = () => {
    onDelete(item.id);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
        <View style={styles.row}>
          {/* Category Icon */}
          <View style={[styles.iconWrap, { backgroundColor: isIncome ? "#4dec0fff" : "#f39c12ff" }]}>
            <Ionicons name={iconName} size={24} color={isIncome ? "#1b231eff" : "#090909ff"} />
          </View>

          {/* Left Info */}
          <View style={styles.left}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>

          {/* Right Info */}
          <View style={styles.right}>
            <Text style={[styles.amount, { color: isIncome ? "#000000ff" : "#000000ff" }]}>
              {isIncome ? "+" : "-"}${Math.abs(item.amount).toFixed(2)}
            </Text>
            <Text style={styles.date}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal Popup */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{item.title}</Text>
            <Text style={styles.modalCategory}>{item.category}</Text>
            <Text style={[styles.modalAmount, { color: isIncome ? "#000000ff" : "#000000ff" }]}>
              {isIncome ? "+" : "-"}${Math.abs(item.amount).toFixed(2)}
            </Text>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  left: { flex: 1, marginLeft: 16 },
  title: { fontSize: 22, fontWeight: "900", color: "#100101ff", fontFamily: "System" },
  category: { fontSize: 15, fontWeight: "300", fontStyle: "italic", color: "#333", marginTop: 4 },
  right: { alignItems: "flex-end" },
  amount: { fontSize: 18, fontWeight: "700" },
  date: { fontSize: 13, color: "#555", marginTop: 3 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  modalCategory: { fontSize: 16, color: "#555", marginBottom: 10 },
  modalAmount: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5C5C",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 16,
  },
});
