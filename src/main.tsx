/** biome-ignore-all lint/style/noNonNullAssertion: needed for Vite */
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { RouterProvider } from "@tanstack/react-router";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.css";
import { router } from "./router";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<ClerkProvider
				publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
			>
				<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
					<RouterProvider router={router} />
				</ConvexProviderWithClerk>
			</ClerkProvider>
		</ErrorBoundary>
	</React.StrictMode>,
);
