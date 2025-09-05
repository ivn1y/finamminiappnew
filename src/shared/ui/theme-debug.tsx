"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

export function ThemeDebug() {
  const { theme, resolvedTheme } = useTheme()
  const [cssVars, setCssVars] = useState<Record<string, string>>({})

  useEffect(() => {
    const getCssVar = (name: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    }

    const vars = {
      '--background': getCssVar('--background'),
      '--foreground': getCssVar('--foreground'),
      '--card': getCssVar('--card'),
      '--card-foreground': getCssVar('--card-foreground'),
      '--secondary': getCssVar('--secondary'),
      '--secondary-foreground': getCssVar('--secondary-foreground'),
      '--muted': getCssVar('--muted'),
      '--muted-foreground': getCssVar('--muted-foreground'),
      '--accent': getCssVar('--accent'),
      '--accent-foreground': getCssVar('--accent-foreground'),
      '--border': getCssVar('--border'),
      '--input': getCssVar('--input'),
    }

    setCssVars(vars)
  }, [theme, resolvedTheme])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Отладка темы</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <strong>Текущая тема:</strong> {theme}
        </div>
        <div className="text-sm">
          <strong>Разрешенная тема:</strong> {resolvedTheme}
        </div>
        <div className="text-sm">
          <strong>HTML класс:</strong> {document.documentElement.className}
        </div>
        <div className="border-t pt-2">
          <strong className="text-sm">CSS переменные:</strong>
          <div className="mt-2 space-y-1">
            {Object.entries(cssVars).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="font-mono">{key}:</span> {value}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 