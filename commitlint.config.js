export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat", // New feature
				"fix", // Bug fix
				"docs", // Documentation
				"style", // Formatting, missing semi colons, etc
				"refactor", // Code change that neither fixes a bug nor adds a feature
				"test", // Adding missing tests
				"chore", // Maintain code
				"perf", // Performance improvements
				"ci", // CI/CD changes
				"build", // Build system changes
				"revert", // Revert previous commit
			],
		],
	},
};
