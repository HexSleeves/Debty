import { UserButton } from "@clerk/clerk-react";
import { Link, Outlet } from "@tanstack/react-router";
import {
	CreditCard,
	History,
	LayoutDashboard,
	Settings,
	TrendingUp,
} from "lucide-react";

export function DashboardLayout() {
	const navigation = [
		{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
		{ name: "Debts", href: "/dashboard/debts", icon: CreditCard },
		{ name: "Strategies", href: "/dashboard/strategies", icon: TrendingUp },
		{ name: "Payments", href: "/dashboard/payments", icon: History },
		{ name: "Settings", href: "/dashboard/settings", icon: Settings },
	];

	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
			{/* Sidebar */}
			<div className="hidden md:flex md:w-64 md:flex-col">
				<div className="flex flex-grow flex-col overflow-y-auto bg-white pt-5 dark:bg-gray-800">
					<div className="flex flex-shrink-0 items-center px-4">
						<h1 className="font-bold text-gray-900 text-xl dark:text-white">
							Debty
						</h1>
					</div>
					<div className="mt-5 flex flex-grow flex-col">
						<nav className="flex-1 space-y-1 px-2 pb-4">
							{navigation.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									className="group flex items-center rounded-md px-2 py-2 font-medium text-gray-600 text-sm hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
								>
									<item.icon className="mr-3 h-5 w-5" />
									{item.name}
								</Link>
							))}
						</nav>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="flex w-0 flex-1 flex-col overflow-hidden">
				{/* Top bar */}
				<div className="relative z-10 flex h-16 flex-shrink-0 bg-white shadow dark:bg-gray-800">
					<div className="flex flex-1 justify-between px-4">
						<div className="flex flex-1">
							{/* Mobile menu button would go here */}
						</div>
						<div className="ml-4 flex items-center md:ml-6">
							<UserButton
								appearance={{
									elements: {
										avatarBox: "h-8 w-8",
									},
								}}
							/>
						</div>
					</div>
				</div>

				{/* Main content area */}
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
