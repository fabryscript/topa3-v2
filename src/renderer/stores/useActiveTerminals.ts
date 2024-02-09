import { create } from 'zustand';

interface Terminal {
  name: string;
  out: string[];
}

interface TerminalState {
  terminals: Terminal[];
  addOutput: (name: string, output: string) => void;
  removeTerminal: (name: string) => void;
}

const useActiveTerminals = create<TerminalState>((set) => ({
  terminals: [],
  addOutput(name, output) {
    set((state) => {
      // Find the index of the terminal with the specified name
      const terminalIndex = state.terminals.findIndex(
        (terminal) => terminal.name === name,
      );
      // If the terminal exists, update its 'out' property with the new output
      if (terminalIndex !== -1) {
        const updatedTerminals = [...state.terminals];
        updatedTerminals[terminalIndex] = {
          ...updatedTerminals[terminalIndex],
          out: [...updatedTerminals[terminalIndex].out, output],
        };
        return { terminals: updatedTerminals };
      }
      // If the terminal does not exist, create a new terminal with the given name and output
      const newTerminal: Terminal = { name, out: [output] };
      return { terminals: [...state.terminals, newTerminal] };
    });
  },
  removeTerminal(name) {
    set((state) => ({
      terminals: state.terminals.filter((terminal) => terminal.name !== name),
    }));
  },
}));

export default useActiveTerminals;
