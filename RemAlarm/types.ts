export type RootStackParamList = {
  Home: { newAlarm?: Alarm; updatedAlarm?: Alarm; deleteAlarmId?: string } | undefined;
  AddAlarm: undefined;
  EditAlarm: { alarm: Alarm };
};

export interface Alarm {
    id: string;
    time: string;
    enabled: boolean;
    label: string;
    repeatDays: boolean[];
    tone: string;
}