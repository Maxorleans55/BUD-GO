import { useState } from 'react';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../constants/api';
import { useTransactions } from '../../hooks/useTransactions';

const CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', icon: 'fast-food' },
  { id: 'shopping', name: 'Shopping', icon: 'cart' },
  { id: 'transportation', name: 'Transportation', icon: 'car' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film' },
  { id: 'bills', name: 'Bills', icon: 'receipt' },
  { id: 'income', name: 'Income', icon: 'cash' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal' },
];

export default function AddExpense() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { loadData } = useTransactions(user?.id);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return Alert.alert('Error', 'Please enter a transaction title');
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return Alert.alert('Error', 'Please enter a valid amount');
    }
    if (!selectedCategory) return Alert.alert('Error', 'Please select a category');

    setIsLoading(true);

    try {
      const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      await loadData();
      Alert.alert('Success', 'Transaction created successfully');
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create transaction');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <SignedIn>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Transaction</Text>
            <View style={{ width: 50 }} /> {/* empty space to balance header */}
          </View>

          {/* TYPE SELECTOR */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeBtn, isExpense && styles.typeBtnActive]}
              onPress={() => setIsExpense(true)}
            >
              <Ionicons name="arrow-down-circle" size={22} color={isExpense ? '#fff' : '#ff6b6b'} />
              <Text style={[styles.typeBtnText, isExpense && styles.typeBtnTextActive]}>Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeBtn, !isExpense && styles.typeBtnActive]}
              onPress={() => setIsExpense(false)}
            >
              <Ionicons name="arrow-up-circle" size={22} color={!isExpense ? '#fff' : '#4cd964'} />
              <Text style={[styles.typeBtnText, !isExpense && styles.typeBtnTextActive]}>Income</Text>
            </TouchableOpacity>
          </View>

          {/* AMOUNT INPUT */}
          <View style={styles.amountContainer}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* TITLE INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons name="create-outline" size={20} color="#aaa" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Transaction Title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* CATEGORY */}
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryBtn, selectedCategory === cat.name && styles.categoryBtnActive]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Ionicons
                  name={cat.icon}
                  size={20}
                  color={selectedCategory === cat.name ? '#fff' : '#333'}
                />
                <Text style={[styles.categoryText, selectedCategory === cat.name && { color: '#fff' }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
        </ScrollView>

        {/* ADD BUTTON AT BOTTOM CENTER */}
        <TouchableOpacity
          style={styles.addBtnBottom}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.addBtnBottomText}>{isLoading ? 'Adding...' : 'Add'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SignedIn>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F5F5', paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#333' },

  typeSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  typeBtn: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeBtnActive: { backgroundColor: '#ff8c66' },
  typeBtnText: { marginLeft: 8, fontWeight: '500', color: '#333' },
  typeBtnTextActive: { color: '#fff' },

  amountContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  currency: { fontSize: 24, fontWeight: '700', marginRight: 6, color: '#333' },
  amountInput: { fontSize: 24, fontWeight: '700', flex: 1, color: '#333', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 4 },

  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 4 },
  input: { flex: 1, fontSize: 16, color: '#333' },

  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryBtn: { width: '30%', padding: 10, margin: '1.5%', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  categoryBtnActive: { backgroundColor: '#ff8c66' },
  categoryText: { marginTop: 4, fontSize: 12, textAlign: 'center', color: '#333' },

  addBtnBottom: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -75 }],
    width: 150,
    backgroundColor: '#ff8c66',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  addBtnBottomText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
