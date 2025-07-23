import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebtDetailPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-bold text-3xl">Debt Details</h1>

			<Card>
				<CardHeader>
					<CardTitle>Debt Information</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Debt details will go here</p>
				</CardContent>
			</Card>
		</div>
	);
}
