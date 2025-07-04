// import { RecipeDetailResponseDto } from '@/dtos/recipe/recipe.dto';
import CookingSteps from "@/components/ui/CookingSteps";
import { Colors } from "@/constants/Colors";
import { RecipeService } from "@/service/recipe.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    console.log({ id });
    RecipeService.getRecipeById(String(id))
      .then((res) => {
        console.log({ res });
        setRecipe(res.data.data);
      })
      .catch((err) => {
        setError("Không thể tải dữ liệu công thức.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
      case "dễ":
        return "#4CAF50";
      case "medium":
      case "trung bình":
        return "#FF9800";
      case "hard":
      case "khó":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getCuisineIcon = (cuisineType: string) => {
    switch (cuisineType?.toLowerCase()) {
      case "việt nam":
      case "vietnamese":
        return "restaurant-outline";
      case "chinese":
      case "trung quốc":
        return "fish-outline";
      case "japanese":
      case "nhật bản":
        return "leaf-outline";
      default:
        return "restaurant-outline";
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType?.toLowerCase()) {
      case "bữa sáng":
      case "breakfast":
        return "sunny-outline";
      case "bữa trưa":
      case "lunch":
        return "partly-sunny-outline";
      case "bữa tối":
      case "dinner":
        return "moon-outline";
      default:
        return "restaurant-outline";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Đang tải công thức...</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>
          {error || "Không tìm thấy công thức"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Recipe Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: recipe.thumbnailImageUrl || "https://via.placeholder.com/400x300",
          }}
          style={styles.recipeImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF6B6B" : "#FFF"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Recipe Title */}
        <Text style={styles.recipeTitle}>
          {recipe.name || "Tên công thức"}
        </Text>

        {/* Recipe Info Badges */}
        <View style={styles.infoBadgesContainer}>
          <View style={styles.infoBadge}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoBadgeText}>
              {recipe.prepTimeMinutes || "30"} phút
            </Text>
          </View>

          <View style={styles.infoBadge}>
            <Ionicons name="flame-outline" size={16} color="#666" />
            <Text style={styles.infoBadgeText}>
              {recipe.cookTimeMinutes || "30"} phút nấu
            </Text>
          </View>

          <View
            style={[
              styles.infoBadge,
              {
                backgroundColor:
                  getDifficultyColor(recipe.difficultyLevel) + "20",
              },
            ]}
          >
            <Ionicons
              name="bar-chart-outline"
              size={16}
              color={getDifficultyColor(recipe.difficultyLevel)}
            />
            <Text
              style={[
                styles.infoBadgeText,
                { color: getDifficultyColor(recipe.difficultyLevel) },
              ]}
            >
              {recipe.difficultyLevel || "Trung bình"}
            </Text>
          </View>

          <View style={styles.infoBadge}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.infoBadgeText}>
              {recipe.servings || "4"} người
            </Text>
          </View>
        </View>

        {/* Additional Info Badges */}
        <View style={styles.infoBadgesContainer}>
          {recipe.cuisineType && (
            <View style={styles.infoBadge}>
              <Ionicons 
                name={getCuisineIcon(recipe.cuisineType)} 
                size={16} 
                color="#666" 
              />
              <Text style={styles.infoBadgeText}>{recipe.cuisineType}</Text>
            </View>
          )}

          {recipe.mealType && (
            <View style={styles.infoBadge}>
              <Ionicons 
                name={getMealTypeIcon(recipe.mealType)} 
                size={16} 
                color="#666" 
              />
              <Text style={styles.infoBadgeText}>{recipe.mealType}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {recipe.description && (
          <View style={styles.section}>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>
        )}

        {/* Author & Source Info */}
        <View style={styles.section}>
          <View style={styles.authorContainer}>
            <View style={styles.authorInfo}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.authorText}>
                {recipe.originalAuthor || "Tác giả không xác định"}
              </Text>
            </View>
            <View style={styles.sourceInfo}>
              <Ionicons name="link-outline" size={20} color="#666" />
              <Text style={styles.sourceText}>
                {recipe.sourceUrl || "Nguồn không xác định"}
              </Text>
            </View>
          </View>
        </View>

        {/* Allergens Section */}
        {recipe.allergens && recipe.allergens.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="warning-outline" size={20} color="#FF6B6B" /> 
              {" "}Chất gây dị ứng
            </Text>
            <View style={styles.allergensContainer}>
              {recipe.allergens.map((allergen: string, index: number) => (
                <View key={index} style={styles.allergenBadge}>
                  <Ionicons name="alert-circle" size={14} color="#FF6B6B" />
                  <Text style={styles.allergenText}>{allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Allergen-Free Claims */}
        {recipe.allergenFreeClaims && recipe.allergenFreeClaims.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              {" "}Không chứa
            </Text>
            <View style={styles.allergenFreeContainer}>
              {recipe.allergenFreeClaims.map((claim: string, index: number) => (
                <View key={index} style={styles.allergenFreeBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.allergenFreeText}>{claim}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Enhanced Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nguyên liệu</Text>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients?.map((ingredient: any, index: number) => (
              <View key={index} style={styles.enhancedIngredientItem}>
                <View style={styles.ingredientHeader}>
                  <View style={styles.ingredientNumber}>
                    <Text style={styles.ingredientNumberText}>{ingredient.orderIndex || index + 1}</Text>
                  </View>
                  <View style={styles.ingredientMainInfo}>
                    <Text style={styles.ingredientName}>
                      {typeof ingredient === "string" ? ingredient : ingredient.name}
                    </Text>
                    {typeof ingredient === "object" && (
                      <View style={styles.ingredientQuantityContainer}>
                        <Text style={styles.ingredientQuantity}>
                          {ingredient.quantity} {ingredient.unit}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {typeof ingredient === "object" && ingredient.notes && (
                  <View style={styles.ingredientNotes}>
                    <Ionicons name="information-circle-outline" size={14} color="#666" />
                    <Text style={styles.ingredientNotesText}>{ingredient.notes}</Text>
                  </View>
                )}
              </View>
            )) || (
              <Text style={styles.placeholderText}>
                Chưa có thông tin nguyên liệu
              </Text>
            )}
          </View>
        </View>

        {/* Nutrition Information */}
        {recipe.nutrition && recipe.nutrition.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="fitness-outline" size={20} color="#4CAF50" />
              {" "}Thông tin dinh dưỡng
            </Text>
            <View style={styles.nutritionContainer}>
              {recipe.nutrition.map((nutrient: any, index: number) => (
                <View key={index} style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>{nutrient.name}</Text>
                  <Text style={styles.nutritionValue}>
                    {nutrient.amount} {nutrient.unit}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Cooking Steps Section */}
        <View style={styles.section}>
          {recipe.instructions && recipe.instructions.length > 0 ? (
            <CookingSteps
              instructions={recipe.instructions}
              onStepComplete={(stepNumber) => {
                console.log(`Step ${stepNumber} completed`);
              }}
            />
          ) : (
            <Text style={styles.placeholderText}>Chưa có hướng dẫn nấu ăn</Text>
          )}
        </View>

        {/* Recipe Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống kê</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="star-outline" size={20} color="#FFD700" />
              <Text style={styles.statLabel}>Đánh giá</Text>
              <Text style={styles.statValue}>
                {recipe.ratingAverage ? `${recipe.ratingAverage}/5` : "Chưa có"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={20} color="#FF6B6B" />
              <Text style={styles.statLabel}>Lượt thích</Text>
              <Text style={styles.statValue}>
                {recipe.likesCount || "0"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="bookmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.statLabel}>Lưu</Text>
              <Text style={styles.statValue}>
                {recipe.savesCount || "0"}
              </Text>
            </View>
          </View>
        </View>

        {/* Recipe Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khác</Text>
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Loại công thức:</Text>
              <Text style={styles.metadataValue}>
                {recipe.isCustom ? "Tùy chỉnh" : "Công khai"}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Trạng thái:</Text>
              <Text style={styles.metadataValue}>
                {recipe.isPublic ? "Công khai" : "Riêng tư"}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Ngày tạo:</Text>
              <Text style={styles.metadataValue}>
                {new Date(recipe.createAt).toLocaleDateString("vi-VN")}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Cập nhật:</Text>
              <Text style={styles.metadataValue}>
                {new Date(recipe.updateAt).toLocaleDateString("vi-VN")}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
    lineHeight: 34,
  },
  infoBadgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  infoBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    fontStyle: "italic",
  },
  authorContainer: {
    gap: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  sourceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sourceText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  allergensContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  allergenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  allergenText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D32F2F",
  },
  allergenFreeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  allergenFreeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  allergenFreeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },
  ingredientsContainer: {
    gap: 16,
  },
  enhancedIngredientItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  ingredientHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  ingredientNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  ingredientMainInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  ingredientQuantityContainer: {
    alignSelf: "flex-start",
  },
  ingredientQuantity: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ingredientNotes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  ingredientNotesText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    flex: 1,
  },
  nutritionContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  nutritionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  nutritionLabel: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  nutritionValue: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "600",
  },
  metadataContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  metadataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metadataLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  metadataValue: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "600",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});