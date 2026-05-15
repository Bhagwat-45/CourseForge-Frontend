import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useUIStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = {
          id,
          timestamp: new Date().toISOString(),
          read: false,
          ...notification
        };
        
        set((state) => {
          const updated = [newNotification, ...state.notifications].slice(0, 50);
          return {
            notifications: updated,
            unreadCount: updated.filter(n => !n.read).length
          };
        });

        // Trigger non-blocking toast de-duplicated by ID/Title
        const toastId = notification.toastId || notification.title;
        if (notification.type === 'success') {
          toast.success(notification.message || notification.title, { id: toastId });
        } else if (notification.type === 'error') {
          toast.error(notification.message || notification.title, { id: toastId });
        } else {
          toast(notification.message || notification.title, { id: toastId });
        }
      },

      markAsRead: (id) => {
        set((state) => {
          const updated = state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter(n => !n.read).length
          };
        });
      },

      markAllAsRead: () => {
        set((state) => {
          const updated = state.notifications.map(n => ({ ...n, read: true }));
          return {
            notifications: updated,
            unreadCount: 0
          };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      }
    }),
    {
      name: 'courseforge-ui-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
