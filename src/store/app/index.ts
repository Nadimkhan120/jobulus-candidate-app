import { create } from 'zustand';

type RegisterType = 'recruiter' | 'company' | null;
interface AppState {
  drawerStatus: boolean;
  userChatCount: number;
  companyType: RegisterType;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setCompanyType: (data: RegisterType) => void;
  setUserChatCount: (data: any) => void;
  editUserChatCount: (data: any) => void;
}

export const useApp = create<AppState>((set, get) => ({
  drawerStatus: false,
  companyType: null,
  userChatCount: 0,
  openDrawer: () => {
    set({ drawerStatus: true });
  },
  closeDrawer: () => {
    set({ drawerStatus: false });
  },
  toggleDrawer: () => {
    set({ drawerStatus: !get().drawerStatus });
  },
  setCompanyType: (data: RegisterType) => {
    set({ companyType: data });
  },
  setUserChatCount: (data: any) => {
    set({ userChatCount: data });
  },
  editUserChatCount: (data: any) => {
    let updatedCount = get().userChatCount === 0 ? 0 : get().userChatCount - data;

    set({ userChatCount: updatedCount });
  },
}));

export const openDrawer = () => useApp.getState().openDrawer();
export const closeDrawer = () => useApp.getState().closeDrawer();
export const toggleDrawer = () => useApp.getState().toggleDrawer();

export const setCompanyType = (data: RegisterType) => {
  return useApp.getState().setCompanyType(data);
};

export const setUserChatCount = (data: any) => {
  return useApp.getState().setUserChatCount(data);
};

export const editUserChatCount = (data: any) => {
  return useApp.getState().editUserChatCount(data);
};
