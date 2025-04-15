import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlarmItem from '@/components/AlarmItem';
import { styles } from '@/styles/HomeScreen.styles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Alarm } from '@/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type HomeScreenParams = {
    newAlarm?: Alarm;
    updatedAlarm?: Alarm;
    deleteAlarmId?: string;
}

const route = useRoute<RouteProp<{ Home: HomeScreenParams }, 'Home'>>();

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();

  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:00 AM', enabled: true, label: 'Morning Alarm', repeatDays: [true, true, false, false, false, false, false], tone: 'Tone1' },
    { id: '2', time: '08:00 AM', enabled: false, label: 'Work Alarm', repeatDays: [true, true, false, false, true, false, false], tone: 'Tone2' },
    { id: '3', time: '09:00 AM', enabled: true, label: 'Exercise Alarm', repeatDays: [true, true, true, true, true, true, true], tone: 'Tone3' },
  ]);

  useEffect(() => {
    if (route.params?.newAlarm) {
        const newAlarm = route.params.newAlarm;
        setAlarms(prev => [...prev, newAlarm]);
      } else if (route.params?.updatedAlarm) {
        const updatedAlarm = route.params.updatedAlarm;
        setAlarms(prev =>
          prev.map(a => a.id === updatedAlarm.id ? updatedAlarm : a)
        );
      } else if (route.params?.deleteAlarmId) {
        setAlarms(prev =>
          prev.filter(a => a.id !== route.params?.deleteAlarmId)
        );
      }
  }, [route.params]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const addAlarm = () => {
    const newAlarm: Alarm = {
      id: Math.random().toString(),
      time: '10:00 AM',
      enabled: true,
      label: 'New Alarm',
      repeatDays: [],
      tone: 'Default Tone',
    };
    setAlarms(prev => [...prev, newAlarm]);
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
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddAlarm')}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;