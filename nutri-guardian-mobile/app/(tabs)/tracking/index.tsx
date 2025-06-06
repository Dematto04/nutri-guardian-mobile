import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = {
  name: 'Jack - J97',
  email: 'Phuongtuanmeomeo@gmail.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
}

const trackingItems = [
  {
    key: '1',
    icon: <Ionicons name="thumbs-up" size={28} color="#7DE1EF" />, // Food Recommend
    title: 'Food Recommend',
    date: 'October 21 2021',
    locked: false,
  },
  {
    key: '2',
    icon: <Ionicons name="heart-outline" size={28} color="#7DE1EF" />, // Health Tracking
    title: 'Health Tracking',
    date: 'October 21 2021',
    locked: false,
  },
  {
    key: '3',
    icon: <MaterialCommunityIcons name="map-marker-path" size={28} color="#7DE1EF" />, // Daily Tracking
    title: 'Daily Tracking',
    date: 'October 21 2021',
    locked: false,
  },
  {
    key: '4',
    icon: <Feather name="credit-card" size={28} color="#C4C4C4" />, // Membership (locked)
    title: 'Membership',
    date: 'Locking',
    locked: true,
  },
  {
    key: '5',
    icon: <FontAwesome5 name="user-lock" size={28} color="#C4C4C4" />, // Membership (locked)
    title: 'Membership',
    date: 'Locking',
    locked: true,
  },
]

function TrackingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Card */}
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

      {/* Tracking List */}
      <View style={styles.listCard}>
        {trackingItems.map((item, idx) => (
          <View key={item.key} style={styles.listItemRow}>
            <View style={styles.iconCol}>
              <View style={[styles.iconCircle, item.locked && styles.iconCircleLocked]}>
                {item.icon}
              </View>
              {idx < trackingItems.length - 1 && (
                <View style={[styles.verticalLine, item.locked && styles.verticalLineLocked]} />
              )}
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, item.locked && styles.itemTitleLocked]}>{item.title}</Text>
              <Text style={[styles.itemDate, item.locked && styles.itemDateLocked]}>{item.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ECECEC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
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
  listCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 8,
    marginBottom: 16,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    minHeight: 60,
  },
  iconCol: {
    alignItems: 'center',
    width: 56,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F8FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleLocked: {
    backgroundColor: '#F2F2F2',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E6F8FB',
    marginTop: 2,
  },
  verticalLineLocked: {
    backgroundColor: '#F2F2F2',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  itemTitleLocked: {
    color: '#C4C4C4',
  },
  itemDate: {
    fontSize: 11,
    color: '#A0A0A0',
    marginTop: 2,
  },
  itemDateLocked: {
    color: '#C4C4C4',
  },
})

export default TrackingScreen
