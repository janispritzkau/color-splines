import { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: "class",
  content: ["./**/*.html", "./src/**/*.{ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
      },
    },
  },
} satisfies Config;
