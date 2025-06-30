//
// IntentSelector.tsx
// anna 6/27/25
// chapter street inc, 2025 ©
// user intent selector component for chat
//

import { Button } from "@/components/ui/button";

type Intent = 'inventory' | 'story' | 'photos' | null;

interface IntentSelectorProps {
  selectedIntent: Intent;
  onSelect: (intent: Intent) => void;
}

export default function IntentSelector({ selectedIntent, onSelect }: IntentSelectorProps) {
  const intents: { key: Intent, label: string, emoji: string }[] = [
    { key: 'inventory', label: 'Inventory', emoji: '🌲' },
    { key: 'story', label: 'Story', emoji: '☕️' },
    { key: 'photos', label: 'Photos', emoji: '📷' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {intents.map(({ key, label, emoji }) => (
        <Button
          key={key}
          type="button"
          variant={selectedIntent === key ? "lift" : "liftOutline"}
          onClick={() => onSelect(selectedIntent === key ? null : key)}
          className="flex-1"
        >
          {emoji} {label}
        </Button>
      ))}
    </div>
  );
}
