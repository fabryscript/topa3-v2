import { MoreHorizontal, Play, Trash } from 'lucide-react';
import classNames from 'classnames';
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { ProjectFile } from '../types';
import useDisclosure from '../utils/useDisclosure';

function ProjectCard({ project }: { project: ProjectFile }) {
  const [isHovered, setIsHovered] = useState(false);
  const { onOpen } = useDisclosure();
  return (
    <div
      key={project.name}
      className="bg-neutral-700 justify-between rounded-2xl flex flex-col p-4 items-center"
    >
      <div className="flex items-center w-full justify-between">
        <div className="flex flex-col">
          <h5 className="text-xl font-bold">{project.name}</h5>
          <p className="text-sm opacity-70">JavaScript</p>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center justify-center rounded-xl opacity-50 hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-neutral-400 rounded-md bg-neutral-500 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${
                        active ? 'bg-blue-400 text-white' : 'text-gray-100'
                      } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm transition-colors duration-200 ease-in-out`}
                    >
                      <Trash className="h-5 w-5" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1 text-center">
                <Menu.Item>
                  <small className="text-xs text-neutral-300">
                    Ultima apertura: {format(new Date(), 'dd/MM/yyyy hh:mm:ss')}
                  </small>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={classNames(
          'w-[50%] inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-200 px-4 py-2 text-neutral-800',
        )}
        onClick={() =>
          window.electron.ipcRenderer.invoke('start-project', [project])
        }
      >
        <Play
          className={classNames('transition-all duration-200 ease-in-out', {
            'w-[18px] opacity-100': isHovered,
            'w-0 opacity-0': !isHovered,
          })}
          size="18"
        />
        <span>Avvia</span>
      </button>
    </div>
  );
}

export default ProjectCard;
