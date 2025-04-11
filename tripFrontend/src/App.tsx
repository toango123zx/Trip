import { JSX } from 'react';
import { useRoutes } from 'react-router-dom';

import AppRoutes from './routes/routeConfig';

function App(): JSX.Element {
	const routing = useRoutes(AppRoutes);
	return routing ?? <></>;
}
export default App;
