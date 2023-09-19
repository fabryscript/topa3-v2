import FloatingTerminalButton from '../components/FloatingTerminalButton';
import ProjectCard from '../components/ProjectCard';
import { INTERNAL_TOPA3_NEW_PROJECT_CARD } from '../utils/consts';
import useRetrieveProjects from '../utils/useRetrieveProjects';

function Dashboard() {
  const { projects } = useRetrieveProjects();
  return (
    <div className="relative text-white flex flex-col p-10 justify-center gap-10">
      <div>
        <h1 className="text-4xl font-semibold">Benvenuto nella Dashboard.</h1>
        <h2 className="text-2xl mt-2 font-semibold opacity-50">
          Ecco i tuoi progetti
        </h2>
      </div>
      <div className="flex flex-row items-center">
        {projects && (
          <div>
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        )}
        <ProjectCard
          key="__internal_newProjectCard"
          project={{
            content: '',
            name: INTERNAL_TOPA3_NEW_PROJECT_CARD,
            path: '',
          }}
        />
      </div>
      <FloatingTerminalButton />
    </div>
  );
}

export default Dashboard;
