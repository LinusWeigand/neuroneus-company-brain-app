import { OrakisMark } from './OrakisMark';

/** Full-height holding state. Used while the session resolves, while a route
 *  chunk downloads, and while the workspace loads. */
export function Splash() {
  return (
    <div className="flex h-full items-center justify-center bg-app-bg">
      <OrakisMark size={28} className="animate-spinMark text-app-muted" />
    </div>
  );
}
