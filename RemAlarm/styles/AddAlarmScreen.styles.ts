import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000',
    flexGrow: 1,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  pickerButton: {
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 32,
    color: '#fff',
  },
  label: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    color: '#fff',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    padding: 10,
    borderRadius: 50,
    width: 40,
    height: 40,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: '#1e90ff',
  },
  dayText: {
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  saveButton: {
    backgroundColor: '#1e90ff',
    flex: 1,
    marginLeft: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  timePickerContainer: {
    alignItems: 'center',
  },
  toneOptionButton: {
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedTone: {
    backgroundColor: '#cce5ff', // light blue highlight
    borderColor: '#3399ff',
  },
  toneOptionText: {
    fontSize: 16,
    color: '#333',
  },
});
