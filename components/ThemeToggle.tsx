"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-full border-[3px] border-black dark:border-white bg-white dark:bg-black w-10 h-10 flex justify-center items-center hover:bg-primary-100 dark:hover:bg-black-100 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-black dark:text-white" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
