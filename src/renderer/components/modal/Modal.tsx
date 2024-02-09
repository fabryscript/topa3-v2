import { Transition, Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment, PropsWithChildren } from 'react';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // eslint-disable-next-line react/require-default-props
  description?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: PropsWithChildren<IModalProps>) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-600 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="flex justify-between items-center text-neutral-100">
                  <h3 className="text-lg font-medium leading-6">{title}</h3>
                  <button type="button" onClick={onClose}>
                    <X className="w-5 h-auto" />
                  </button>
                </Dialog.Title>
                <div className="mt-2">
                  {description && (
                    <p className="text-sm text-neutral-300">{description}</p>
                  )}
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
