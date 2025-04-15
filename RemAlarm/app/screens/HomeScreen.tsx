import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AlarmItem from '@/components/AlarmItem';
import { styles } from '@/styles/HomeScreen.styles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Alarm = {
  id: string;
  time: string;
  enabled: boolean;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();

  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:00 AM', enabled: true },
    { id: '2', time: '08:00 AM', enabled: false },
    { id: '3', time: '09:00 AM', enabled: true },
  ]);

  useEffect(() => {
    const newAlarm = route.params?.newAlarm;
    if (newAlarm) {
        setAlarms(prev => [...prev, newAlarm]);
    }
  }, [route.params?.newAlarm]);

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