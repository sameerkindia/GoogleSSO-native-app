// App.js
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '21336227591-ln4tb3900k4a6upepr6eip29e0m2rt5n.apps.googleusercontent.com',
    redirectUri: makeRedirectUri(),
    // {
    //   useProxy: true,
    // }
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication!.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token:any) => {
    let res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    setUserInfo(user);
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please Sign In</Text>
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.userInfo}>Name: {userInfo.name}</Text>
      <Text style={styles.userInfo}>Email: {userInfo.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, marginBottom: 20 },
  userInfo: { fontSize: 16, marginTop: 10 },
});
