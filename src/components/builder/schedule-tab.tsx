"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2 } from "lucide-react"

interface SceneBlock {
  id: string
  sceneName: string
  time: string
  notes: string
}

export function ScheduleTab() {
  const [scenes, setScenes] = useState<SceneBlock[]>([
    {
      id: "1",
      sceneName: "",
      time: "",
      notes: ""
    }
  ])

  const addScene = () => {
    const newScene: SceneBlock = {
      id: Date.now().toString(),
      sceneName: "",
      time: "",
      notes: ""
    }
    setScenes([...scenes, newScene])
  }

  const removeScene = (id: string) => {
    setScenes(scenes.filter(scene => scene.id !== id))
  }

  const updateScene = (id: string, field: keyof SceneBlock, value: string) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, [field]: value } : scene
    ))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Schedule</CardTitle>
        <Button onClick={addScene} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Scene
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {scenes.map((scene, index) => (
            <AccordionItem key={scene.id} value={scene.id}>
              <AccordionTrigger>
                {scene.sceneName || `Scene ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Scene Name</Label>
                    <Input
                      placeholder="Enter scene name"
                      value={scene.sceneName}
                      onChange={(e) => updateScene(scene.id, 'sceneName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Estimated Time</Label>
                    <Input
                      type="time"
                      value={scene.time}
                      onChange={(e) => updateScene(scene.id, 'time', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Add scene notes..."
                      value={scene.notes}
                      onChange={(e) => updateScene(scene.id, 'notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  {scenes.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeScene(scene.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Scene
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}