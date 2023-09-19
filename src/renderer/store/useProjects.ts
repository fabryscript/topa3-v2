import { create } from 'zustand';
import { ProjectFile } from '../types';

interface ProjectsStoreState {
  projects: {};
  setProjects: (proj: ProjectFile) => void;
}

const useProjects = create<ProjectsStoreState>((set) => ({
  projects: {},
  setProjects: (proj) => set({ projects: proj }),
}));

export default useProjects;
