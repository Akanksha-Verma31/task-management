import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, Priority } from '~/repositories/Task';
import { Timestamp } from 'firebase/firestore';
import DateInput from './DatePicker.web';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (taskId: string, taskUpdate: Partial<Task>) => void;
  task: Task | null | undefined;
}

const PRIORITY_COLORS = {
  low: {
    background: '#4CAF50',
    text: '#FFFFFF',
    border: '#43A047',
  },
  medium: {
    background: '#FFC107',
    text: '#000000',
    border: '#FFB300',
  },
  high: {
    background: '#F44336',
    text: '#FFFFFF',
    border: '#E53935',
  },
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export function AddTaskModal({ visible, onClose, onAdd, onUpdate, task }: AddTaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date());
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setDueDate(task?.dueDate || new Date());
    setPriority(task?.priority || 'medium');
    setIsSubmitting(false);
  }, [task]);

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Description is required');
      return false;
    }

    if (!dueDate) {
      Alert.alert('Error', 'Due date is required');
      return false;
    }

    if (!priority) {
      Alert.alert('Error', 'Priority is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (task?.id) {
        await onUpdate(task.id, {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate instanceof Timestamp ? dueDate : Timestamp.fromDate(dueDate),
          priority,
          completed: false,
        });
      } else {
        await onAdd({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate instanceof Timestamp ? dueDate : Timestamp.fromDate(dueDate),
          priority,
          completed: false,
        });
      }

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setPriority('medium');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <DateInput
          min={new Date().toISOString().split('T')[0]}
          value={new Date(String(dueDate)).toISOString().split('T')[0]}
          onChange={(value) => {
            setDueDate(new Date(value));
          }}
        />
      );
    }

    return (
      <View style={styles.datePicker}>
        {showDateTimePicker && (
          <DateTimePicker
            value={new Date(String(dueDate))}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(_, selectedDate) => {
              setShowDateTimePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDateTimePicker(true)}
          disabled={isSubmitting}>
          <Text style={styles.datePickerText}>
            {new Date(String(dueDate)).toLocaleString().split(',')[0]}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{task?.id ? 'Update' : 'Add New'} Task</Text>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.formField}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
                editable={!isSubmitting}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter task description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                editable={!isSubmitting}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Due Date *</Text>
              {renderDatePicker()}
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Priority *</Text>
              <View style={styles.priorityButtons}>
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      priority === p && {
                        backgroundColor: PRIORITY_COLORS[p].background,
                        borderColor: PRIORITY_COLORS[p].border,
                      },
                      isSubmitting && styles.disabled,
                    ]}
                    onPress={() => setPriority(p)}
                    disabled={isSubmitting}>
                    <Text
                      style={[
                        styles.priorityButtonText,
                        priority === p && {
                          color: PRIORITY_COLORS[p].text,
                        },
                      ]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSubmitting}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, isSubmitting && styles.disabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}>
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Saving...' : task?.id ? 'Update Task' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  container: {
    width: Platform.OS === 'web' ? '100%' : '90%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.xl,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  form: {
    maxHeight: '78%',
  },
  formField: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#F5F5F5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePicker: {
    marginBottom: SPACING.sm,
  },
  datePickerButton: {
    padding: SPACING.md,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  datePickerText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  webDateInput: {
    padding: SPACING.md,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
  },
  button: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
