import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState, useCallback } from "react";
import PageLoader from "../../components/PageLoader";
import { TransactionItem } from "../../components/TransactionItem";
import { SignOutButton } from "@/components/SignOutButton";

export default function Page() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const {
    transactions: allTransactions = [],
    summary = { balance: 0, income: 0, expenses: 0 },
    isLoading,
    loadData,
    deleteTransaction,
  } = useTransactions(user?.id) || {};

  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;

  useEffect(() => {
    if (user?.id) handleRefresh();
  }, [user]);

  useEffect(() => {
    loadMoreTransactions();
  }, [allTransactions]);

  const handleRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    setPage(1);
    try {
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, loadData]);

  const loadMoreTransactions = () => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const nextBatch = allTransactions.slice(start, end);

    if (page === 1) setTransactions(nextBatch);
    else setTransactions((prev) => [...prev, ...nextBatch]);

    if (nextBatch.length > 0) setPage((prev) => prev + 1);
  };

  const handleEndReached = () => {
    if (!loadingMore && transactions.length < allTransactions.length) {
      setLoadingMore(true);
      loadMoreTransactions();
      setLoadingMore(false);
    }
  };

  const handleDelete = (id) => deleteTransaction(id);

  if (!isLoaded || isLoading) return <PageLoader />;

  return (
    <View style={styles.container}>
      <SignedIn>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>

          <View style={styles.headerActions}>
            {/* SIGN OUT BUTTON WITH SETTINGS ICON */}
            <SignOutButton>
              <TouchableOpacity style={styles.signOutBtn}>
                <Ionicons name="settings-outline" size={26} color="#d9534f" />
              </TouchableOpacity>
            </SignOutButton>
          </View>
        </View>

        {/* BALANCE CARD */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            ${parseFloat(summary.balance).toFixed(2)}
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: "#ffffffff" }]}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={[styles.statValue, { color: "#000000ff" }]}>
                +${parseFloat(summary.income).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#ffffffff" }]}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={[styles.statValue, { color: "#000000ff" }]}>
                -${Math.abs(parseFloat(summary.expenses)).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* RECENT TRANSACTIONS */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="pie-chart-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first transaction to start tracking.
            </Text>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push("/add-expense")}
            >
              <Text style={styles.addBtnText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TransactionItem item={item} onDelete={handleDelete} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color="#ff8c66" />
              ) : null
            }
          />
        )}

        {/* FLOATING ADD BUTTON */}
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => router.push("/add-expense")}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </SignedIn>

      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingTop: 40,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  signOutBtn: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  /* BALANCE CARD */
  balanceCard: {
    backgroundColor: "#111110ff",
    padding: 25,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  balanceLabel: {
    fontSize: 15,
    color: "#fffbfbff",
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffffff",
    marginBottom: 18,
  },

  /* STATS */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },

  /* TRANSACTIONS */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 30,
  },

  /* BUTTONS */
  addBtn: {
    backgroundColor: "#ff8c66",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 20,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  floatingBtn: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
