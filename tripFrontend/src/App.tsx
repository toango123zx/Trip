import { JSX, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import AppRoutes from './routes/routeConfig';

function App(): JSX.Element {
	const routing = useRoutes(AppRoutes);
	
	return (
		<Suspense fallback={<div>Loading...</div>}>
			{routing}
		</Suspense>
	);
}

export default App;
