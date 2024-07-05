import { create } from "zustand";

interface UseOpenSidebarType {
  isSidebarOpen: boolean;
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

// use inside resident and admin page
export const useOpenSidebar = create<UseOpenSidebarType>((set) => ({
  isSidebarOpen: false,
  setOpen: () => set({ isSidebarOpen: true }),
  setClose: () => set({ isSidebarOpen: false }),
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
