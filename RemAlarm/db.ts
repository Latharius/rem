import * as SQLite from 'expo-sqlite';

// Open database synchronously
const db = SQLite.openDatabaseSync('alarms.db');

// Initialize the database (create tables)
export const initDb = () => {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS alarms (
        id TEXT PRIMARY KEY NOT NULL,
        time TEXT NOT NULL,
        label TEXT,
        tone TEXT,
        repeatDays TEXT,
        enabled INTEGER
      );`
    );
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// Insert a new alarm
export const insertAlarm = (alarm: {
  id: string;
  time: string;
  label: string;
  tone: string;
  repeatDays: boolean[];
  enabled: boolean;
}) => {
  try {
    db.runSync(
      `INSERT INTO alarms (id, time, label, tone, repeatDays, enabled) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        alarm.id,
        alarm.time,
        alarm.label,
        alarm.tone,
        JSON.stringify(alarm.repeatDays),
        alarm.enabled ? 1 : 0,
      ]
    );
    console.log('Alarm inserted');
  } catch (error) {
    console.error('Failed to insert alarm:', error);
  }
};

// Define the database alarm type
type DBAlarm = {
  id: string;
  time: string;
  label: string;
  tone: string;
  repeatDays: string;
  enabled: number;
};

// Fetch alarms
type Alarm = {
  id: string;
  time: string;
  label: string;
  tone: string;
  repeatDays: boolean[];
  enabled: boolean;
};

export const fetchAlarms = (): Alarm[] => {
    try {
      const result = db.getAllSync<DBAlarm>(`SELECT * FROM alarms;`);
      return result.map(alarm => ({
        ...alarm,
        repeatDays: JSON.parse(alarm.repeatDays),
        enabled: alarm.enabled === 1,
      }));
    } catch (error) {
      console.error('Failed to fetch alarms:', error);
      return [];
    }
  };

// Update an existing alarm
export const updateAlarm = (alarm: {
  id: string;
  time: string;
  label: string;
  tone: string;
  repeatDays: boolean[];
  enabled: boolean;
}) => {
  try {
    db.runSync(
      `UPDATE alarms SET time = ?, label = ?, tone = ?, repeatDays = ?, enabled = ? WHERE id = ?;`,
      [
        alarm.time,
        alarm.label,
        alarm.tone,
        JSON.stringify(alarm.repeatDays),
        alarm.enabled ? 1 : 0,
        alarm.id,
      ]
    );
    console.log('Alarm updated');
  } catch (error) {
    console.error('Failed to update alarm:', error);
  }
};

// Delete an alarm
export const deleteAlarmById = (id: string) => {
  try {
    db.runSync(`DELETE FROM alarms WHERE id = ?;`, [id]);
    console.log('Alarm deleted');
  } catch (error) {
    console.error('Failed to delete alarm:', error);
  }
};

// Debug function to log all alarms in the database
export const debugDumpAlarms = () => {
    try {
        const results = db.getAllSync(`SELECT * FROM alarms;`);
        console.log('🚨 Alarms Dump:\n' + JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Failed to dump alarms:', error);
    }
};

// Export the db if needed elsewhere
export default db;
