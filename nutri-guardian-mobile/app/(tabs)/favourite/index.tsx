import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TimelineStep {
  status: string;
  date: string;
  color: string;
  active: boolean;
}

interface FavoriteItem {
  id: string;
  title: string;
  placed: string;
  items: string;
  types: string;
  expanded: boolean;
  timeline?: TimelineStep[];
  recommend?: { label: string; date: string };
}

const favoriteData: FavoriteItem[] = [
  {
    id: '1',
    title: 'Nutri Guard #90897',
    placed: 'Mar 15, 2025',
    items: '?',
    types: '?',
    expanded: true,
    timeline: [
      { status: 'Used', date: 'Mar 6 2025', color: '#7DE1EF', active: true },
      { status: 'Used', date: 'Mar 9 2025', color: '#7DE1EF', active: true },
      { status: 'Used', date: 'Mar 15 2025', color: '#7DE1EF', active: true },
      { status: 'pending', date: 'Mar 16 2025', color: '#E0E0E0', active: false },
      { status: 'pending', date: 'Mar 17 2025', color: '#E0E0E0', active: false },
    ],
  },
  {
    id: '2',
    title: 'Nutri Guard #90896',
    placed: 'Mar 10, 2025',
    items: '?',
    types: '?',
    expanded: false,
    recommend: { label: 'Recommend Food', date: 'Mar 9 2025' },
  },
  {
    id: '3',
    title: 'Nutri Guard #908975',
    placed: 'Mar 9, 2025',
    items: '?',
    types: '?',
    expanded: false,
    recommend: { label: 'Recommend Food', date: 'Mar 9 2025' },
  },
  {
    id: '4',
    title: 'Nutri Guard #90894',
    placed: 'Mar 6, 2025',
    items: '?',
    types: '?',
    expanded: false,
    recommend: { label: 'Recommend Food', date: 'Mar 6 2025' },
  },
];

type FavoriteCardProps = {
  item: FavoriteItem;
  expanded: boolean;
  onToggleExpand: () => void;
};

function FavoriteCard({ item, expanded, onToggleExpand }: FavoriteCardProps) {
  return (
    <View style={[styles.card, {  marginTop: 16,}]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="cube-outline" size={32} color="#7DE1EF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardPlaced}>Placed on {item.placed}</Text>
          <View style={{ flexDirection: 'row', marginTop: 2 }}>
            <Text style={styles.cardInfo}>Items: <Text style={styles.cardInfoValue}>{item.items}</Text></Text>
            <Text style={styles.cardInfo}>   Types: <Text style={styles.cardInfoValue}>{item.types}</Text></Text>
          </View>
        </View>
        {item.timeline ? (
          <TouchableOpacity onPress={onToggleExpand} style={{ padding: 8 }}>
            <Ionicons name={expanded ? 'chevron-down' : 'chevron-forward'} size={22} color="#222" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-forward" size={22} color="#222" />
        )}
      </View>
      {/* Timeline for expanded card */}
      {expanded && item.timeline && (
        <View style={styles.timelineContainer}>
          {(item.timeline ?? []).map((step: TimelineStep, idx: number) => (
            <View key={idx} style={styles.timelineRow}>
              <View style={styles.timelineCol}>
                <View style={[styles.timelineDot, { backgroundColor: step.color }]} />
                {item.timeline && idx < item.timeline.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: step.color }]} />
                )}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.timelineStatus, { color: step.active ? '#222' : '#C4C4C4', fontWeight: step.active ? '700' : '400' }]}>{step.status}</Text>
                <Text style={[styles.timelineDate, { color: step.active ? '#222' : '#C4C4C4' }]}>{step.date}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      {/* Recommend Food row for non-expanded cards */}
      {!expanded && item.recommend && (
        <View style={styles.recommendRow}>
          <Text style={styles.recommendLabel}>{item.recommend.label}</Text>
          <Text style={styles.recommendDate}>{item.recommend.date}</Text>
        </View>
      )}
    </View>
  );
}

function FavouriteScreen() {
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* List */}
      <FlatList
        data={favoriteData}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <FavoriteCard
            item={item}
            expanded={expandedId === item.id && !!item.timeline}
            onToggleExpand={() => handleToggleExpand(item.id)}
          />
        )}
        style={{ marginTop: 8 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6F8FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  cardPlaced: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 2,
  },
  cardInfo: {
    fontSize: 12,
    color: '#A0A0A0',
    marginRight: 8,
  },
  cardInfoValue: {
    color: '#222',
    fontWeight: '600',
  },
  timelineContainer: {
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
  timelineCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E6F8FB',
    marginTop: 2,
    marginBottom: 2,
  },
  timelineStatus: {
    fontSize: 14,
    marginLeft: 8,
  },
  timelineDate: {
    fontSize: 13,
    marginRight: 8,
  },
  recommendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    marginTop: 12,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  recommendLabel: {
    color: '#C4C4C4',
    fontSize: 15,
    fontWeight: '600',
  },
  recommendDate: {
    color: '#C4C4C4',
    fontSize: 13,
  },
});

export default FavouriteScreen;
