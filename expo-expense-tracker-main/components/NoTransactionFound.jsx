import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const NoTransactionsFound = () => {
  const router = useRouter();

  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="receipt-outline"
        size={60}
        color="#999"
        style={styles.emptyStateIcon}
      />

      <Text style={styles.emptyStateTitle}>No transactions yet</Text>

      <Text style={styles.emptyStateText}>
        Start tracking your finances by adding your first transaction.
      </Text>

      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push("/add-expense")}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoTransactionsFound;

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateIcon: {
    marginBottom: 10,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    color: "#222",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  emptyStateButton: {
    flexDirection: "row",
    backgroundColor: "#ff8c66",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
