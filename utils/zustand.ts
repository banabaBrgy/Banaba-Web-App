import { create } from "zustand";

interface UseOpenSidebarType {
  isSidebarOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}

interface useLandingSidebarType {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}

interface UseSendOtpPopupType {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}

interface UseShowAssistant {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}

interface UseUnreadNotificationLength {
  adminUnreads: number;
  userUnreads: number;
  setAdminUnreadNotification: (length: number) => void;
  setUserUnreadNotifications: (length: number) => void;
}

// use inside resident and admin page
export const useOpenSidebar = create<UseOpenSidebarType>((set) => ({
  isSidebarOpen: false,
  setOpen: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setClose: () => set({ isSidebarOpen: false }),
}));

//landing page sidebar
export const useLandingSidebar = create<useLandingSidebarType>((set) => ({
  isOpen: false,
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),
}));

// use in profile security
export const useSendOtpPopup = create<UseSendOtpPopupType>((set) => ({
  isOpen: false,
  setOpen: () => set(() => ({ isOpen: true })),
  setClose: () => set(() => ({ isOpen: false })),
}));

// for assistant
export const useShowAssistant = create<UseShowAssistant>((set) => ({
  isOpen: false,
  setOpen: () => set(() => ({ isOpen: true })),
  setClose: () => set(() => ({ isOpen: false })),
}));

// notifications unread
export const useUnreadNotificationLength = create<UseUnreadNotificationLength>(
  (set) => ({
    adminUnreads: 0,
    userUnreads: 0,
    setAdminUnreadNotification: (length: number) =>
      set({ adminUnreads: length }),
    setUserUnreadNotifications: (length: number) =>
      set({ userUnreads: length }),
  })
);
