import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // console.log(process.env.EXPO_PUBLIC_API_URL);

  // const handleLogin = () => {
  //   console.log("123");

  //   fetch("https://localhost:7087/api/authentication/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   })
  //     .then((response) => response.json())
  //     .then((res) => {
  //       console.log({ res });
  //     })
  //     .catch((error) => {
  //       console.log("Login error:", error);
  //     });
  // };
  const handleLogin = async () => {
    try {
      // const res = await AuthService.login({ email, password });
      const res = await axios.post("http://10.0.2.2:7087/api/authentication/login", {email, password})
      console.log("123");
      
      // const res = await fetch("http://192.168.1.6:7087/api/authentication/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email, password }),
      // })
      //   .then((res) => res.json())
      //   .then((res) => {
      //     console.log({ res });
      //   });
    } catch (error) {
      console.log({ error });
    }
    // router.replace("/(tabs)/education");
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.formContainer}>
        <ThemedText type="subtitle" style={styles.title}>
          Welcome Back!
        </ThemedText>

        <View style={styles.inputContainer}>
          <ThemedInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <ThemedInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <ThemedButton title="Login" onPress={handleLogin} />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: Colors.text.secondary }]}>
            Don't have an account?
          </Text>
          <View>
            <ThemedButton
              title="Register"
              variant="secondary"
              onPress={() => router.push("/(auth)/register")}
            />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    gap: 15,
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
    gap: 10,
  },
  footerText: {
    color: Colors.text.secondary,
  },
});
