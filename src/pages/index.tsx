import { Link } from "@tanstack/react-router";
import { Calculator, CreditCard, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Hero Section */}
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Take Control of Your Debt
								</h1>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
									Smart strategies, clear insights, and personalized plans to
									help you become debt-free faster.
								</p>
							</div>
							<div className="space-x-4">
								<Link to="/auth/sign-up">
									<Button size="lg">Get Started</Button>
								</Link>
								<Link to="/auth/sign-in">
									<Button variant="outline" size="lg">
										Sign In
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-900">
					<div className="container px-4 md:px-6">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							<Card>
								<CardHeader>
									<CreditCard className="h-10 w-10 text-blue-600" />
									<CardTitle>Track All Debts</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-500 dark:text-gray-400">
										Centralize all your debts in one place. Track balances,
										interest rates, and payment schedules.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<Calculator className="h-10 w-10 text-green-600" />
									<CardTitle>Smart Strategies</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-500 dark:text-gray-400">
										Choose between Avalanche and Snowball methods, or create
										custom payment plans.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<TrendingUp className="h-10 w-10 text-purple-600" />
									<CardTitle>Visual Progress</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-500 dark:text-gray-400">
										See your progress with charts and projections. Stay
										motivated with clear milestones.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
				<p className="text-gray-500 text-xs dark:text-gray-400">
					© 2024 Debty. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
