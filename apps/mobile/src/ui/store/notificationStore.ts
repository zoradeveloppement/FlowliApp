import { create } from 'zustand';

interface NotificationState {
  hasNewTasks: boolean;
  hasNewInvoices: boolean;
  hasNewMessages: boolean;
  lastNotificationTime: string | null;
  unreadCount: number;
}

interface NotificationActions {
  setHasNewTasks: (hasNew: boolean) => void;
  setHasNewInvoices: (hasNew: boolean) => void;
  setHasNewMessages: (hasNew: boolean) => void;
  markAsRead: () => void;
  reset: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

const initialState: NotificationState = {
  hasNewTasks: false,
  hasNewInvoices: false,
  hasNewMessages: false,
  lastNotificationTime: null,
  unreadCount: 0,
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  ...initialState,
  
  setHasNewTasks: (hasNew: boolean) => {
    set((state) => ({
      hasNewTasks: hasNew,
      unreadCount: hasNew ? state.unreadCount + 1 : state.unreadCount,
      lastNotificationTime: hasNew ? new Date().toISOString() : state.lastNotificationTime,
    }));
  },
  
  setHasNewInvoices: (hasNew: boolean) => {
    set((state) => ({
      hasNewInvoices: hasNew,
      unreadCount: hasNew ? state.unreadCount + 1 : state.unreadCount,
      lastNotificationTime: hasNew ? new Date().toISOString() : state.lastNotificationTime,
    }));
  },
  
  setHasNewMessages: (hasNew: boolean) => {
    set((state) => ({
      hasNewMessages: hasNew,
      unreadCount: hasNew ? state.unreadCount + 1 : state.unreadCount,
      lastNotificationTime: hasNew ? new Date().toISOString() : state.lastNotificationTime,
    }));
  },
  
  markAsRead: () => {
    set({
      hasNewTasks: false,
      hasNewInvoices: false,
      hasNewMessages: false,
      unreadCount: 0,
    });
  },
  
  reset: () => {
    set(initialState);
  },
}));
