import { ThemedView } from "@/components/ThemedView";
import ProductCard from "@/components/ui/ProductCard";
import { RecipeService } from "@/service/recipe.service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Badge,
  BadgeText,
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack
} from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes: string;
}

interface Instruction {
  stepNumber: number;
  instruction: string;
  estimatedTimeMinutes: number;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisineType: string;
  mealType: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficultyLevel: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  allergens: string[];
  allergenFreeClaims: string[];
}

interface RecipeListItem {
  id: string;
  name: string;
  image: string;
}

function CategoryScreen() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await RecipeService.getRecipes(category as string);
      setRecipes(res.data.data.items);
    } catch (error: any) {
      setError(error.response?.data?.message || "Không thể tải công thức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#83B177" />
        <Text className="mt-4 text-gray-600">Đang tải...</Text>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </ThemedView>
    );
  }

  if (selectedRecipe) {
    return (
      <ScrollView className="flex-1 bg-white">
        <Box>
          <Image
            source={{ uri: selectedRecipe.image }}
            alt={selectedRecipe.name}
            style={{ width: screenWidth, height: 250 }}
          />
          <Button
            variant="solid"
            size="sm"
            className="absolute top-4 left-4"
            onPress={() => setSelectedRecipe(null)}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Button>
        </Box>

        <VStack space="md" className="p-4">
          <Heading size="xl">{selectedRecipe.name}</Heading>
          <Text className="text-gray-600">{selectedRecipe.description}</Text>

          <HStack space="md" className="flex-wrap">
            <Badge variant="solid" bgColor="$primary500">
              <BadgeText>{selectedRecipe.cuisineType}</BadgeText>
            </Badge>
            <Badge variant="solid" bgColor="$secondary500">
              <BadgeText>{selectedRecipe.mealType}</BadgeText>
            </Badge>
            <Badge variant="solid" bgColor="$tertiary500">
              <BadgeText>Độ khó: {selectedRecipe.difficultyLevel}</BadgeText>
            </Badge>
          </HStack>

          <HStack space="xl" className="justify-between mt-4">
            <VStack alignItems="center">
              <MaterialIcons name="access-time" size={24} color="#83B177" />
              <Text className="text-sm">Chuẩn bị</Text>
              <Text className="font-semibold">{selectedRecipe.prepTimeMinutes} phút</Text>
            </VStack>
            <VStack alignItems="center">
              <MaterialIcons name="timer" size={24} color="#83B177" />
              <Text className="text-sm">Nấu</Text>
              <Text className="font-semibold">{selectedRecipe.cookTimeMinutes} phút</Text>
            </VStack>
            <VStack alignItems="center">
              <MaterialIcons name="people" size={24} color="#83B177" />
              <Text className="text-sm">Khẩu phần</Text>
              <Text className="font-semibold">{selectedRecipe.servings} người</Text>
            </VStack>
          </HStack>

          <Divider className="my-4" />

          <VStack space="md">
            <Heading size="lg">Nguyên liệu</Heading>
            {selectedRecipe.ingredients.map((ingredient, index) => (
              <HStack key={index} space="md" className="items-center">
                <MaterialIcons name="check-circle" size={20} color="#83B177" />
                <Text className="flex-1">
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                </Text>
                {ingredient.notes && (
                  <Text className="text-gray-500 text-sm">({ingredient.notes})</Text>
                )}
              </HStack>
            ))}
          </VStack>

          <Divider className="my-4" />

          <VStack space="md">
            <Heading size="lg">Các bước thực hiện</Heading>
            {selectedRecipe.instructions.map((instruction) => (
              <Box
                key={instruction.stepNumber}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <HStack space="md" className="items-start">
                  <Box
                    className="bg-primary-500 rounded-full w-8 h-8 items-center justify-center"
                  >
                    <Text className="text-white font-bold">
                      {instruction.stepNumber}
                    </Text>
                  </Box>
                  <VStack className="flex-1">
                    <Text className="text-base">{instruction.instruction}</Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      Thời gian: {instruction.estimatedTimeMinutes} phút
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>

          <Divider className="my-4" />

          <VStack space="md">
            <Heading size="lg">Thông tin bổ sung</Heading>
            
            {selectedRecipe.allergens.length > 0 && (
              <VStack space="sm">
                <Text className="font-semibold">Chất gây dị ứng:</Text>
                <HStack space="sm" className="flex-wrap">
                  {selectedRecipe.allergens.map((allergen, index) => (
                    <Badge key={index} variant="outline" borderColor="$red500">
                      <BadgeText color="$red500">{allergen}</BadgeText>
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            )}

            {selectedRecipe.allergenFreeClaims.length > 0 && (
              <VStack space="sm">
                <Text className="font-semibold">Không chứa:</Text>
                <HStack space="sm" className="flex-wrap">
                  {selectedRecipe.allergenFreeClaims.map((claim, index) => (
                    <Badge key={index} variant="outline" borderColor="$green500">
                      <BadgeText color="$green500">{claim}</BadgeText>
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    );
  }

  return (
    <ThemedView className="flex-1 p-7">
      <Text className="text-2xl font-bold mb-4">{category}</Text>
      <FlatList
        data={recipes}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            image={{ uri: item.image }}
            name={item.name}
            onPress={() =>  router.push({pathname: "/(tabs)/explore/recipe-detail/[id]", params: {id: item.id}})}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">Không tìm thấy công thức nào</Text>
          </View>
        }
      />
    </ThemedView>
  );
}

export default CategoryScreen;
