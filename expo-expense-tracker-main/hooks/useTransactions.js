import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../constants/api';

// Custom hook to fetch transactions and summary
export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();

      const balance = Number(data?.balance) || 0;
      const income = Number(data?.income) || 0;
      const expenses = income - balance; // calculate expenses in frontend

      setSummary({ balance, income, expenses });
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary({ balance: 0, income: 0, expenses: 0 });
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete transaction');
      await loadData();
      Alert.alert('Success', 'Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
