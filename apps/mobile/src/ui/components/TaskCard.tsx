import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { AppIcon } from '../icons/AppIcon';
import { SprintTask } from './SprintCard';

export interface TaskCardProps {
  task: SprintTask;
  onPress?: () => void;
  isLast?: boolean;
}

function fmtRel(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const abs = Math.abs(diffMs);
  const min = 60 * 1000;
  const hr = 60 * min;
  const day = 24 * hr;
  let value: number;
  let unit: Intl.RelativeTimeFormatUnit = 'day';
  if (abs < hr) {
    value = Math.round(diffMs / min);
    unit = 'minute';
  } else if (abs < day) {
    value = Math.round(diffMs / hr);
    unit = 'hour';
  } else {
    value = Math.round(diffMs / day);
    unit = 'day';
  }
  try {
    const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
    return rtf.format(value, unit);
  } catch {
    const s = Math.abs(value);
    const label = unit === 'day' ? (s > 1 ? 'jours' : 'jour') : unit === 'hour' ? (s > 1 ? 'heures' : 'heure') : (s > 1 ? 'minutes' : 'minute');
    return value < 0 ? `il y a ${s} ${label}` : `dans ${s} ${label}`;
  }
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  isLast = false,
}) => {
  const isCompleted = task.status === 'Terminé';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Terminé';
  const progress = task.progress != null ? Math.round((task.progress <= 1 ? task.progress * 100 : task.progress)) : null;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Terminé':
        return { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
      case 'En cours':
        return { backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' };
      case 'En retard':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
      case 'À faire':
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' };
      default:
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' };
    }
  };

  const statusStyle = getStatusBadgeStyle(task.status);

  return (
    <TouchableOpacity
      style={[styles.container, isLast && styles.lastContainer]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.content}>
        {/* Header avec icône et titre */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {isCompleted && (
              <View style={styles.checkIcon}>
                <Text style={styles.checkMark}>✅</Text>
              </View>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{task.title}</Text>
              {task.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {task.description}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.backgroundColor,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {task.status}
            </Text>
          </View>
        </View>

        {/* Ligne d'infos */}
        <View style={styles.infoRow}>
          {task.assignedTo && (
            <View style={styles.infoItem}>
              <AppIcon name="user" size={14} variant="muted" />
              <Text style={styles.infoText}>{task.assignedTo}</Text>
            </View>
          )}
          {task.dueDate && (
            <View style={styles.infoItem}>
              <AppIcon name="calendar" size={14} variant="muted" />
              <Text style={[styles.infoText, isOverdue && styles.infoTextOverdue]}>
                {fmtRel(task.dueDate)}
              </Text>
            </View>
          )}
          {task.priority && (
            <View style={styles.infoItem}>
              <AppIcon name="shield" size={14} variant="muted" />
              <Text style={styles.infoText}>{task.priority}</Text>
            </View>
          )}
          {task.filesCount !== undefined && task.filesCount > 0 && (
            <View style={styles.infoItem}>
              <AppIcon name="receipt" size={14} variant="muted" />
              <Text style={styles.infoText}>{task.filesCount} fichier{task.filesCount > 1 ? 's' : ''}</Text>
            </View>
          )}
          {task.commentsCount !== undefined && task.commentsCount > 0 && (
            <View style={styles.infoItem}>
              <AppIcon name="mail" size={14} variant="muted" />
              <Text style={styles.infoText}>{task.commentsCount} commentaire{task.commentsCount > 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>

        {/* Barre de progression si disponible */}
        {progress !== null && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(Math.max(progress, 0), 100)}%`,
                    backgroundColor: isCompleted ? '#10B981' : '#7C3AED',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 0,
  },
  lastContainer: {
    marginBottom: 0,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkIcon: {
    marginTop: 2,
  },
  checkMark: {
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoTextOverdue: {
    color: '#EF4444',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 35,
  },
});

