import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface Player {
  id: string;
  name: string;
  color: string;
  totalScore: number;
  currentBid?: number;
}

interface BiddingRoundProps {
  players: Player[];
  onUpdateBid: (playerId: string, bid: number) => void;
  onConfirmBids: () => void;
  currentRound: number;
}

export function BiddingRound({ players, onUpdateBid, onConfirmBids, currentRound }: BiddingRoundProps) {
  const allBidsEntered = players.every(p => p.currentBid !== undefined);
  const roundStructure = [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1];
  const maxCards = roundStructure[currentRound - 1];
  
  const totalBids = players.reduce((sum, p) => sum + (p.currentBid || 0), 0);
  const bidsEqualCards = totalBids === maxCards;
  const canConfirmBids = allBidsEntered && !bidsEqualCards;

  return (
    <div className="space-y-6">
      <Card className="p-4 text-center bg-gradient-card shadow-card">
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Bidding Phase</h2>
            <p className="text-foreground/70">Enter your bids for this round ({maxCards} cards each)</p>
          </div>
          
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-foreground/80">Total Bids: <strong className="text-foreground">{totalBids}</strong></span>
          <span className="text-foreground/80">Cards: <strong className="text-foreground">{maxCards}</strong></span>
          {bidsEqualCards && allBidsEntered && (
            <Badge variant="destructive" className="text-xs">
              Total bids cannot equal cards dealt!
            </Badge>
          )}
        </div>
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

            <div className="space-y-2">
              <label className="text-xs text-foreground/70 block font-medium">Bid (0-{maxCards})</label>
              <Input
                type="number"
                min="0"
                max={maxCards}
                value={player.currentBid || ''}
                onChange={(e) => onUpdateBid(player.id, parseInt(e.target.value) || 0)}
                className="h-10 text-center font-mono text-lg"
                placeholder="0"
              />
            </div>
          </Card>
        ))}
      </div>

      {allBidsEntered && (
        <Card className="p-4 text-center">
          <Button
            onClick={onConfirmBids}
            className="bg-gradient-primary hover:bg-primary-glow text-white"
            size="lg"
            disabled={!canConfirmBids}
          >
            {bidsEqualCards ? 
              "Adjust Bids - Total Cannot Equal Cards!" : 
              "Confirm Bids → Start Playing"
            }
          </Button>
          {bidsEqualCards && (
            <p className="text-xs text-foreground/70 mt-2 font-medium">
              Rule: The sum of all bids must be different from the number of cards dealt ({maxCards}).
            </p>
          )}
        </Card>
      )}
    </div>
  );
}