import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "./api/auth";
import { router } from "expo-router";

function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onFormSubmit = async () => {
    if (!loading) {
      setLoading(true);

      const formdata = { username, password };

      try {
        const res = await login(formdata);
        if (res?.ok) {
          await AsyncStorage.setItem("token", res?.others?.token);
          console.log("Token saved successfully.");
          router.push("/(tabs)/");
        } else {
          Alert.alert("Error", res?.message ?? "Something went wrong!");
        }
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert("Error", "Unable to login at the moment.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    
    <View
      style={{
        minHeight: "100%",
        paddingHorizontal: 10,
        backgroundColor: "#f3f3f3",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          width: "90%",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            textAlign: "center",
            color: "#32a852",
            marginBottom: 20,
          }}
        >
          Login
        </Text>
        <View>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            style={{
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              width: "100%",
              marginBottom: 15,
            }}
          />
        </View>
        <View>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            style={{
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              width: "100%",
              marginBottom: 15,
            }}
          />
        </View>
        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity
            onPress={onFormSubmit}
            disabled={loading}
            style={{
              backgroundColor: "#32a852",
              paddingVertical: 12,
              borderRadius: 5,
              opacity: loading ? 0.5 : 1,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {loading ? "Logging In..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 15 }}>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text
              style={{
                color: "#32a852",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
            Don't have account? Register here.
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push("/")}>
        <Text
          style={{
            color: "#32a852",
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
        Go to Homepage
        </Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
}

export default Login;
