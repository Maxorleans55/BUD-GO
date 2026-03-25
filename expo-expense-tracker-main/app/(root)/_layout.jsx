import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style="dark" />
    </SafeScreen>
  );
}
