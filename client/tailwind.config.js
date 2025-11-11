/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
      extend: {
        screens: {
          md2: "890px",
        },
        colors: {
        //   darkbg: "rgb(22,29,57)",
          darkbg: "rgb(31, 41, 55)",
        },
      },
    },
    plugins: [],
  };
  