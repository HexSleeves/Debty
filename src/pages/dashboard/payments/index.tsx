import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-bold text-3xl">Payment History</h1>

			<Card>
				<CardHeader>
					<CardTitle>Recent Payments</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Payment history will go here</p>
				</CardContent>
			</Card>
		</div>
	);
}
