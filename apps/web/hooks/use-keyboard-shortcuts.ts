import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onExport?: () => void;
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onSave,
  onExport,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      const isShift = event.shiftKey;

      // Undo: Mod + Z
      if (isMod && !isShift && event.key.toLowerCase() === "z") {
        event.preventDefault();
        onUndo?.();
      }

      // Redo: Mod + Shift + Z OR Mod + Y
      if (
        (isMod && isShift && event.key.toLowerCase() === "z") ||
        (isMod && event.key.toLowerCase() === "y")
      ) {
        event.preventDefault();
        onRedo?.();
      }

      // Save: Mod + S
      if (isMod && event.key.toLowerCase() === "s") {
        event.preventDefault();
        onSave?.();
      }

      // Export: Mod + E
      if (isMod && event.key.toLowerCase() === "e") {
        event.preventDefault();
        onExport?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUndo, onRedo, onSave, onExport]);
}
