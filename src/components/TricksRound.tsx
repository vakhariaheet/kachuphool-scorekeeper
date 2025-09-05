import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Player {
  id: string;
  name: string;
  color: string;
  totalScore: number;
  currentBid?: number;
  currentTricks?: number;
}

interface TricksRoundProps {
  players: Player[];
  onUpdateTricks: (playerId: string, tricks: number) => void;
  onConfirmTricks: () => void;
  currentRound: number;
}

export function TricksRound({ players, onUpdateTricks, onConfirmTricks, currentRound }: TricksRoundProps) {
  const allTricksEntered = players.every(p => p.currentTricks !== undefined);
  const roundStructure = [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1];
  const maxCards = roundStructure[currentRound - 1];

  return (
    <div className="space-y-6">
      <Card className="p-4 text-center bg-gradient-card shadow-card">
        <h2 className="text-xl font-semibold mb-2">Tricks Phase</h2>
        <p className="text-muted-foreground">Enter tricks won after playing the round</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map(player => (
          <Card key={player.id} className="p-4 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
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
              <Badge variant="secondary" className="font-mono">
                {player.totalScore}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bid:</span>
                <Badge variant="outline" className="font-mono">
                  {player.currentBid}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">Tricks Won (0-{maxCards})</label>
                <Input
                  type="number"
                  min="0"
                  max={maxCards}
                  value={player.currentTricks || ''}
                  onChange={(e) => onUpdateTricks(player.id, parseInt(e.target.value) || 0)}
                  className="h-10 text-center font-mono text-lg"
                  placeholder="0"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {allTricksEntered && (
        <Card className="p-4 text-center">
          <Button
            onClick={onConfirmTricks}
            className="bg-gradient-primary hover:bg-primary-glow text-white"
            size="lg"
          >
            Calculate Scores
          </Button>
        </Card>
      )}
    </div>
  );
}