import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategiesPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-bold text-3xl">Payment Strategies</h1>

			<Card>
				<CardHeader>
					<CardTitle>Choose Your Strategy</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Strategy selection will go here
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
