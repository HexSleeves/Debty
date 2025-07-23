import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { AuthLayout } from "../layouts/auth-layout";
import { DashboardLayout } from "../layouts/dashboard-layout";
import { RootLayout } from "../layouts/root-layout";

// Root route
const rootRoute = createRootRoute({
	component: RootLayout,
});

// Landing page
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => import("../pages/index").then((m) => m.default),
});

// Auth routes
const authRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/auth",
	component: AuthLayout,
});

const signInRoute = createRoute({
	getParentRoute: () => authRoute,
	path: "/sign-in",
	component: () => import("../pages/auth/sign-in").then((m) => m.default),
});

const signUpRoute = createRoute({
	getParentRoute: () => authRoute,
	path: "/sign-up",
	component: () => import("../pages/auth/sign-up").then((m) => m.default),
});

// Dashboard routes
const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/dashboard",
	component: DashboardLayout,
});

const dashboardIndexRoute = createRoute({
	getParentRoute: () => dashboardRoute,
	path: "/",
	component: () => import("../pages/dashboard/index").then((m) => m.default),
});

// Debt routes
const debtsRoute = createRoute({
	getParentRoute: () => dashboardRoute,
	path: "/debts",
	component: () =>
		import("../pages/dashboard/debts/index").then((m) => m.default),
});

const newDebtRoute = createRoute({
	getParentRoute: () => dashboardRoute,
	path: "/debts/new",
	component: () =>
		import("../pages/dashboard/debts/new").then((m) => m.default),
});

const debtDetailRoute = createRoute({
	getParentRoute: () => dashboardRoute,
	path: "/debts/$id",
	component: () =>
		import("../pages/dashboard/debts/[id]").then((m) => m.default),
});

// Strategy routes
const strategiesRoute = createRoute({
	getParentRoute: () => dashboardRoute,
	path: "/strategies",
	component: () =>
		import("../pages/dashboard/strategies/index").then((m) => m.default),
});

const compareStrategiesRoute = createRoute({
	getParentRoute: () => dashboardRoute,
	path: "/strategies/compare",
	component: () =>
		import("../pages/dashboard/strategies/compare").then((m) => m.default),
});

// Payment routes
const paymentsRoute = createRoute({
	getParentRoute: () => dashboardRoute,
	path: "/payments",
	component: () =>
		import("../pages/dashboard/payments/index").then((m) => m.default),
});

// Settings routes
const settingsRoute = createRoute({
	getParentRoute: () => dashboardRoute,
	path: "/settings",
	component: () =>
		import("../pages/dashboard/settings/index").then((m) => m.default),
});

// Create the route tree
const routeTree = rootRoute.addChildren([
	indexRoute,
	authRoute.addChildren([signInRoute, signUpRoute]),
	dashboardRoute.addChildren([
		dashboardIndexRoute,
		debtsRoute,
		newDebtRoute,
		debtDetailRoute,
		strategiesRoute,
		compareStrategiesRoute,
		paymentsRoute,
		settingsRoute,
	]),
]);

// Create the router
export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
