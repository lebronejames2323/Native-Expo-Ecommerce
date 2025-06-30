import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { register } from "./api/auth";
import { router } from "expo-router";

function Register() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });

  const handleInputChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onFormSubmit = async () => {
    if (!loading) {
      setLoading(true);

      try {
        const res = await register(form);

        if (res?.ok) {
          Alert.alert("Success", res?.message ?? "Registered!");
          router.push("/login");
        } else {
          Alert.alert("Error", res?.message ?? "Something went wrong!");
        }
      } catch (error) {
        console.error("Registration error:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View
      style={{
        minHeight: "100%",
        paddingHorizontal: 20,
        backgroundColor: "#f3f3f3",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          width: "100%",
          maxWidth: 400,
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
          Register
        </Text>

        <TextInput
          placeholder="Username"
          value={form.username}
          onChangeText={(text) => handleInputChange("username", text)}
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            width: "100%",
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="Email Address"
          value={form.email}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            width: "100%",
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="Password atleast 8 characters"
          value={form.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            width: "100%",
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="Repeat Password"
          value={form.password_confirmation}
          onChangeText={(text) => handleInputChange("password_confirmation", text)}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            width: "100%",
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="First Name"
          value={form.first_name}
          onChangeText={(text) => handleInputChange("first_name", text)}
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            width: "100%",
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="Last Name"
          value={form.last_name}
          onChangeText={(text) => handleInputChange("last_name", text)}
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            width: "100%",
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="Contact"
          value={form.phone_number}
          onChangeText={(text) => handleInputChange("phone_number", text)}
          keyboardType="phone-pad"
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            width: "100%",
            marginBottom: 15,
          }}
        />
        <TextInput
          placeholder="Address"
          value={form.address}
          onChangeText={(text) => handleInputChange("address", text)}
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            width: "100%",
            marginBottom: 15,
          }}
        />

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
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={{ marginTop: 15 }}
        >
          <Text
            style={{
              color: "#32a852",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Already have an account? Login here.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Register;
