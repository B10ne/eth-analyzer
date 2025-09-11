import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Timeframe = '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onSelect: (timeframe: Timeframe) => void;
}

const timeframes: { value: Timeframe; label: string }[] = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'ALL' },
];

export function TimeframeSelector({ selected, onSelect }: TimeframeSelectorProps) {
  return (
    <div className="flex items-center space-x-1 rounded-lg border border-border p-1">
      {timeframes.map((timeframe) => (
        <Button
          key={timeframe.value}
          variant={selected === timeframe.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onSelect(timeframe.value)}
          className={cn(
            'h-8 px-3 text-xs font-medium',
            selected === timeframe.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {timeframe.label}
        </Button>
      ))}
    </div>
  );
}