import { create } from 'zustand';

interface ExperienceState {
  selectedCompany: string;
  selectedLocation: any;
  selectedSchool: any;
  selectedDegree: any;
  selectedField: any;
  setSelectedCompany: (data: any) => void;
  setSelectedLocation: (data: any) => void;
  setSelectedSchool: (data: any) => void;
  setSelectedDegree: (data: any) => void;
  setSelectedField: (data: any) => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  selectedCompany: '',
  selectedLocation: '',
  selectedSchool: null,
  selectedField: null,
  selectedDegree: null,
  setSelectedCompany: (data: string) => {
    set({ selectedCompany: data });
  },
  setSelectedLocation: (data: string) => {
    set({ selectedLocation: data });
  },
  setSelectedSchool: (data: any) => {
    set({ selectedSchool: data });
  },
  setSelectedDegree: (data: any) => {
    set({ selectedDegree: data });
  },
  setSelectedField: (data: any) => {
    set({ selectedField: data });
  },
}));

export const setSelectedCompany = (data) => {
  return useExperience.getState().setSelectedCompany(data);
};

export const setSelectedSchool = (data) => {
  return useExperience.getState().setSelectedSchool(data);
};

export const setSelectedLocation = (data) => {
  return useExperience.getState().setSelectedLocation(data);
};

export const setSelectedDegree = (data) => {
  return useExperience.getState().setSelectedDegree(data);
};

export const setSelectedField = (data) => {
  return useExperience.getState().setSelectedField(data);
};
