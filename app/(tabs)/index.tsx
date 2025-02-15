import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  ScrollView,
} from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '~/context/AuthContext';
import { FirestoreTaskRepository } from '~/repositories/FirestoreTaskRepository';
import { Task } from '~/repositories/Task';
import { AddTaskModal } from '~/components/AddTaskModal';
import { TaskItem } from '~/components/TaskItem';
import { AntDesign, Feather } from '@expo/vector-icons';

type Section = {
  title: string;
  data: Task[];
};

type Priority = 'low' | 'medium' | 'high' | 'all';
type Status = 'completed' | 'active' | 'all';

export default function TaskScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [taskRepository, setTaskRepository] = useState<FirestoreTaskRepository | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority>('all');
  const [selectedStatus, setSelectedStatus] = useState<Status>('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority;
      const statusMatch =
        selectedStatus === 'all' ||
        (selectedStatus === 'completed' ? task.completed : !task.completed);
      return priorityMatch && statusMatch;
    });
  }, [tasks, selectedPriority, selectedStatus]);

  const FilterButton = ({
    label,
    isSelected,
    onPress,
    color = '#007AFF',
  }: {
    label: string;
    isSelected: boolean;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && { backgroundColor: color, borderColor: color }]}
      onPress={onPress}>
      <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const FilterSection = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Priority</Text>
          <View style={styles.filterButtons}>
            <FilterButton
              label="All"
              isSelected={selectedPriority === 'all'}
              onPress={() => setSelectedPriority('all')}
            />
            <FilterButton
              label="Low"
              isSelected={selectedPriority === 'low'}
              onPress={() => setSelectedPriority('low')}
              color="#4CAF50"
            />
            <FilterButton
              label="Medium"
              isSelected={selectedPriority === 'medium'}
              onPress={() => setSelectedPriority('medium')}
              color="#FFC107"
            />
            <FilterButton
              label="High"
              isSelected={selectedPriority === 'high'}
              onPress={() => setSelectedPriority('high')}
              color="#F44336"
            />
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.filterButtons}>
            <FilterButton
              label="All"
              isSelected={selectedStatus === 'all'}
              onPress={() => setSelectedStatus('all')}
            />
            <FilterButton
              label="Active"
              isSelected={selectedStatus === 'active'}
              onPress={() => setSelectedStatus('active')}
            />
            <FilterButton
              label="Completed"
              isSelected={selectedStatus === 'completed'}
              onPress={() => setSelectedStatus('completed')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const categorizeTasks = (tasks: Task[]): Section[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const sections: Section[] = [
      { title: 'Past Due', data: [] },
      { title: 'Today', data: [] },
      { title: 'Tomorrow', data: [] },
      { title: 'This Week', data: [] },
      { title: 'Upcoming', data: [] },
    ];

    tasks.forEach((task) => {
      const dueDate = task.dueDate ? new Date(String(task.dueDate)) : null;

      if (!dueDate) {
        return;
      }

      const dueDateWithoutTime = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
      );

      if (dueDateWithoutTime < today) {
        sections[0].data.push(task);
      } else if (dueDateWithoutTime.getTime() === today.getTime()) {
        sections[1].data.push(task);
      } else if (dueDateWithoutTime.getTime() === tomorrow.getTime()) {
        sections[2].data.push(task);
      } else if (dueDateWithoutTime <= weekEnd) {
        sections[3].data.push(task);
      } else {
        sections[4].data.push(task);
      }
    });

    sections.forEach((section) => {
      section.data.sort((a, b) => {
        const dateA = a.dueDate ? new Date(String(a.dueDate)) : new Date();
        const dateB = b.dueDate ? new Date(String(b.dueDate)) : new Date();
        return dateA.getTime() - dateB.getTime();
      });
    });

    return sections.filter((section) => section.data.length > 0);
  };

  useEffect(() => {
    if (user) {
      setTaskRepository(new FirestoreTaskRepository(user.uid));
      loadTasks();
    }
  }, [user?.uid]);

  const handleAddTask = async (
    newTask: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const task = await taskRepository!.createTask(newTask);
      setTasks([task, ...tasks]);
      setIsAddModalVisible(false);
    } catch (error) {
      console.log('Error adding task:', error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const updatedTask = await taskRepository!.toggleComplete(taskId);
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (error) {
      console.log('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskRepository!.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, taskUpdate: Partial<Task>) => {
    try {
      const updatedTask = await taskRepository!.updateTask(taskId, taskUpdate);
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
      setEditTask(null);
      setIsAddModalVisible(false);
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const handleUpdateTaskId = (task: Task) => {
    setEditTask(task);
    setIsAddModalVisible(true);
  };

  const loadTasks = async () => {
    try {
      let tempRepo = taskRepository;
      if (!tempRepo) {
        tempRepo = new FirestoreTaskRepository(user!.uid);
        setTaskRepository(tempRepo);
      }
      const loadedTasks = await tempRepo.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.log('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return user ? (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => setIsFilterVisible(!isFilterVisible)}
                style={styles.headerButton}>
                <Feather name="filter" size={24} color={isFilterVisible ? '#007AFF' : '#000000'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEditTask(null);
                  setIsAddModalVisible(true);
                }}
                style={styles.headerButton}>
                <AntDesign name="pluscircle" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        {isFilterVisible && <FilterSection />}

        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color="#666" />
            <Text style={styles.emptyStateText}>No tasks found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters or add a new task
            </Text>
          </View>
        ) : (
          <SectionList
            sections={categorizeTasks(filteredTasks)}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onUpdate={handleUpdateTaskId}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            refreshing={isLoading}
            onRefresh={loadTasks}
            stickySectionHeadersEnabled={true}
          />
        )}

        <AddTaskModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAdd={handleAddTask}
          onUpdate={handleUpdateTask}
          task={editTask || null}
        />
      </View>
    </>
  ) : (
    <Redirect href="/login" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginRight: 16,
  },
  headerButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  sectionHeader: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
