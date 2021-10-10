import { withNavigationWatcher } from './contexts/navigation';

const routes = [];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
