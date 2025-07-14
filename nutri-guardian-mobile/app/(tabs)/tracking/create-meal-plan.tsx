import { Colors } from "@/constants/Colors";
import { MealPlanService } from "@/service/mealPlan.service";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

import { SubscriptionGate } from "@/components/SubscriptionGate";
import { useSubscription } from "@/hooks/useSubscription";
import React, { useRef, useState } from "react";
import {
    Alert,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


type MealPlanItem = {
  meal: string;
  dish: string;
  time: string;
  note: string;
  name: string;
  height: number;
  day: string;
};

type MealPlanCreateRequest = {
  name: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export default function CreateMealPlanScreen() {
  // Animation refs
  const buttonScale = useRef(new Animated.Value(1)).current;
  const router = useRouter()
  
  // Subscription hook
  const { hasActiveSubscription } = useSubscription();
  
  // Form state
  const [formData, setFormData] = useState<MealPlanCreateRequest>({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // Default to 1 week plan
    notes: ''
  });

  // UI state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hàm validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên kế hoạch';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    } else if (formData.endDate < formData.startDate) {
      newErrors.endDate = 'Ngày kết thúc không được trước ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // No longer need separate date handler functions as we handle this directly in the onChange

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Gọi API tạo meal plan
      console.log({formData});
      
      await MealPlanService.createMealPlan(formData);
      console.log('Submitting meal plan:', formData);
      
      // Hiển thị thông báo thành công
      Alert.alert(
        'Thành công',
        'Kế hoạch bữa ăn đã được tạo thành công!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Navigate back to tracking tab
              router.replace("/(tabs)/tracking");
            }
          }
        ]
      );
    } catch (error) {
      console.log({error});
      
      Alert.alert('Lỗi', 'Không thể tạo kế hoạch bữa ăn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle button animation
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Check if this is a smart meal plan creation (we can add a prop later for this)
  const isSmartMealPlan = formData.name.toLowerCase().includes('thông minh') || 
                         formData.name.toLowerCase().includes('smart') ||
                         formData.notes.toLowerCase().includes('ai');

  // Show subscription gate for smart meal planning
  if (isSmartMealPlan && !hasActiveSubscription) {
    return (
      <SubscriptionGate
        title="Tạo Thực Đơn Thông Minh"
        description="Tính năng tạo thực đơn thông minh với AI chỉ dành cho thành viên Premium. Nâng cấp ngay để trải nghiệm!"
        featureName="Thực đơn thông minh với AI"
      />
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            {/* <Text style={styles.header}>Tạo Kế Hoạch Bữa Ăn</Text> */}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên kế hoạch</Text>
              <TextInput
                style={[
                  styles.input, 
                  errors.name ? styles.inputError : null,
                  focusedInput === 'name' ? styles.inputFocused : null
                ]}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({...formData, name: text});
                  setErrors({...errors, name: ''});
                }}
                placeholder="Ví dụ: Kế hoạch ăn uống hàng tuần"
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
                returnKeyType="next"
              />
              {errors.name ? <Text style={styles.errorText}><MaterialIcons name="error-outline" size={14} /> {errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ngày bắt đầu</Text>
              <TouchableOpacity 
                style={[
                  styles.dateInput, 
                  errors.startDate ? styles.inputError : null,
                  focusedInput === 'startDate' ? styles.inputFocused : null
                ]}
                onPress={() => {
                  setShowStartDatePicker(true);
                  setFocusedInput('startDate');
                  Keyboard.dismiss();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.dateText}>{formatDisplayDate(formData.startDate)}</Text>
                <AntDesign name="calendar" size={20} style={styles.calendarIcon} />
              </TouchableOpacity>
              {errors.startDate ? <Text style={styles.errorText}><MaterialIcons name="error-outline" size={14} /> {errors.startDate}</Text> : null}
              
              {showStartDatePicker && (
                <DateTimePicker
                  value={new Date(formData.startDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || new Date(formData.startDate);
                    setShowStartDatePicker(Platform.OS === 'ios');
                    setFocusedInput(null);
                    if (event.type !== 'dismissed') {
                      setFormData({
                        ...formData,
                        startDate: currentDate.toISOString().split('T')[0]
                      });
                      setErrors({...errors, startDate: ''});
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ngày kết thúc</Text>
              <TouchableOpacity 
                style={[
                  styles.dateInput, 
                  errors.endDate ? styles.inputError : null,
                  focusedInput === 'endDate' ? styles.inputFocused : null
                ]}
                onPress={() => {
                  setShowEndDatePicker(true);
                  setFocusedInput('endDate');
                  Keyboard.dismiss();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.dateText}>{formatDisplayDate(formData.endDate)}</Text>
                <AntDesign name="calendar" size={20} style={styles.calendarIcon} />
              </TouchableOpacity>
              {errors.endDate ? <Text style={styles.errorText}><MaterialIcons name="error-outline" size={14} /> {errors.endDate}</Text> : null}
              
              {showEndDatePicker && (
                <DateTimePicker
                  value={new Date(formData.endDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || new Date(formData.endDate);
                    setShowEndDatePicker(Platform.OS === 'ios');
                    setFocusedInput(null);
                    if (event.type !== 'dismissed') {
                      setFormData({
                        ...formData,
                        endDate: currentDate.toISOString().split('T')[0]
                      });
                      setErrors({...errors, endDate: ''});
                    }
                  }}
                  minimumDate={new Date(formData.startDate)}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ghi chú</Text>
              <TextInput
                style={[
                  styles.textArea, 
                  errors.notes ? styles.inputError : null,
                  focusedInput === 'notes' ? styles.inputFocused : null
                ]}
                value={formData.notes}
                onChangeText={(text) => setFormData({...formData, notes: text})}
                placeholder="Thêm ghi chú về kế hoạch này..."
                multiline={true}
                numberOfLines={4}
                onFocus={() => setFocusedInput('notes')}
                onBlur={() => setFocusedInput(null)}
              />
              {errors.notes ? <Text style={styles.errorText}><MaterialIcons name="error-outline" size={14} /> {errors.notes}</Text> : null}
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={[styles.submitButton, loading ? styles.disabledButton : null]} 
                onPress={() => {
                  animateButton();
                  handleSubmit();
                }}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <AntDesign name="loading1" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.submitButtonText}>Đang tạo...</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.submitButtonText}>Tạo kế hoạch</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  formContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#334155',
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: '#cbd5e1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 120,
    textAlignVertical: 'top',
    shadowColor: '#cbd5e1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dateInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#cbd5e1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#334155',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#93c5fd',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  calendarIcon: {
    marginLeft: 8,
    color: '#64748b',
  },
  inputLabel: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    top: -10,
    left: 12,
    zIndex: 1,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  }
});
