import { lazy } from "preact/compat";
import enviroments from "../config/client/environments.config.js";
import { render } from "../libs/client/preact";
import "@vigilio/sweet/sweet.min.css";
import "../assets/index.css";
import "vite/modulepreload-polyfill"; //https://vitejs.dev/guide/backend-integration

// render all jsx files
for (const [path, importFn] of Object.entries(
	import.meta.glob(
		[
			"./**/*.jsx",
			// "!./**/admin/**/*.tsx",
			"!./components/**/*.jsx",
		],
		{
			eager: false,
		},
	),
)) {
	render(
		path.slice(1),
		lazy(() =>
			enviroments.VITE_ENV === "production"
				? importFn().then((module) => ({
						default: module.default,
					}))
				: import(/* @vite-ignore */ path),
		),
	);
}
