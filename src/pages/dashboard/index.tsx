import { Calendar, CreditCard, DollarSign, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-bold text-3xl">Dashboard</h1>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Total Debt</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$0.00</div>
						<p className="text-muted-foreground text-xs">No debts added yet</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Monthly Payment
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$0.00</div>
						<p className="text-muted-foreground text-xs">Minimum payments</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Interest Saved
						</CardTitle>
						<TrendingDown className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$0.00</div>
						<p className="text-muted-foreground text-xs">
							With optimized strategy
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Debt-Free Date
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">--</div>
						<p className="text-muted-foreground text-xs">
							Add debts to calculate
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Getting Started */}
			<Card>
				<CardHeader>
					<CardTitle>Welcome to Debty!</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-4 text-muted-foreground">
						Get started by adding your first debt to see your personalized debt
						payoff strategy.
					</p>
					<div className="space-y-2">
						<p className="text-sm">Next steps:</p>
						<ul className="ml-4 space-y-1 text-muted-foreground text-sm">
							<li>• Add your debts in the Debts section</li>
							<li>• Choose a payment strategy</li>
							<li>• Track your progress over time</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
