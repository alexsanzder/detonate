import { useState, useEffect } from 'react';

export const cachedScripts: Map<string, string> = new Map();

export const useScript = (src: string, name: string): boolean[] => {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    // If cachedScripts array already includes src that means another instance ...
    // ... of this hook already loaded this script, so no need to load again.
    if (cachedScripts.get(name)) {
      setState({
        loaded: true,
        error: false,
      });
    } else {
      cachedScripts.set(name, src);

      // Create script
      const script = document.createElement('script');
      script.src = src;
      script.async = false;

      // Script event listener callbacks for load and error
      const onScriptLoad = (): void => {
        setState({
          loaded: true,
          error: false,
        });
      };

      const onScriptError = (): void => {
        // Remove from cachedScripts we can try loading again
        const exist = cachedScripts.get(name);
        if (exist) {
          cachedScripts.delete(name);
        }
        script.remove();

        setState({
          loaded: true,
          error: true,
        });
      };

      script.addEventListener('load', onScriptLoad);
      script.addEventListener('error', onScriptError);

      document.body.appendChild(script);

      return (): void => {
        script.removeEventListener('load', onScriptLoad);
        script.removeEventListener('error', onScriptError);
      };
    }
  }, [name, src]); // Only re-run effect if script src and name changes

  return [state.loaded, state.error];
};
