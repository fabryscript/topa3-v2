import { BsTerminal } from 'react-icons/bs';

function FloatingTerminalButton() {
  return (
    <div>
      <button
        type="button"
        className="fixed flex flex-col items-center justify-center"
      >
        <div className="flex opacity-30 hover:opacity-60 active:opacity-100 hover:scale-105 active:scale-95 transition-all duration-500 flex-row items-center justify-center gap-2 border-2 border-[#222] px-8 py-2 rounded-2xl">
          <BsTerminal />
          <p>Mostra Terminale</p>
        </div>
      </button>
    </div>
  );
}

export default FloatingTerminalButton;
