import MenuBar from '../components/layout/MenuBar';
import CommandManager from '../components/layout/CommandManager';
import FeatureManager from '../components/layout/FeatureManager';
import StatusBar from '../components/layout/StatusBar';
import DrawingCanvas from '../components/canvas/DrawingCanvas';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import './WorkbenchPage.css';

export default function WorkbenchPage() {
  useKeyboardShortcuts();

  return (
    <div className="sw-workbench-page">
      <MenuBar />
      <CommandManager />
      <div className="sw-workbench-body">
        <FeatureManager />
        <div className="sw-viewport">
          <DrawingCanvas />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
