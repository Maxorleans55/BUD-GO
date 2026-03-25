import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';

const PageLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#df8911ff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export default PageLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // or 'transparent'
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
