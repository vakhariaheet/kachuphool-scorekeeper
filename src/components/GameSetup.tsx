import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Settings } from "lucide-react";

interface Player {
  id: string;
  name: string;
  color: string;
  totalScore: number;
}

interface GameSetupProps {
  onStartGame: (players: Player[], scoringSystem: 'standard' | 'multiplier') => void;
}

const playerColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  '#F97316', '#6366F1'
];

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', color: playerColors[0], totalScore: 0 },
    { id: '2', name: 'Player 2', color: playerColors[1], totalScore: 0 },
    { id: '3', name: 'Player 3', color: playerColors[2], totalScore: 0 }
  ]);
  const [scoringSystem, setScoringSystem] = useState<'standard' | 'multiplier'>('standard');

  const addPlayer = () => {
    if (players.length < 10) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: `Player ${players.length + 1}`,
        color: playerColors[players.length],
        totalScore: 0
      };
      setPlayers([...players, newPlayer]);
    }
  };

  const removePlayer = (id: string) => {
    if (players.length > 3) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const canStartGame = players.length >= 3 && players.every(p => p.name.trim().length > 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Kachuphool Scorer</h1>
          <p className="text-muted-foreground">Configure your Judgment game</p>
        </div>

        <div className="space-y-6">
          {/* Scoring System */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Scoring System
            </Label>
            <Select value={scoringSystem} onValueChange={(value: 'standard' | 'multiplier') => setScoringSystem(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  <div className="text-left">
                    <div className="font-medium text-foreground">Standard</div>
                    <div className="text-xs text-foreground/70">10 + bid amount for exact bids</div>
                  </div>
                </SelectItem>
                <SelectItem value="multiplier">
                  <div className="text-left">
                    <div className="font-medium text-foreground">Multiplier</div>
                    <div className="text-xs text-foreground/70">Add "0" to bid (1→11, 0→10)</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Players */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Players ({players.length}/10)
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addPlayer}
                disabled={players.length >= 10}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Player
              </Button>
            </div>

            <div className="grid gap-3">
              {players.map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                    style={{ backgroundColor: player.color }}
                  >
                    {index + 1}
                  </div>
                  <Input
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1"
                  />
                  {players.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Round Structure Preview */}
          <div className="space-y-2">
            <Label>Round Structure</Label>
            <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-muted/30">
              {[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1].map((cards, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cards}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Each number represents cards dealt per player in that round
            </p>
          </div>

          <Button 
            onClick={() => onStartGame(players, scoringSystem)}
            disabled={!canStartGame}
            className="w-full bg-gradient-primary hover:bg-primary-glow text-white shadow-elevated"
            size="lg"
          >
            Start Game
          </Button>
        </div>
      </Card>
    </div>
  );
}