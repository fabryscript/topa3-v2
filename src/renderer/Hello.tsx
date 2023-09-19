/* eslint-disable no-console */
import WelcomeScreen from './pages/WelcomeScreen';
import Dashboard from './pages/Dashboard';
import useRetrieveProjects from './utils/useRetrieveProjects';

export default function Hello() {
  const { projects } = useRetrieveProjects();
  return projects?.length !== 0 ? <Dashboard /> : <WelcomeScreen />;
}
