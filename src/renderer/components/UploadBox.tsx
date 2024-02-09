import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import classNames from 'classnames';
import { getWorkspaceFolderName } from '../utils';
import Button from './button/Button';

function UploadBox() {
  const [filesInfo, setFilesInfo] = useState<File>();
  const [initialAnimationTrigger, setInitialAnimationTrigger] = useState(false);
  const [isFileInvalid, setIsFileInvalid] = useState(false);
  useEffect(() => setInitialAnimationTrigger(true), []);

  return (
    <>
      {!filesInfo && (
        <div
          className={classNames(
            `transition-translate duration-1000 flex flex-col gap-5 px-10`,
            {
              'translate-x-0': initialAnimationTrigger,
              'translate-x-10': !initialAnimationTrigger,
            },
          )}
        >
          <label htmlFor="file-upload">
            <div className="flex flex-col gap-2 justify-center items-center min-h-[200px] px-10 border-4 rounded-2xl border-dashed hover:cursor-pointer">
              <Upload className="w-11 h-auto" />
              <span className="whitespace-nowrap">
                Carica file <code>_topa3</code>
              </span>
            </div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => {
                const { files } = e.target;
                if (files?.length === 0) return;
                if (files) {
                  if (files[0].name !== '_topa3') {
                    setIsFileInvalid(true);
                    return;
                  }
                  setFilesInfo(files[0]);
                }
              }}
            />
          </label>
          {isFileInvalid && (
            <div className="bg-red-500 p-4 rounded-xl flex flex-col text-center">
              <p>
                Errore: il file importato non è <code>&quot;_topa3&quot;.</code>
              </p>
              <p>Riprova.</p>
            </div>
          )}
        </div>
      )}
      {filesInfo && (
        <div className="flex flex-col justify-center items-center gap-5 hover:cursor-pointer">
          <p className="text-lg opacity-50">Stai per importare il progetto</p>
          <code>{getWorkspaceFolderName(filesInfo!.path)}</code>
          <p className="text-lg opacity-50">Vuoi confermare?</p>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={async () => {
                window.electron.ipcRenderer
                  .invoke('new-project', [
                    JSON.stringify({
                      path: filesInfo.path,
                      content: await filesInfo.text(),
                      name: getWorkspaceFolderName(filesInfo.path),
                    }),
                  ])
                  .then((res) => {
                    if (res === 'ok') {
                      return window.location.reload();
                    }
                    return null;
                  })
                  .catch((e) => {
                    throw new Error(e.message);
                  });
              }}
            >
              <p>Sì, confermo</p>
            </Button>
            <Button variant="secondary" onClick={() => setFilesInfo(undefined)}>
              <p>No, cancella</p>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadBox;
