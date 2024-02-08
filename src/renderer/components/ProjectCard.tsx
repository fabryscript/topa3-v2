import { AiOutlinePlayCircle } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { ProjectFile } from '../types';

function ProjectCard({ project }: { project: ProjectFile }) {
  return (
    <div
      key={project.name}
      className="neomorphistic flex flex-col justify-center items-center min-w-[300px] min-h-[250px] gap-10"
    >
      <div className="flex flex-col">
        <p className="font-semibold">{project.name}</p>
      </div>
      <div className="flex flex-row gap-3">
        <button
          type="button"
          className="startbutton flex-1 p-5 flex justify-center items-center"
          onClick={() => {
            window.electron.ipcRenderer.invoke('start-project', [project]);
          }}
        >
          <AiOutlinePlayCircle size="30px" />
        </button>
        <button
          type="button"
          className="settingsbutton flex-1 p-5 flex justify-center items-center"
        >
          <FiSettings size="30px" />
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
