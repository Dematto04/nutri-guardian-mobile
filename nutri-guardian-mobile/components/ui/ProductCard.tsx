import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
    Image,
    ImageSourcePropType,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
interface ProductCardProps {
  image: ImageSourcePropType;
  name: string;
  id: string;
  onPress?: () => void;
}
export default function ProductCard(item: ProductCardProps) {
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 11,
        paddingHorizontal: 17,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        minHeight: 250,
        width: "48%",
        marginHorizontal: "1%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={item.onPress}
    >
      <View className="w-full">
        <Image
          source={item.image}
          style={{
            width: "100%",
            borderRadius: 10,
            marginBottom: 8,
          }}
          resizeMode="contain"
        />
        <Text className="font-semibold text-start text-lg">{item.name}</Text>
      </View>
      <View
        style={{
          width: "100%",
          height: "auto",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.primary,
            padding: 9,
            borderRadius: 17,
          }}
        >
          <AntDesign name="search1" size={24} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
