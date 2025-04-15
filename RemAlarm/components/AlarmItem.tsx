import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { styles } from "../styles/HomeScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types";

type Alarm = {
    id: string;
    time: string;
    enabled: boolean;
    label: string;
    repeatDays: boolean[];
    tone: string;
};

type Props = {
    alarm: Alarm;
    onToggle: (id: string) => void;
};

const AlarmItem: React.FC<Props> = ({ alarm, onToggle }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity onPress={() => navigation.navigate("EditAlarm", { alarm })}>
            <View style={styles.alarmItem}>
                <Text style={styles.timeText}>{alarm.time}</Text>
                <Switch
                    value={alarm.enabled}
                    onValueChange={() => onToggle(alarm.id)}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={alarm.enabled ? "#f5dd4b" : "#f4f3f4"}
                />
            </View>
        </TouchableOpacity>
    );
};

export default AlarmItem;