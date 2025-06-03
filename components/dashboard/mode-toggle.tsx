"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ModeToggleProps {
  isCustomMode: boolean
  onModeChange: (isCustom: boolean) => void
}

export function ModeToggle({ isCustomMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] p-4 mb-6">
      <div className="flex flex-col space-y-4">

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

         
        </div>
      </div>
    </div>
  )
}
