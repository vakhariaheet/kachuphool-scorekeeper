import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

interface Player {
  id: string;
  name: string;
  color: string;
  totalScore: number;
  currentBid?: number;
  currentTricks?: number;
  roundScore?: number;
}

interface ScoreDisplayProps {
  players: Player[];
  onNextRound: () => void;
  onEndGame?: () => void;
  currentRound: number;
  totalRounds: number;
  isGameComplete: boolean;
}

export function ScoreDisplay({ 
  players, 
  onNextRound, 
  onEndGame, 
  currentRound, 
  totalRounds,
  isGameComplete 
}: ScoreDisplayProps) {
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  if (isGameComplete) {
    return (
      <div className="space-y-6">
        <Card className="p-6 text-center bg-gradient-gold">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
          <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-lg">Final Standings:</h3>
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                <span className="flex items-center gap-3">
                  <Badge variant={index === 0 ? "default" : "secondary"} className="font-mono text-sm">
                    #{index + 1}
                  </Badge>
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="font-medium">{player.name}</span>
                </span>
                <Badge variant="outline" className="font-mono font-bold text-lg">
                  {player.totalScore}
                </Badge>
              </div>
            ))}
          </div>
          <Button onClick={onEndGame} variant="secondary" size="lg">
            New Game
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 text-center bg-gradient-card shadow-card">
        <h2 className="text-xl font-semibold mb-2">Round {currentRound} Results</h2>
        <p className="text-muted-foreground">Scores calculated based on bids vs tricks</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map(player => {
          const bidMatched = player.currentBid === player.currentTricks;
          const newTotal = player.totalScore + (player.roundScore || 0);
          
          return (
            <Card key={player.id} className="p-4 bg-gradient-card shadow-card">
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
                {bidMatched ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bid:</span>
                  <Badge variant="outline" className="font-mono">
                    {player.currentBid}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tricks:</span>
                  <Badge variant="outline" className="font-mono">
                    {player.currentTricks}
                  </Badge>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Round Score:</span>
                  <Badge 
                    variant={bidMatched ? "default" : "destructive"}
                    className="font-mono"
                  >
                    {player.roundScore > 0 ? '+' : ''}{player.roundScore}
                  </Badge>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total:</span>
                  <Badge variant="secondary" className="font-mono text-base">
                    {newTotal}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 text-center">
        <Button
          onClick={onNextRound}
          className="bg-gradient-primary hover:bg-primary-glow text-white"
          size="lg"
        >
          {currentRound < totalRounds ? `Start Round ${currentRound + 1}` : 'View Final Results'}
        </Button>
      </Card>
    </div>
  );
}