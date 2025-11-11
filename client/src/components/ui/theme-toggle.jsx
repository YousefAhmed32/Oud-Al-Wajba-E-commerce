import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    document.documentElement.classList.toggle("light", savedTheme === "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative hover:bg-gold-950/10 transition-all duration-300 group"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gold-950 dark:text-gold-950" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gold-950" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
