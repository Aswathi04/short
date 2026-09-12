import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F7F4EE",
          subtle: "#F1ECE1",
          hover: "#EAE4D6",
        },
        surface: {
          DEFAULT: "#F7F4EE",
          card: "#FFFFFF",
          subtle: "#FBF9F5",
          border: "#E5DFD3",
          borderStrong: "#D5CDC0",
          hover: "#F3EDE1",
        },
        ink: {
          DEFAULT: "#282420",
          primary: "#282420",
          secondary: "#5C554D",
          muted: "#887F73",
          faint: "#B5ADA2",
        },
        accent: {
          DEFAULT: "#A2482B",
          hover: "#87391F",
          light: "#FBF1ED",
          border: "#E9CEBF",
        },
        badge: {
          sage: {
            bg: "#EEF3ED",
            text: "#3A593D",
            border: "#D3DFD1",
          },
          ochre: {
            bg: "#FAF4E7",
            text: "#7B5F26",
            border: "#EFE2C2",
          },
          rose: {
            bg: "#F8EFEF",
            text: "#7C4C4C",
            border: "#EBD0D1",
          },
          sand: {
            bg: "#F2EDE3",
            text: "#685C4E",
            border: "#E3D9CB",
          },
        },
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "Cambria", "serif"],
        sans: ["'Source Sans 3'", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
