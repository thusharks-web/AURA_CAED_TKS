import Toolbar from '../components/layout/Toolbar';
import TopRibbon from '../components/layout/TopRibbon';
import StatusBar from '../components/layout/StatusBar';
import PropertiesPanel from '../components/layout/PropertiesPanel';
import DrawingCanvas from '../components/canvas/DrawingCanvas';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import './WorkbenchPage.css';

export default function WorkbenchPage() {
  useKeyboardShortcuts();

  return (
    <div className="workbench-page">
      <TopRibbon />
      <div className="workbench-body">
        <Toolbar />
        <DrawingCanvas />
        <PropertiesPanel />
      </div>
      <StatusBar />
    </div>
  );
}
