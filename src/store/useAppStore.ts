import { create } from 'zustand';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppState {
  activeModal: 'auth' | 'pricing' | 'upload' | null;
  toasts: ToastMessage[];
  setActiveModal: (modal: 'auth' | 'pricing' | 'upload' | null) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModal: null,
  toasts: [],
  setActiveModal: (modal) => set({ activeModal: modal }),
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(2, 9) }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
