import { Colors } from "@/constants/Colors";
import { MealPlanService } from "@/service/mealPlan.service";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Box,
  Divider,
  Text as GlueText,
  HStack,
  Progress,
  ScrollView,
  VStack,
} from "@gluestack-ui/themed";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MealEntry {
  id: number;
  // Add other meal entry properties if needed
}

interface MealPlan {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  planType: string;
  notes: string;
  totalMeals: number;
  completedMeals: number;
  createdAt: string;
  mealEntries: MealEntry[];
}

interface MealPlanResponse {
  isSucceeded: boolean;
  timestamp: string;
  messages: {
    Success: string[];
  };
  data: {
    items: MealPlan[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  pagination: null;
}

function TrackingScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const router = useRouter();

  const getMealPlan = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError(null);

    try {
      const res = await MealPlanService.getMealPlan();
      const responseData = res.data as MealPlanResponse;

      if (responseData.isSucceeded && responseData.data?.items) {
        setMealPlans(responseData.data.items);
      } else {
        setError("Không thể tải dữ liệu kế hoạch bữa ăn");
      }
    } catch (error) {
      console.log("Get meal plan error", { error });
      setError("Đã xảy ra lỗi khi tải kế hoạch bữa ăn");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getMealPlan(false);
  };

  useEffect(() => {
    if (isFocused) {
      getMealPlan();
    }
  }, [isFocused]);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Calculate completion percentage
  const calculateCompletion = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const renderMealPlanCard = (mealPlan: MealPlan) => {
    const completionPercentage = calculateCompletion(
      mealPlan.completedMeals,
      mealPlan.totalMeals
    );

    return (
      <View key={mealPlan.id} style={styles.mealPlanCard}>
        <HStack space="md" alignItems="center" mb="$2">
          <Feather name="clipboard" size={24} color={Colors.primary} />
          <GlueText fontSize="$lg" fontWeight="$bold" color="$coolGray800">
            {mealPlan.name}
          </GlueText>
        </HStack>

        <Divider my="$2" />

        <VStack space="sm">
          {/* Date Range */}
          <HStack space="sm" alignItems="center">
            <MaterialIcons name="date-range" size={18} color="#64748b" />
            <GlueText fontSize="$sm" color="$coolGray600">
              {formatDisplayDate(mealPlan.startDate)} -{" "}
              {formatDisplayDate(mealPlan.endDate)}
            </GlueText>
          </HStack>

          {/* Notes */}
          {mealPlan.notes && (
            <HStack space="sm" alignItems="flex-start">
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#64748b"
                style={{ marginTop: 2 }}
              />
              <GlueText fontSize="$sm" color="$coolGray600" flex={1}>
                {mealPlan.notes}
              </GlueText>
            </HStack>
          )}

          {/* Progress Section */}
          <Box mt="$2">
            <HStack justifyContent="space-between" mb="$1">
              <GlueText fontSize="$xs" color="$coolGray500">
                Tiến độ
              </GlueText>
              <GlueText
                fontSize="$xs"
                color="$coolGray700"
                fontWeight="$medium"
              >
                {mealPlan.completedMeals}/{mealPlan.totalMeals} bữa ăn
              </GlueText>
            </HStack>

            <Progress value={completionPercentage} size="sm">
              <Progress.FilledTrack bg={Colors.primary} />
            </Progress>

            <HStack justifyContent="flex-end" mt="$1">
              <GlueText
                fontSize="$xs"
                color={Colors.primary}
                fontWeight="$medium"
              >
                {completionPercentage}% hoàn thành
              </GlueText>
            </HStack>
          </Box>
        </VStack>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => {
            // Navigate to meal plan detail screen (to be implemented)
            router.push({
              pathname: "/tracking/meal-plan-detail",
              params: {
                id: mealPlan.id
              }
            })
            console.log("View meal plan details:", mealPlan.id);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.detailButtonText}>Xem chi tiết</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="white"
              style={{ marginLeft: 4 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Main render method
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Đang tải kế hoạch bữa ăn...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color="#ef4444"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => getMealPlan()}
            >
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : mealPlans.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>
              Bạn chưa có kế hoạch bữa ăn nào
            </Text>
            <Text style={styles.emptyDesc}>
              Hãy bắt đầu lên kế hoạch bữa ăn để theo dõi dinh dưỡng và sức khỏe
              của bạn dễ dàng hơn.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/tracking/create-meal-plan")}
            >
              <Text style={styles.addButtonText}>+ Thêm kế hoạch bữa ăn</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mealPlanContainer}>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              px="$3"
              py="$2"
              mb="$2"
            >
              <GlueText fontSize="$xl" fontWeight="$bold" color="$coolGray800">
                Kế hoạch bữa ăn của bạn
              </GlueText>
              <TouchableOpacity
                style={styles.addPlanButton}
                onPress={() => router.push("/tracking/create-meal-plan")}
              >
                <Ionicons name="add" size={18} color="white" />
              </TouchableOpacity>
            </HStack>

            {mealPlans.map((mealPlan) => renderMealPlanCard(mealPlan))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mealPlanContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    alignSelf: "flex-end",
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  retryButtonText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "600",
  },
  addPlanButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  mealPlanCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default TrackingScreen;
