import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Dimensions, FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

// Replace this with require() if using local assets
import { useRouter } from "expo-router";
import localImage from "../../../assets/images/pngfuel10.png";

const data = [
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,117)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  {
    image: localImage,
    title: "Fresh Fruits & Vegetable",
    borderColor: "rgb(83,177,177)",
    bgColor: "rgba(83,177,117,0.1)",
  },
  
];

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 6 * 2 - 12) / 2; // padding: 6*2, spacing: 12 between

function ExploreScreen() {
  const theme = useThemeColor;
  const router = useRouter()
  return (
    <ThemedView className="flex-1 px-6 bg-white">
      <View className="flex-row relative items-center justify-center mb-4">
        <TextInput
          className="flex-1 bg-[#F2F3F2] pl-12 h-14 rounded-xl"
          placeholder="Search product"
        />
        <MaterialIcons
          className="absolute left-4"
          name="search"
          size={24}
          color={"black"}
        />
      </View>

      <FlatList
        data={data}
        numColumns={2}
        contentContainerStyle={{ gap: 16 }}
        className="mb-4"
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({
              pathname: "/(tabs)/explore/category/[id]",
              params: {
                id: item.title,
                category: item.title,
                bgColor: item.bgColor,
                borderColor: item.borderColor
              }
            })}
            style={{
              backgroundColor: item.bgColor,
              paddingVertical: 27,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: item.borderColor,
              minHeight: 180,
              justifyContent: "space-between",
              width: '48%',
              marginHorizontal: '1%',
              alignItems: "center"
            }}
          >
            <Image
              source={item.image}
              style={{
                width: "100%",
                height: 75,
                borderRadius: 10,
                marginBottom: 8,
              }}
              resizeMode="contain"
            />
            <Text className="font-semibold text-center w-2/3">{item.title}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

export default ExploreScreen;
