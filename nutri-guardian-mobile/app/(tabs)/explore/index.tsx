import { ThemedView } from "@/components/ThemedView";
import ExploreSkeleton from "@/components/explore/ExploreSkeleton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RecipeService } from "@/service/recipe.service";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 6 * 2 - 12) / 2; // padding: 6*2, spacing: 12 between

// Map Vietnamese category names to colors and images
const categoryColors = {
  Dầu: {
    border: "rgb(255, 193, 7)",
    bg: "rgba(255, 193, 7, 0.1)",
    image: "https://pngimg.com/d/sunflower_oil_PNG24.png",
  },
  Đậu: {
    border: "rgb(76, 175, 80)",
    bg: "rgba(76, 175, 80, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/5/Nuts-PNG-Free-Download.png",
  },
  "Gia vị": {
    border: "rgb(244, 67, 54)",
    bg: "rgba(244, 67, 54, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/2/Saffron-PNG-Image.png"
  },
  "Hải sản": {
    border: "rgb(33, 150, 243)",
    bg: "rgba(33, 150, 243, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/19/Zesty-Steamed-Fish-Dish-Featuring-Fresh-Cilantro-PNG-300x225.png",
  },
  Hạt: {
    border: "rgb(156, 39, 176)",
    bg: "rgba(156, 39, 176, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/5/Nuts-PNG-Pic.png",
  },
  "Ngũ cốc": {
    border: "rgb(255, 152, 0)",
    bg: "rgba(255, 152, 0, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/4/Healthy-Cereal-Bread-PNG-Image-300x225.png",
  },
  "Rau củ": {
    border: "rgb(0, 150, 136)",
    bg: "rgba(0, 150, 136, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/2016/03/Vegetable-PNG-Picture.png",
  },
  Sữa: {
    border: "rgb(121, 85, 72)",
    bg: "rgba(121, 85, 72, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/15/Glass-Of-Milk-PNG-Picture.png",
  },
  Thịt: {
    border: "rgb(233, 30, 99)",
    bg: "rgba(233, 30, 99, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/2016/03/Meat-Download-PNG.png",
  },
  Trứng: {
    border: "rgb(255, 235, 59)",
    bg: "rgba(255, 235, 59, 0.1)",
    image:
      "https://www.pngall.com/wp-content/uploads/11/Omelette-PNG-Picture.png",
  },
};

function ExploreScreen() {
  const theme = useThemeColor;
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await RecipeService.getRecipeCategories();
      if (response.data?.data?.ingredientCategories) {
        setCategories(response.data.data.ingredientCategories);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Không thể tải danh mục nguyên liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    return (
      categoryColors[category as keyof typeof categoryColors] || {
        border: "rgb(83,177,117)",
        bg: "rgba(83,177,117,0.1)",
      }
    );
  };

  return (
    <ThemedView className="flex-1 px-6 bg-white">
      {loading ? (
        <ExploreSkeleton />
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-center px-4 mb-4">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-primary px-4 py-2 rounded-lg"
            onPress={fetchCategories}
          >
            <Text className="text-white font-medium">Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categories}
          numColumns={2}
          contentContainerStyle={{ gap: 16 }}
          className="mb-4"
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const colors = getCategoryColor(item);
            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/explore/category/[id]",
                    params: {
                      id: item,
                      category: item,
                      bgColor: colors.bg,
                      borderColor: colors.border,
                    },
                  })
                }
                style={{
                  backgroundColor: colors.bg,
                  paddingVertical: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 180,
                  width: "48%",
                  marginHorizontal: "1%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 100,
                    borderRadius: 8,
                    marginBottom: 12,
                    backgroundColor: "transparent",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: colors.image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "transparent",
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Text className="font-semibold text-center text-lg">
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

export default ExploreScreen;
