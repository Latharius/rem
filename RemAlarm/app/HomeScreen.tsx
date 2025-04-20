import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlarmItem from '@/components/AlarmItem';
import { styles } from '@/styles/HomeScreen.styles';
import { useNavigation, useRoute, RouteProp, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Alarm } from '@/types';
import { debugDumpAlarms, fetchAlarms, initDb, updateAlarm } from '@/db';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const isFocused = useIsFocused();

  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const loadAlarms = () => {
    const fetched = fetchAlarms();
    setAlarms(fetched);
  };

  useFocusEffect(
    useCallback(() => {
      try {
        initDb();
        const dbAlarms = fetchAlarms();
        setAlarms(dbAlarms);
      } catch (error) {
        console.error("Failed to fetch alarms:", error);
      }
    }, [])
  );

  useEffect(() => {
    if (isFocused) {
      loadAlarms();
      debugDumpAlarms();
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.updatedAlarm || route.params?.deleteAlarmId || route.params?.newAlarm) {
      loadAlarms();
    }
  }, [route.params]);

  const toggleAlarm = async (id: string) => {
    setAlarms(prevAlarms =>
      prevAlarms.map(alarm => {
        if (alarm.id === id) {
          const updatedAlarm = { ...alarm, enabled: !alarm.enabled };
          updateAlarm(updatedAlarm);
          return updatedAlarm;
        }
        return alarm;
      })
    );
  };

  const handleAddAlarm = () => {
    navigation.navigate('AddAlarm');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alarms</Text>
      <FlatList
        data={alarms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AlarmItem alarm={item} onToggle={toggleAlarm} />
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;