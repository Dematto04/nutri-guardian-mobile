import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const profile = {
  name: 'Jack - J97',
  email: 'Phuongtuanmeomeo@gmail.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};

const menuItems = [
  {
    key: 'info',
    label: 'Information',
    icon: <FontAwesome5 name="user" size={20} color="#222" />,
    rightIcon: <Ionicons name="chevron-down" size={20} color="#222" />,
    onPress: null,
  },
  {
    key: 'details',
    label: 'My Details',
    icon: <Feather name="credit-card" size={20} color="#222" />,
    rightIcon: <Ionicons name="chevron-forward" size={20} color="#222" />,
    onPress: null,
  },
  {
    key: 'address',
    label: 'Delivery Address',
    icon: <Ionicons name="location-outline" size={20} color="#222" />,
    rightIcon: <Ionicons name="chevron-forward" size={20} color="#222" />,
    onPress: null,
  },
  {
    key: 'payment',
    label: 'Payment Methods',
    icon: <Feather name="credit-card" size={20} color="#222" />,
    rightIcon: <Ionicons name="chevron-forward" size={20} color="#222" />,
    onPress: 'mycards',
  },
  {
    key: 'membership',
    label: "Nutri Guardian's Membership",
    icon: <MaterialCommunityIcons name="shield-account" size={20} color="#7DE1EF" />,
    rightIcon: <Ionicons name="chevron-forward" size={20} color="#222" />,
    onPress: null,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: <Ionicons name="notifications-outline" size={20} color="#222" />,
    rightIcon: <Ionicons name="chevron-forward" size={20} color="#222" />,
    onPress: null,
  },
  {
    key: 'help',
    label: 'Help',
    icon: <Ionicons name="help-circle-outline" size={20} color="#222" />,
    rightIcon: <Ionicons name="chevron-forward" size={20} color="#222" />,
    onPress: null,
  },
  {
    key: 'about',
    label: 'About',
    icon: <Ionicons name="information-circle-outline" size={20} color="#222" />,
    rightIcon: <Ionicons name="chevron-forward" size={20} color="#222" />,
    onPress: null,
  },
];

function AccountScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32, marginTop: 16 }}>
        {/* Profile */}
        <View style={styles.profileCard}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Feather name="edit-2" size={14} color="#7DE1EF" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        </View>
        {/* Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuRow}
              activeOpacity={0.7}
              onPress={() => {
                if (item.onPress) router.push('/(tabs)/account/mycards');
              }}
            >
              <View style={styles.menuIcon}>{item.icon}</View>
              <Text style={[styles.menuLabel, item.key === 'membership' && { color: '#7DE1EF', fontWeight: '700' }]}>{item.label}</Text>
              <View style={{ flex: 1 }} />
              {item.rightIcon}
            </TouchableOpacity>
          ))}
        </View>
        {/* Log Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={()=> router.replace('/(auth)/login')}>
          <Ionicons name="log-out-outline" size={22} color="#7DE1EF" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  profileEmail: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingHorizontal: 12,
  },
  menuIcon: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    marginHorizontal: 32,
    marginTop: 24,
    paddingVertical: 18,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#7DE1EF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default AccountScreen;
