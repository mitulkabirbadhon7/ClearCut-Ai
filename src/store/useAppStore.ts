import { create } from 'zustand';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

type ThemeMode = 'dark' | 'light';

interface AppState {
  activeModal: 'auth' | 'pricing' | 'upload' | null;
  toasts: ToastMessage[];
  theme: ThemeMode;
  setActiveModal: (modal: 'auth' | 'pricing' | 'upload' | null) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('clearcut_theme') as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return 'dark'; // default theme
};

const applyThemeToDOM = (theme: ThemeMode) => {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
  localStorage.setItem('clearcut_theme', theme);
};

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

export const useAppStore = create<AppState>((set, get) => ({
  activeModal: null,
  toasts: [],
  theme: initialTheme,

  setActiveModal: (modal) => set({ activeModal: modal }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(2, 9) }],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    applyThemeToDOM(nextTheme);
    set({ theme: nextTheme });
  },

  setTheme: (theme: ThemeMode) => {
    applyThemeToDOM(theme);
    set({ theme });
  },
}));
