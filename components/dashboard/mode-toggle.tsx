"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ModeToggleProps {
  isCustomMode: boolean
  onModeChange: (isCustom: boolean) => void
}

export function ModeToggle({ isCustomMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold">Creation Mode</h2>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mode-toggle" className="text-base font-medium">
                {isCustomMode ? "Custom Prompt Mode" : "Structured Mode"}
              </Label>
              <p className="text-sm text-gray-500">
                {isCustomMode
                  ? "Create anything with your own description"
                  : "Create professional cutouts with guided options"}
              </p>
            </div>
            <Switch
              id="mode-toggle"
              checked={isCustomMode}
              onCheckedChange={onModeChange}
              className="data-[state=checked]:bg-teal-500"
            />
          </div>

          <div className={`p-3 rounded-lg ${isCustomMode ? "bg-teal-50" : "bg-yellow-50"} text-sm`}>
            {isCustomMode ? (
              <p>
                <span className="font-semibold">Custom Mode:</span> Describe anything you want to create - animals,
                objects, scenes, or characters. No image upload needed!
              </p>
            ) : (
              <p>
                <span className="font-semibold">Structured Mode:</span> Perfect for creating professional cutouts for
                marketing, websites, and presentations.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
