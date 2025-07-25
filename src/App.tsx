import { SignInButton, UserButton } from "@clerk/clerk-react";
import {
	Authenticated,
	Unauthenticated,
	useMutation,
	useQuery,
} from "convex/react";
import { Button } from "@/components/ui/button";
import { api } from "../convex/_generated/api";

export default function App() {
	return (
		<main className="container flex max-w-2xl flex-col gap-8">
			<h1 className="my-8 text-center font-extrabold text-4xl">
				Convex + React (Vite) + Clerk Auth
			</h1>
			<Authenticated>
				<SignedIn />
			</Authenticated>
			<Unauthenticated>
				<div className="flex justify-center">
					<SignInButton mode="modal">
						<Button>Sign in</Button>
					</SignInButton>
				</div>
			</Unauthenticated>
		</main>
	);
}

function SignedIn() {
	const { numbers, viewer } =
		useQuery(api.myFunctions.listNumbers, {
			count: 10,
		}) ?? {};
	const addNumber = useMutation(api.myFunctions.addNumber);

	return (
		<>
			<p>Welcome {viewer}!</p>
			<p className="flex items-center gap-4">
				This is you:
				<UserButton afterSignOutUrl="#" />
			</p>
			<p>
				Click the button below and open this page in another window - this data
				is persisted in the Convex cloud database!
			</p>
			<p>
				<Button
					onClick={() => {
						void addNumber({ value: Math.floor(Math.random() * 10) });
					}}
				>
					Add a random number
				</Button>
			</p>
			<p>
				Numbers:{" "}
				{numbers?.length === 0
					? "Click the button!"
					: (numbers?.join(", ") ?? "...")}
			</p>
			<p>
				Edit{" "}
				<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm">
					convex/myFunctions.ts
				</code>{" "}
				to change your backend
			</p>
			<p>
				Edit{" "}
				<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm">
					src/App.tsx
				</code>{" "}
				to change your frontend
			</p>
			<p>
				Check out{" "}
				<a
					className="font-medium text-primary underline underline-offset-4"
					target="_blank"
					href="https://docs.convex.dev/home"
					rel="noopener"
				>
					Convex docs
				</a>
			</p>
		</>
	);
}
