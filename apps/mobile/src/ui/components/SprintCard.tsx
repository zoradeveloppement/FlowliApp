import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { TaskCard } from './TaskCard';

export interface SprintTask {
  id: string;
  title: string;
  status: string;
  progress: number | null;
  dueDate: string | null;
  description?: string;
  assignedTo?: string;
  priority?: string;
  filesCount?: number;
  commentsCount?: number;
}

export interface SprintCardProps {
  title: string;
  status: string;
  date?: string;
  tasks: SprintTask[];
  progress: number; // 0-100
  onTaskPress?: (task: SprintTask) => void;
}

export const SprintCard: React.FC<SprintCardProps> = ({
  title,
  status,
  date,
  tasks,
  progress,
  onTaskPress,
}) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Terminé':
        return { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderColor: '#10B981' };
      case 'En cours':
        return { backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', borderColor: '#7C3AED' };
      case 'En retard':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderColor: '#EF4444' };
      case 'À faire':
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', borderColor: '#6B7280' };
      default:
        return { backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', borderColor: '#7C3AED' };
    }
  };

  const statusStyle = getStatusBadgeStyle(status);

  return (
    <View style={styles.container}>
      {/* Header du sprint */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          {date && (
            <Text style={styles.date}>{date}</Text>
          )}
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusStyle.backgroundColor,
              borderColor: statusStyle.borderColor,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {status}
          </Text>
        </View>
      </View>

      {/* Compteur de tâches et progression */}
      <View style={styles.meta}>
        <Text style={styles.taskCount}>
          {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(Math.max(progress, 0), 100)}%`,
                  backgroundColor: progress === 100 ? '#10B981' : '#7C3AED',
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>

      {/* Liste des tâches */}
      <View style={styles.tasksContainer}>
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() => onTaskPress?.(task)}
            isLast={index === tasks.length - 1}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  taskCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 120,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 35,
  },
  tasksContainer: {
    gap: 12,
  },
});

