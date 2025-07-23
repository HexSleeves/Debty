import { Outlet } from "@tanstack/react-router";

export function AuthLayout() {
	return (
		<div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
				<div className="relative z-20 flex items-center font-medium text-lg">
					<svg
						aria-label="Debty Logo"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 h-6 w-6"
					>
						<title>Debty Logo</title>
						<path d="M12 2L2 7l10 5 10-5-10-5z" />
						<path d="M2 17l10 5 10-5" />
						<path d="M2 12l10 5 10-5" />
					</svg>
					Debty
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							"Take control of your debt with smart strategies and clear
							insights."
						</p>
						<footer className="text-sm">— Debty Team</footer>
					</blockquote>
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
