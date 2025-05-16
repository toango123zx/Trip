import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import '@ant-design/v5-patch-for-react-19';
import './index.css';

import App from './App.tsx';
import { _reduxStore } from './store/reduxStore.ts';

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<Provider store={_reduxStore}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	// </StrictMode>,
);
