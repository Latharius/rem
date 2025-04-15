import React from "react";
import { View, Text, Switch } from "react-native";
import { styles } from "../styles/HomeScreen.styles";

type Alarm = {
    id: string;
    time: string;
    enabled: boolean;
};

type Props = {
    alarm: Alarm;
    onToggle: (id: string) => void;
};

const AlarmItem: React.FC<Props> = ({ alarm, onToggle }) => {
    return (
        <View style={styles.alarmItem}>
            <Text style={styles.timeText}>{alarm.time}</Text>
            <Switch
                value={alarm.enabled}
                onValueChange={() => onToggle(alarm.id)}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={alarm.enabled ? "#f5dd4b" : "#f4f3f4"}
            />
        </View>
    );
};

export default AlarmItem;