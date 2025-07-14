import { ThemedView } from "@/components/ThemedView";
import ExploreSkeleton from "@/components/explore/ExploreSkeleton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MealPlanService } from "@/service/mealPlan.service";
import { RecipeService } from "@/service/recipe.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
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

const mealTypeFilters = [
  { key: 'all', label: '🍽️ Tất cả', color: '#64748b' },
  { key: 'breakfast', label: '🌅 Sáng', color: '#f59e0b' },
  { key: 'lunch', label: '☀️ Trưa', color: '#06b6d4' },
  { key: 'dinner', label: '🌙 Tối', color: '#8b5cf6' },
  { key: 'snack', label: '🍿 Snack', color: '#f97316' },
];

function ExploreScreen() {
  const theme = useThemeColor;
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [recommendations, setRecommendations] = useState<number[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendedRecipes, setRecommendedRecipes] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (selectedMealType !== 'all') {
      fetchMealTypeRecommendations(selectedMealType);
    } else {
      fetchRecommendations();
    }
  }, [selectedMealType]);

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

  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      
      // Default preferences for general recommendations
      const preferences = {
        cuisineTypes: ['Italian', 'Asian', 'Vietnamese'],
        maxCookingTime: 60,
        budgetRange: 'medium' as const,
        preferredMealTypes: ['breakfast', 'lunch', 'dinner'],
        includeLeftovers: true,
        varietyMode: true,
      };

      const response = await MealPlanService.getRecipeRecommendations('dinner', preferences);
      
      if (response.data?.isSucceeded) {
        const recipeIds = response.data.data.slice(0, 8); // Get top 8 recommendations
        setRecommendations(recipeIds);
        
        // Fetch recipe details for recommendations
        const recipeDetails = await Promise.all(
          recipeIds.map(async (id: number) => {
            try {
              const recipeResponse = await RecipeService.getRecipeById(id.toString());
              return recipeResponse.data?.data;
            } catch (error) {
              console.error(`Error fetching recipe ${id}:`, error);
              return null;
            }
          })
        );
        
        setRecommendedRecipes(recipeDetails.filter(recipe => recipe !== null));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const fetchMealTypeRecommendations = async (mealType: string) => {
    try {
      setRecommendationsLoading(true);
      
      const preferences = {
        cuisineTypes: ['Italian', 'Asian', 'Vietnamese'],
        maxCookingTime: mealType === 'breakfast' ? 30 : 60,
        budgetRange: 'medium' as const,
        preferredMealTypes: [mealType],
        includeLeftovers: true,
        varietyMode: true,
      };

      const response = await MealPlanService.getRecipeRecommendations(mealType, preferences);
      
      if (response.data?.isSucceeded) {
        const recipeIds = response.data.data.slice(0, 6);
        setRecommendations(recipeIds);
        
        // Fetch recipe details
        const recipeDetails = await Promise.all(
          recipeIds.map(async (id: number) => {
            try {
              const recipeResponse = await RecipeService.getRecipeById(id.toString());
              return recipeResponse.data?.data;
            } catch (error) {
              return null;
            }
          })
        );
        
        setRecommendedRecipes(recipeDetails.filter(recipe => recipe !== null));
      }
    } catch (error) {
      console.error('Error fetching meal type recommendations:', error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    return (
      categoryColors[category as keyof typeof categoryColors] || {
        border: "rgb(83,177,117)",
        bg: "rgba(83,177,117,0.1)",
        image: "https://www.pngall.com/wp-content/uploads/2016/03/Vegetable-PNG-Picture.png",
      }
    );
  };

  const renderMealTypeFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {mealTypeFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedMealType === filter.key && styles.filterChipSelected,
              { borderColor: filter.color }
            ]}
            onPress={() => setSelectedMealType(filter.key)}
          >
            <Text style={[
              styles.filterChipText,
              selectedMealType === filter.key && styles.filterChipTextSelected
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRecommendationCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.recommendationCard}
      onPress={() => router.push(`/(tabs)/explore/recipe-detail/${item.id}`)}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.recommendationImage}
        resizeMode="cover"
      />
      <View style={styles.recommendationOverlay}>
        <Text style={styles.recommendationTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.recommendationMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="white" />
            <Text style={styles.metaText}>{item.prepTime + item.cookTime}min</Text>
          </View>
          {item.difficulty && (
            <View style={styles.metaItem}>
              <Ionicons name="bar-chart-outline" size={12} color="white" />
              <Text style={styles.metaText}>{item.difficulty}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendationsSection = () => (
    <View style={styles.recommendationsSection}>
      <View style={styles.sectionHeader}>
        <Ionicons name="sparkles" size={20} color="#007AFF" />
        <Text style={styles.sectionTitle}>
          {selectedMealType === 'all' ? 'Gợi ý cho bạn' : `Gợi ý ${mealTypeFilters.find(f => f.key === selectedMealType)?.label}`}
        </Text>
      </View>

      {recommendationsLoading ? (
        <View style={styles.recommendationsLoading}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tìm món ngon cho bạn...</Text>
        </View>
      ) : recommendedRecipes.length > 0 ? (
        <FlatList
          data={recommendedRecipes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecommendationCard}
          contentContainerStyle={styles.recommendationsList}
        />
      ) : (
        <View style={styles.noRecommendations}>
          <Ionicons name="restaurant-outline" size={32} color="#94a3b8" />
          <Text style={styles.noRecommendationsText}>Chưa có gợi ý nào</Text>
        </View>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ExploreSkeleton />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchCategories}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🔍 Khám phá món ngon</Text>
            <TouchableOpacity 
              style={styles.smartButton}
              onPress={() => router.push('/(tabs)/tracking/create-meal-plan')}
            >
              <Ionicons name="sparkles" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Meal Type Filters */}
          {renderMealTypeFilter()}

          {/* Recommendations Section */}
          {renderRecommendationsSection()}

          {/* Categories Section */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>📂 Danh mục nguyên liệu</Text>
            
            <View style={styles.categoriesGrid}>
              {categories.map((item, index) => {
                const colors = getCategoryColor(item);
                return (
                  <TouchableOpacity
                    key={item}
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
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                      }
                    ]}
                  >
                    <View style={styles.categoryImageContainer}>
                      <Image
                        source={{ uri: colors.image }}
                        style={styles.categoryImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.categoryTitle}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  smartButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  filterChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterChipTextSelected: {
    color: 'white',
  },
  recommendationsSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  recommendationsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
  },
  recommendationsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  recommendationCard: {
    width: 160,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  recommendationImage: {
    width: '100%',
    height: '100%',
  },
  recommendationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
  },
  recommendationTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: 'white',
    fontSize: 11,
  },
  noRecommendations: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  noRecommendationsText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  categoriesSection: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    minHeight: 180,
  },
  categoryImageContainer: {
    width: '100%',
    height: 100,
    marginBottom: 12,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1e293b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
};

export default ExploreScreen;
