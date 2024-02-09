import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { getWorkspaceFolderName } from '../utils';

function UploadBox() {
  const [filesInfo, setFilesInfo] = useState<File>();
  const [canDisplayNextStep, setCanDisplayNextStep] = useState(false);
  const [initialAnimationTrigger, setInitialAnimationTrigger] = useState(false);
  const [isFileInvalid, setIsFileInvalid] = useState(false);
  useEffect(() => setInitialAnimationTrigger(true), []);
  return (
    <div className="flex flex-col">
      {!filesInfo && (
        <div
          className={`${
            initialAnimationTrigger ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-1000 flex flex-col gap-5 px-10`}
        >
          <label htmlFor="file-upload">
            <div className="flex flex-col gap-2 justify-center items-center min-h-[200px] px-10 border-4 rounded-2xl border-dashed opacity-60 hover:opacity-80 transition-opacity duration-200 ease-in-out">
              <Upload className="w-11 h-auto" />
              <p className="whitespace-nowrap">
                Carica file <code>_topa3</code>
              </p>
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
                  setCanDisplayNextStep(true);
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
        <div
          className={`${
            canDisplayNextStep ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500 flex flex-col justify-center items-center gap-5`}
        >
          <p className="text-lg opacity-50">Stai per importare il progetto</p>
          <code>{getWorkspaceFolderName(filesInfo!.path)}</code>
          <p className="text-lg opacity-50">Vuoi confermare?</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center py-2 px-4 bg-blue-200 rounded-2xl text-neutral-800"
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
            </button>
            <button
              type="button"
              className="inline-flex items-center py-2 px-4 border-blue-200 border rounded-2xl text-neutral-200"
              onClick={() => setFilesInfo(undefined)}
            >
              <p>No, cancella</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadBox;
