import { ThemedText } from "@/components/ThemedText";
import { Stack } from "expo-router";
import React from "react";

function ExploreLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerTitle: () => {
            return <ThemedText type="subtitle">Find Products</ThemedText>;
          },
        }}
      />
      <Stack.Screen
        name="category/[id]"
        options={({ route }: any) => ({
          title: route.params?.category
            ? `${route.params.category}`
            : "Category",
          headerTitleAlign: "center",
        })}
      />
    </Stack>
  );
}

export default ExploreLayout;
