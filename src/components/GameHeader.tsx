import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameHeaderProps {
  currentRound: number;
  totalRounds: number;
  trumpSuit: string;
  scoringSystem: 'standard' | 'multiplier';
}

const suitSymbols = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣'
};

const suitColors = {
  spades: 'text-suits-spade',
  hearts: 'text-suits-heart',  
  diamonds: 'text-suits-diamond',
  clubs: 'text-suits-club'
};

export function GameHeader({ currentRound, totalRounds, trumpSuit, scoringSystem }: GameHeaderProps) {
  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-primary mb-2">Kachuphool Score Tracker</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Round {currentRound} of {totalRounds}</span>
            <Badge variant="outline" className="bg-muted">
              {scoringSystem === 'standard' ? 'Standard Scoring' : 'Multiplier Scoring'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Trump:</span>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-white shadow-elevated">
            <span className={`text-2xl ${suitColors[trumpSuit as keyof typeof suitColors]}`}>
              {suitSymbols[trumpSuit as keyof typeof suitSymbols]}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}