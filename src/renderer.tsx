import { jsxRenderer } from "hono/jsx-renderer";
import { Link, ViteClient } from "vite-ssr-components/hono";

export const renderer = jsxRenderer(({ children }) => {
	return (
		<html lang="en">
			<head>
				<ViteClient />
				<Link href="/src/style.css" rel="stylesheet" />
			</head>
			<body>
				<h1 class="text-3xl font-bold underline text-blue-300">Hello world!</h1>
				{children}
			</body>
		</html>
	);
});
