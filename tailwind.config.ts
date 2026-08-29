import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#12261d", moss: "#3d7056", cream: "#f7f7f2", lime: "#d9ff76" } } }, plugins: [] } satisfies Config;
