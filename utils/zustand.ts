import { create } from "zustand";

interface UseOpenSidebarType {
  isSidebarOpen: boolean;
  setOpenSidebar: () => void;
}

export const useOpenSidebar = create<UseOpenSidebarType>((set) => ({
  isSidebarOpen: false,
  setOpenSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
