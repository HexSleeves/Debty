import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DebtsPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-3xl">Your Debts</h1>
				<Link to="/dashboard/debts/new">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Debt
					</Button>
				</Link>
			</div>

			<Card>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="mb-4 text-muted-foreground">No debts added yet</p>
					<Link to="/dashboard/debts/new">
						<Button>Add Your First Debt</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
