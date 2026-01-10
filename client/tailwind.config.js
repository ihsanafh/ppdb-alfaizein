/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#34C759",
        "background-light": "#F5F5F5",
        "background-dark": "#1A202C", // Sesuai HTML
        
        // --- WARNA BARU DARI HTML ---
        "mint-green-light": "#E6FFE6",
        "mint-green-dark": "#2D3748",
        "card-light": "#FFFFFF",
        "card-dark": "#2D3748",
        
        "text-light": "#1F2937", // Abu gelap
        "text-dark": "#E2E8F0",  // Abu terang
        "text-muted-light": "#6B7280",
        "text-muted-dark": "#A0AEC0",
        
        "border-light": "#E5E7EB",
        "border-dark": "#4A5568",
        danger: "#FF3B30",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"], // Font utama dari HTML
        sans: ["Poppins", "sans-serif"],
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.5s ease-out',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}