import { useEffect, useState } from 'react';
import stripAnsi from 'strip-ansi';
import FloatingTerminalButton from '../components/FloatingTerminalButton';
import ProjectCard from '../components/ProjectCard';
import useRetrieveProjects from '../utils/useRetrieveProjects';
import UploadBox from '../components/UploadBox';

function Dashboard() {
  const { projects } = useRetrieveProjects();
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('shell-result', (e) => {
      const resultArray = e as Uint8Array;
      const decoder = new TextDecoder('utf-8');
      const result = decoder.decode(resultArray);

      // Check if the result is already present in the terminalOutput array
      if (!terminalOutput.includes(result)) {
        // Append the result to the terminalOutput array
        setTerminalOutput((prevOutput) => [...prevOutput, stripAnsi(result)]);
      }
    });
  }, [terminalOutput]); // Add terminalOutput as a dependency to useEffect

  return (
    <div className="relative text-white flex flex-col p-10 justify-center gap-10">
      <div>
        <h1 className="text-4xl font-semibold">Benvenuto nella Dashboard.</h1>
        <h2 className="text-2xl mt-2 font-semibold opacity-50">
          Ecco i tuoi progetti
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-3 min-h-[200px]">
        {projects &&
          projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        <UploadBox />
      </div>
      <FloatingTerminalButton />
    </div>
  );
}

export default Dashboard;
