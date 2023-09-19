import { AiOutlinePlayCircle } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { ProjectFile } from '../types';
import { INTERNAL_TOPA3_NEW_PROJECT_CARD } from '../utils/consts';
import UploadBox from './UploadBox';

function ProjectCard({ project }: { project: ProjectFile }) {
  if (project.name === INTERNAL_TOPA3_NEW_PROJECT_CARD) {
    return <UploadBox />;
  }
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
