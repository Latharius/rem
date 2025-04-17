import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { styles } from "@/styles/AddAlarmScreen.styles";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { tones } from "@/constants/Tones";
import { Audio } from "expo-av";

type AddAlarmNavigationProp = NativeStackNavigationProp<RootStackParamList, "AddAlarm">;
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AddAlarmScreen: React.FC = () => {
    const navigation = useNavigation<AddAlarmNavigationProp>();
    const [time, setTime] = useState(new Date());
    const [label, setLabel] = useState("");
    const [tone, setTone] = useState("Default Tone");
    const [repeatDays, setRepeatDays] = useState<boolean[]>(Array(7).fill(false));

    const toggleDay = (index: number) => {
        const newDays = [...repeatDays];
        newDays[index] = !newDays[index];
        setRepeatDays(newDays);
    };

    const saveAlarm = () => {
        const alarm = {
            id: Math.random().toString(),
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            enabled: true,
            label,
            repeatDays,
            tone,
        };
        navigation.navigate('Home', { newAlarm: alarm });
    };

    const playTone = async (toneFile: any) => {
        const { sound } = await Audio.Sound.createAsync(toneFile);
        await sound.playAsync();
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.timePickerContainer}>
                <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={(event, selectedTime) => {
                        if (selectedTime) {
                            setTime(selectedTime);
                        }
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
            <TextInput
                style={styles.input}
                placeholder="Alarm Label"
                placeholderTextColor={"#aaa"}
                value={label}
                onChangeText={setLabel}
            />

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
                <TouchableOpacity onPress={saveAlarm} style={styles.saveButton}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddAlarmScreen;