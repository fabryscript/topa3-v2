import { Fragment, useEffect } from 'react';
import stripAnsi from 'strip-ansi';
import { Tab } from '@headlessui/react';
import ProjectCard from '../components/ProjectCard';
import useRetrieveProjects from '../utils/useRetrieveProjects';
import UploadBox from '../components/UploadBox';
import Button from '../components/button/Button';
import useActiveTerminals from '../stores/useActiveTerminals';

function Dashboard() {
  const { projects } = useRetrieveProjects();
  const { terminals, addOutput } = useActiveTerminals();

  useEffect(() => {
    window.electron.ipcRenderer.on('shell-result', (e: any) => {
      const name = e.name as string;
      const result = stripAnsi(e.out) as string;
      addOutput(name, result);
    });
  }, [addOutput]);

  return (
    <div className="relative text-white flex flex-col p-10 justify-center gap-10">
      <div>
        <h1 className="text-4xl font-semibold">Benvenuto nella Dashboard.</h1>
        <h2 className="text-2xl mt-2 font-semibold opacity-50">
          Ecco i tuoi progetti
        </h2>
      </div>
      <Tab.Group>
        <Tab.List className="flex items-center gap-2">
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button variant={selected ? 'primary' : 'ghost'}>Progetti</Button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button
                isDisabled={terminals.length === 0}
                variant={selected ? 'primary' : 'ghost'}
              >
                Terminale &#40;{terminals.length}&#41;
              </Button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-4 gap-3 min-h-[200px]">
              {projects &&
                projects.map((project) => (
                  <ProjectCard key={project.name} project={project} />
                ))}
              <UploadBox />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            {terminals.map((terminal) => (
              <div className="flex flex-col gap-1">
                <h6>{terminal.name}</h6>
                <div className="flex flex-col rounded-xl border border-neutral-500 px-4 py-2">
                  {terminal.out.map((line, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={line + i} className="text-neutral-500">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default Dashboard;
