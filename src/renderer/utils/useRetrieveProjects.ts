import { useState, useEffect } from 'react';
import { ProjectFile } from '../types';

const useRetrieveProjects = () => {
  const [projects, setProjects] = useState<ProjectFile[]>();
  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('retrieve-projects', [])
      .then((res) => {
        const parsedResponse = JSON.parse(res);
        if (res !== null) {
          setProjects(parsedResponse);
        }
        return null;
      })
      .catch(console.error);
  }, []);

  return { projects, setProjects };
};

export default useRetrieveProjects;
