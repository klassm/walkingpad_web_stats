import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";

const rootDomElement = document.getElementById("root");
if (rootDomElement) {
	const root = createRoot(rootDomElement);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}
