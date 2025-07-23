import { SignIn } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

export default function SignInPage() {
	return (
		<div className="flex flex-col space-y-2 text-center">
			<h1 className="font-semibold text-2xl tracking-tight">Welcome back</h1>
			<p className="text-muted-foreground text-sm">
				Sign in to your account to continue
			</p>
			<div className="grid gap-6">
				<SignIn
					appearance={{
						elements: {
							formButtonPrimary: "bg-primary hover:bg-primary/90",
							footerActionLink: "text-primary hover:text-primary/90",
						},
					}}
					redirectUrl="/dashboard"
				/>
				<p className="px-8 text-center text-muted-foreground text-sm">
					Don't have an account?{" "}
					<Link
						to="/auth/sign-up"
						className="underline underline-offset-4 hover:text-primary"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
