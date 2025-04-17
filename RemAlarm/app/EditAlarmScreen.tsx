import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { styles } from "@/styles/AddAlarmScreen.styles";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types";
import { tones } from "@/constants/Tones";
import { Audio } from "expo-av";

type EditRouteProp = RouteProp<RootStackParamList, 'EditAlarm'>;

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const EditAlarmScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditRouteProp>();
  const alarm = route.params.alarm;

  const [time, setTime] = useState(new Date(`1970-01-01T${alarm.time}`));
  const [label, setLabel] = useState(alarm.label);
  const [tone, setTone] = useState(alarm.tone);
  const [repeatDays, setRepeatDays] = useState(alarm.repeatDays);

  const toggleDay = (index: number) => {
    const newDays = [...repeatDays];
    newDays[index] = !newDays[index];
    setRepeatDays(newDays);
  };

  const saveChanges = () => {
    const updatedAlarm = {
      ...alarm,
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label,
      tone,
      repeatDays,
    };
    navigation.navigate("Home", { updatedAlarm });
  };

  const deleteAlarm = () => {
    Alert.alert("Delete Alarm", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => navigation.navigate("Home", { deleteAlarmId: alarm.id }),
      },
    ]);
  };

  const playTone = async (toneFile: any) => {
    const { sound } = await Audio.Sound.createAsync(toneFile);
    await sound.playAsync();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Alarm</Text>

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