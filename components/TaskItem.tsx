import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Task } from '~/repositories/Task';
import Feather from '@expo/vector-icons/Feather';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
}

const PRIORITY_COLORS = {
  low: '#4CAF50',
  medium: '#FFC107',
  high: '#F44336',
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export function TaskItem({ task, onToggleComplete, onDelete, onUpdate }: TaskItemProps) {
  const formattedDate = new Date(String(task.dueDate)).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onUpdate(task)}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggleComplete(task.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather
            name={task.completed ? 'check-circle' : 'circle'}
            size={24}
            color={task.completed ? '#007AFF' : '#C7C7CC'}
          />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, task.completed && styles.completedText]} numberOfLines={1}>
              {task.title}
            </Text>
            <View
              style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[task.priority] }]}>
              <Text style={styles.priorityText}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Text>
            </View>
          </View>

          {task.description ? (
            <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
              {task.description}
            </Text>
          ) : null}

          <Text style={styles.date}>Due: {formattedDate}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="trash-2" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  pressed: {
    opacity: 0.7,
  },
  innerContainer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: SPACING.md,
  },
  contentContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: SPACING.sm,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: SPACING.xs,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    minWidth: 70,
  },
  priorityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  deleteButton: {
    padding: SPACING.xs,
  },
});
