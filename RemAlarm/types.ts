export type RootStackParamList = {
  Home: { newAlarm?: Alarm } | undefined;
  AddAlarm: undefined;
};

export interface Alarm {
    id: string;
    time: string;
    enabled: boolean;
    label: string;
    repeatDays: boolean[];
    tone: string;
}