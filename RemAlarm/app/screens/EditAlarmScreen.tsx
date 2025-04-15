import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { styles } from "@/styles/AddAlarmScreen.styles";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types";

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
  const [showPicker, setShowPicker] = useState(false);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Alarm</Text>

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.pickerButton}>
        <Text style={styles.pickerText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={(event, selectedTime) => {
            setShowPicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

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
      <TouchableOpacity onPress={() => setTone("New Tone")} style={styles.pickerButton}>
        <Text style={styles.pickerText}>{tone}</Text>
      </TouchableOpacity>

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