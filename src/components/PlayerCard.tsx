import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    color: string;
    totalScore: number;
    currentBid?: number;
    currentTricks?: number;
    roundScore?: number;
  };
  onUpdateBid: (bid: number) => void;
  onUpdateTricks: (tricks: number) => void;
  onRemovePlayer?: () => void;
  canRemove?: boolean;
  isRoundActive?: boolean;
}

export function PlayerCard({ 
  player, 
  onUpdateBid, 
  onUpdateTricks, 
  onRemovePlayer,
  canRemove = false,
  isRoundActive = false 
}: PlayerCardProps) {
  return (
    <Card className="p-4 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
            style={{ backgroundColor: player.color }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-semibold text-card-foreground">{player.name}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {player.totalScore}
          </Badge>
          {canRemove && onRemovePlayer && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemovePlayer}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {isRoundActive && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bid</label>
              <Input
                type="number"
                min="0"
                max="8"
                value={player.currentBid || ''}
                onChange={(e) => onUpdateBid(parseInt(e.target.value) || 0)}
                className="h-8 text-center font-mono"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tricks</label>
              <Input
                type="number"
                min="0"
                max="8"
                value={player.currentTricks || ''}
                onChange={(e) => onUpdateTricks(parseInt(e.target.value) || 0)}
                className="h-8 text-center font-mono"
                placeholder="0"
              />
            </div>
          </div>
          
          {player.roundScore !== undefined && (
            <div className="text-center">
              <Badge 
                variant={player.roundScore > 0 ? "default" : "destructive"}
                className="font-mono"
              >
                {player.roundScore > 0 ? '+' : ''}{player.roundScore}
              </Badge>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}