import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserAllergyService } from "@/service/userAllergy.service";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isFocused = useIsFocused()
  const router = useRouter()
  useEffect(()=> {
    const checkUserHasProfile = async () => {
      const res = await UserAllergyService.userHasAllergies()
      console.log({res});
      
      if(res.status === 200){
        if(!res.data.hasAllergies) {
          router.push('/quiz/quiz-welcome')
        }
      }
    }
    checkUserHasProfile()
  }, [isFocused])
  return (
    <Tabs
      initialRouteName="explore"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}
    >
      <Tabs.Screen
        name="education"
        options={{
          title: "Education",
          tabBarLabel: "Tìm hiểu",
          tabBarIcon: ({ color }) => (
            <Feather name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarLabel: "Tìm món",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="manage-search" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tracking/index"
        options={{
          title: "Tracking",
          tabBarLabel: "Theo dõi",
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
        name="favourite"
        options={{
          title: "Favourite",
          tabBarLabel: "Yêu thích",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarLabel: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
