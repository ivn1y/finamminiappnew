"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"

export function ThemeTest() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Тест цветов темы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="bg-background text-foreground p-2 rounded border">
                background + foreground
              </div>
              <div className="bg-card text-card-foreground p-2 rounded border">
                card + card-foreground
              </div>
              <div className="bg-secondary text-secondary-foreground p-2 rounded border">
                secondary + secondary-foreground
              </div>
              <div className="bg-muted text-muted-foreground p-2 rounded border">
                muted + muted-foreground
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-accent text-accent-foreground p-2 rounded border">
                accent + accent-foreground
              </div>
              <div className="bg-primary text-primary-foreground p-2 rounded border">
                primary + primary-foreground
              </div>
              <div className="bg-destructive text-destructive-foreground p-2 rounded border">
                destructive + destructive-foreground
              </div>
              <div className="border border-border p-2 rounded">
                border
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          
          <div className="flex gap-2">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 