import * as React from "react";
import { Provider } from "react-redux";
import "./App.css";
import Grid from "./Grid";
import { setupStore } from "./store/Store";

function App() {
	return (
		<Provider store={setupStore()}>
			<div className="App">
				<header className="App-header">
					<Grid />
				</header>
			</div>
		</Provider>
	);
}

export default App;
