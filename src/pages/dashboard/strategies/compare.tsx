import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompareStrategiesPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-bold text-3xl">Compare Strategies</h1>

			<Card>
				<CardHeader>
					<CardTitle>Strategy Comparison</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Strategy comparison will go here
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
