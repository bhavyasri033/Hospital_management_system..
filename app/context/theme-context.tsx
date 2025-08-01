"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "light" | "dark" | "auto"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get theme from localStorage or default to light
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme || "light"
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Save theme to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme)
    }

    // Apply theme to document
    const root = document.documentElement
    const isDarkMode = theme === "dark" || (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    
    setIsDark(isDarkMode)
    
    if (isDarkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme, mounted])

  // Listen for system theme changes when auto is selected
  useEffect(() => {
    if (!mounted || theme !== "auto") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const isDarkMode = mediaQuery.matches
      setIsDark(isDarkMode)
      const root = document.documentElement
      if (isDarkMode) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
} 