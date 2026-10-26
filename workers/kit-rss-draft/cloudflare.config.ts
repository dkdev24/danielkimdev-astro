import { bindings, defineConfig, triggers } from "cf/config";

export default defineConfig({
	worker: {
		name: "kit-rss-draft",
		compatibilityDate: "2026-06-26",
		entrypoint: "src/index.js",
		triggers: [
			triggers.scheduled({
				schedule: "0 * * * *",
			}),
		],
		env: {
			FEEDS: bindings.text("https://danielkimdev.com/rss.xml,https://danielkimdev.com/ko/rss.xml"),
			DEFAULT_THUMB: bindings.text("https://danielkimdev.com/og-default.png"),
			SEEN: bindings.kv({
				id: "6926899c5a4441cba7082fa4cf5b42a0",
			}),
		},
	},
});
