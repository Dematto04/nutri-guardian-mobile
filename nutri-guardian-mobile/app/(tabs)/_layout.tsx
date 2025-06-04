import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="education/index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        
      }}
     
    >
      <Tabs.Screen
        name="education/index"
        options={{
          title: "Education",
          tabBarLabel: "Education",
          tabBarIcon: ({ color }) => (
            <Feather name="book" size={24} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarLabel: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="manage-search" size={24} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="favourite"
        options={{
          title: "Favourite",
          tabBarLabel: "Favourite",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracking/index"
        options={{
          title: "Tracking",
          tabBarLabel: "Tracking",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="navigation-variant-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
    
      <Tabs.Screen
        name="account/index"
        options={{
          title: "Account",
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
     
    </Tabs>
  );
}
