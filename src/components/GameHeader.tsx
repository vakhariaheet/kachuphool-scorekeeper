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

const suitBackgrounds = {
  spades: 'bg-slate-100 dark:bg-slate-800',
  hearts: 'bg-red-50 dark:bg-red-900/20',
  diamonds: 'bg-red-50 dark:bg-red-900/20',
  clubs: 'bg-slate-100 dark:bg-slate-800'
};

export function GameHeader({ currentRound, totalRounds, trumpSuit, scoringSystem }: GameHeaderProps) {
  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-primary mb-2">Kachuphool Score Tracker</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Round {currentRound} of {totalRounds}</span>
            <Badge variant="outline" className="bg-muted text-muted-foreground font-medium border-muted-foreground/20">
              {scoringSystem === 'standard' ? 'Standard Scoring' : 'Multiplier Scoring'}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-foreground/80">Trump Suit</span>
          <div className={`flex items-center justify-center w-16 h-16 rounded-full border-2 border-border shadow-elevated transition-all duration-300 hover:scale-110 ${suitBackgrounds[trumpSuit as keyof typeof suitBackgrounds]}`}>
            <span className={`text-3xl font-bold ${suitColors[trumpSuit as keyof typeof suitColors]}`}>
              {suitSymbols[trumpSuit as keyof typeof suitSymbols]}
            </span>
          </div>
          <span className="text-xs font-medium text-foreground/70 capitalize">
            {trumpSuit}
          </span>
        </div>
      </div>
    </Card>
  );
}