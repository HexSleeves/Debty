import { SignUp } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

export default function SignUpPage() {
	return (
		<div className="flex flex-col space-y-2 text-center">
			<h1 className="font-semibold text-2xl tracking-tight">
				Create an account
			</h1>
			<p className="text-muted-foreground text-sm">
				Start your journey to debt freedom
			</p>
			<div className="grid gap-6">
				<SignUp
					appearance={{
						elements: {
							formButtonPrimary: "bg-primary hover:bg-primary/90",
							footerActionLink: "text-primary hover:text-primary/90",
						},
					}}
					redirectUrl="/dashboard"
				/>
				<p className="px-8 text-center text-muted-foreground text-sm">
					Already have an account?{" "}
					<Link
						to="/auth/sign-in"
						className="underline underline-offset-4 hover:text-primary"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
