/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
        animation: {
          float: "float 3s ease-in-out infinite", // Custom animation timing and duration
        },
        keyframes: {
          float: {
            "0%": {
              transform: "translateY(0)",
            },
            "50%": {
              transform: "translateY(-10px)",
            },
            "100%": {
              transform: "translateY(0)",
            },
          },
        },
      },
    },
    plugins: [],
  }