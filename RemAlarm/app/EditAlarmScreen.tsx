import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { styles } from "@/styles/AddAlarmScreen.styles";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types";
import { tones } from "@/constants/Tones";
import { playTone, stopTone } from "@/utils/tonePlayer";
import { updateAlarm, deleteAlarmById } from "@/db";
import { scheduleAlarmNotification, cancelAlarmNotification } from "@/utils/notifications";

type EditRouteProp = RouteProp<RootStackParamList, 'EditAlarm'>;

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const EditAlarmScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditRouteProp>();
  const alarm = route.params.alarm;

  const [label, setLabel] = useState(alarm.label);
  const [tone, setTone] = useState(alarm.tone);
  const [repeatDays, setRepeatDays] = useState(alarm.repeatDays);

  const createTimeFromAlarm = (alarmTime: string) => {
    const normalizedTime = alarmTime.replace(/\u202F/g, " "); // replace narrow no-break space with normal space
    const [timePart, meridian] = normalizedTime.split(" ");
    const [rawHours, rawMinutes] = timePart.split(":").map(Number);

    let hours = rawHours;
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, rawMinutes, 0, 0);
  };

  const [time, setTime] = useState(() => createTimeFromAlarm(alarm.time));

  const toggleDay = (index: number) => {
    const newDays = [...repeatDays];
    newDays[index] = !newDays[index];
    setRepeatDays(newDays);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const meridian = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${meridian}`;
  };

  const saveChanges = async () => {
    stopTone().then(async () => {
      const hour = time.getHours();
      const minute = time.getMinutes();
      const notificationId = await scheduleAlarmNotification(Math.random().toString(), hour, minute);

      const updatedAlarm = {
        ...alarm,
        time: formatTime(time), // 🛠️ manually formatted time
        label,
        tone,
        repeatDays,
        notificationId,
      };
      try {
        updateAlarm(updatedAlarm);
        navigation.goBack();
      } catch (error) {
        console.error("Failed to update alarm:", error);
      }
    });
  };

  const deleteAlarm = () => {
    stopTone().then(() => {
      Alert.alert("Delete Alarm", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (alarm.notificationId) {
                await cancelAlarmNotification(alarm.notificationId);
              }
              deleteAlarmById(alarm.id);
              navigation.goBack();
            } catch (error) {
              console.error("Failed to delete alarm:", error);
            }
          },
        },
      ]);
    });
  };

  useEffect(() => {
    return () => {
      stopTone(); // Stop the tone when screen unmounts
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.timePickerContainer}>
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={(event, selectedTime) => {
            if (selectedTime) setTime(selectedTime);
          }}
        />
      </View>

      <Text style={styles.label}>Repeat</Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity key={index} onPress={() => toggleDay(index)} style={[styles.dayButton, repeatDays[index] && styles.daySelected]}>
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Label</Text>
      <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="Alarm Label" placeholderTextColor="#aaa" />

      <Text style={styles.label}>Tone</Text>
      {tones.map((toneOption, index) => (
          <TouchableOpacity 
              key={index} 
              onPress={() => {setTone(toneOption.name); playTone(toneOption.File)}} 
              style={[
                  styles.toneOptionButton, 
                  tone === toneOption.name && styles.selectedTone,
                  ]}>
              <Text style={styles.toneOptionText}>{toneOption.name}</Text>
          </TouchableOpacity>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={deleteAlarm} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditAlarmScreen;