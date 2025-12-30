/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Renaming to 'grocery' to fit your brand hub
        grocery: {
          primary: "#0aad0a",    // The "FreshCart" Green
          primaryHover: "#099609",
          
          // Backgrounds
          bg: "#f0f3f2",         // Soft light gray/blue background
          card: "#ffffff",       // Pure white for cards
          
          // Text colors for high readability
          heading: "#21313c",    // Dark navy for titles
          body: "#5c6c75",       // Slate gray for paragraphs
          
          // Status colors (Very important for Admin!)
          success: "#dcfce7",    // Light green bg
          successText: "#166534", // Dark green text
          
          warning: "#fef9c3",    // Light yellow bg
          warningText: "#854d0e", // Dark yellow text
          
          danger: "#fee2e2",     // Light red bg
          dangerText: "#991b1b",  // Dark red text
          
          info: "#e0f2fe",       // Light blue bg
          infoText: "#075985",   // Dark blue text
        },
      },
      borderRadius: {
        'xl2': "12px",
        'xl3': "16px",
        'xl4': "24px",
      },
      boxShadow: {
        // This creates that "Floating" look from your reference
        'glass': "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        'card': "0 2px 4px rgba(0,0,0,0.02), 0 1px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};