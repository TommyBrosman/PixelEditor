import React from 'react';
import './App.css';
import { Grid } from './Grid';
import { store } from './store/Reducers';
import { Provider } from 'react-redux';

function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<header className="App-header">
					<Grid />
				</header>
			</div>
		</Provider>
	);
}

export default App;
