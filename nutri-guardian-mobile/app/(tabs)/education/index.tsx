import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Article from "../../../components/ui/Article";
const articles = [
  {
    id: 0,
    category: "All",
    title: "Understanding Peanut Allergies",
    description:
      "Learn about peanut allergies, one of the most common and severe food allergies, and how to manage them in daily life.",
    content: "This is the full content for the Understanding Peanut Allergies article. It would typically contain detailed information, symptoms, management strategies, and tips for avoiding peanuts.",
  },
  {
    id: 1,
    category: "Peanut Allergy",
    title: "Understanding Peanut Allergies",
    description:
      "Learn about peanut allergies, one of the most common and severe food allergies, and how to manage them in daily life.",
    content: "This is the full content for the Understanding Peanut Allergies article (Peanut Allergy category). It would contain more detailed information about this specific allergy.",
  },
  {
    id: 2,
    category: "Tree Nut Allergy",
    title: "Navigating Tree Nut Allergies",
    description:
      "Explore the challenges of tree nut allergies, including almonds and walnuts, and tips for avoiding cross-contamination.",
    content: "This is the full content for the Navigating Tree Nut Allergies article. It would discuss different types of tree nut allergies, cross-contamination risks, and management.",
  },
  {
    id: 3,
    category: "Milk Allergy",
    title: "Milk Allergies vs. Lactose Intolerance",
    description:
      "Understand the difference between milk allergies and lactose intolerance, and how to identify safe dairy-free alternatives.",
    content: "This is the full content for the Milk Allergies vs. Lactose Intolerance article. It would explain the biological differences and dietary approaches.",
  },
  {
    id: 4,
    category: "Egg Allergy",
    title: "Managing Egg Allergies in Children",
    description:
      "Discover how egg allergies affect children and strategies for safe meal planning and avoiding hidden egg ingredients.",
    content: "This is the full content for the Managing Egg Allergies in Children article. It would cover symptoms, diagnosis, and strategies for parents.",
  },
  {
    id: 5,
    category: "Wheat Allergy",
    title: "Living with a Wheat Allergy",
    description:
      "Learn about wheat allergies, their symptoms, and how to navigate a wheat-free diet without compromising nutrition.",
    content: "This is the full content for the Living with a Wheat Allergy article. It would detail symptoms, diagnosis, and how to follow a wheat-free diet.",
  },
  {
    id: 6,
    category: "Soy Allergy",
    title: "Soy Allergies and Hidden Sources",
    description:
      "Uncover the common sources of soy in foods and how to avoid them in processed and restaurant meals.",
    content: "This is the full content for the Soy Allergies and Hidden Sources article. It would list common and hidden sources of soy and avoidance strategies.",
  },
  {
    id: 7,
    category: "Fish Allergy",
    title: "Fish Allergies in Adults",
    description:
      "Understand why fish allergies are common in adults and how to safely avoid fish in diets and dining out.",
    content: "This is the full content for the Fish Allergies in Adults article. It would cover common types of fish allergies and safe practices for adults.",
  },
  {
    id: 8,
    category: "Shellfish Allergy",
    title: "Shellfish Allergies: What You Need to Know",
    description:
      "Explore the risks of shellfish allergies, including crustaceans and mollusks, and how to manage severe reactions.",
    content: "This is the full content for the Shellfish Allergies: What You Need to Know article. It would detail the risks, types of shellfish, and managing reactions.",
  },
  {
    id: 9,
    category: "Sesame Allergy",
    title: "The Rise of Sesame Allergies",
    description:
      "Learn about sesame allergies, their growing prevalence, and how to identify sesame in everyday foods.",
    content: "This is the full content for The Rise of Sesame Allergies article. It would discuss the increasing prevalence and how to identify sesame.",
  },
  {
    id: 10,
    category: "Mustard Allergy",
    title: "Mustard Allergies: A Lesser-Known Allergen",
    description:
      "Discover mustard allergies, their symptoms, and how to avoid mustard in condiments and processed foods.",
    content: "This is the full content for the Mustard Allergies: A Lesser-Known Allergen article. It would cover symptoms and how to avoid mustard.",
  },
];
function EducationScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState(articles[0]);
  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-row relative items-center justify-center mb-4">
        <TextInput
          className="flex-1 bg-[#F2F3F2] pl-12 h-14 rounded-xl"
          placeholder="Search articles"
        />
        <MaterialIcons
          className="absolute left-4"
          name="search"
          size={24}
          color={"black"}
        />
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.category}
        >
          {articles.map((art, index) => (
            <Pressable
              style={selected.id === art.id ? styles.tagSelected : styles.tag}
              key={index}
              onPress={() => setSelected(art)}
            >
              <Text
                style={{
                  color:
                    selected.id === art.id ? "white" : Colors.text.secondary,
                  fontSize: 12,
                }}
              >
                {art.category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Article
            title={item.title}
            description={item.description}
            category={item.category}
            onPress={() => router.push({
              pathname: "/(tabs)/education/educationDetail",
              params: item,
            })}
          />
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 0,
    flex: 1,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
  },
  category: {
    width: "100%",
    height: 40,
  },
  tag: {
    backgroundColor: "white",
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    height: 34,
  },
  tagSelected: {
    backgroundColor: Colors.primary,
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    height: 34,
  },
});
export default EducationScreen;
