import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Page from "./app/page";
import RootLayout from "./app/layout";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RootLayout>
			<Page />
		</RootLayout>
	</React.StrictMode>,
);
