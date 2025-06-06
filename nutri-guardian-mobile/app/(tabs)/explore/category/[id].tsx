import localImage from "@/assets/images/banana.png";
import { ThemedView } from "@/components/ThemedView";
import ProductCard from "@/components/ui/ProductCard";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList } from "react-native";
const data = [
  {
    name: "Banana and Blueberry",
    image: localImage,
  },
  {
    name: "Banana and Blueberry",
    image: localImage,
  },
  {
    name: "Banana and Blueberry",
    image: localImage,
  },
  {
    name: "Banana and Blueberry",
    image: localImage,
  },
  {
    name: "Banana and Blueberry",
    image: localImage,
  },
  {
    name: "Banana and Blueberry",
    image: localImage,
  },
];
function CategoryScreen() {
  const router = useRouter();
  return (
    <ThemedView className="flex-1 p-7">
      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ProductCard
            id={`${index}`}
            image={item.image}
            name={item.name}
            onPress={() => {
              router.push("/detail");
            }}
          />
        )}
      />
    </ThemedView>
  );
}

export default CategoryScreen;
