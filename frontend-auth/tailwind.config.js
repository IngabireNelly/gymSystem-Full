export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        cream: "#EDE4D8",
        paper: "#F7F3EE",
        ink: "#111111",
        gold: {
          DEFAULT: "#A8875A",
          deep: "#7A5F38",
        },
        rust: {
          DEFAULT: "#9B3B2E",
          soft: "#F3E1DC",
        },
        sage: {
          DEFAULT: "#3F6B4A",
          soft: "#DDE7D9",
        },
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
};
