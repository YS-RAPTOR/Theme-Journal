/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                virgil: ["virgil", "sans-serif"],
            },
            colors: {
                primaryLight: "#44170D",
                primaryDark: "#33110A",
                primaryBlack: "#1E1B18",
                primaryWhite: "#FFFAFF",
            },
        },
    },
    plugins: [],
};
