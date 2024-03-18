import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Check if username and password match hardcoded values
    if (username === 'Manager' && password === '1234') {
      setLoggedIn(true); // Set loggedIn state to true for manager
    } else if (username === 'CEO' && password === 'c234') {
      setLoggedIn(true); // Set loggedIn state to true for CEO
    } else {
      alert('Invalid username or password');
    }
  };

  const renderLoginForm = () => {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDashboard = () => {
    return (
      <View style={styles.container}>
        {/* Your existing dashboard code goes here */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loggedIn ? renderDashboard() : renderLoginForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
