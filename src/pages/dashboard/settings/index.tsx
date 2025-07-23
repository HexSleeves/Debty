import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-bold text-3xl">Settings</h1>

			<Card>
				<CardHeader>
					<CardTitle>User Preferences</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Settings will go here</p>
				</CardContent>
			</Card>
		</div>
	);
}
