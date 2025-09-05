import { useState } from "react";
import { GameSetup } from "@/components/GameSetup";
import { GameHeader } from "@/components/GameHeader";
import { PlayerCard } from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";

interface Player {
  id: string;
  name: string;
  color: string;
  totalScore: number;
  currentBid?: number;
  currentTricks?: number;
  roundScore?: number;
}

const roundStructure = [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1];
const trumpRotation = ['spades', 'diamonds', 'clubs', 'hearts'];

const Index = () => {
  const [gameState, setGameState] = useState<'setup' | 'playing'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [scoringSystem, setScoringSystem] = useState<'standard' | 'multiplier'>('standard');
  const [currentRound, setCurrentRound] = useState(1);
  const [trumpSuit, setTrumpSuit] = useState(trumpRotation[0]);

  const startGame = (playerList: Player[], scoring: 'standard' | 'multiplier') => {
    setPlayers(playerList);
    setScoringSystem(scoring);
    setGameState('playing');
    setCurrentRound(1);
  };

  const nextTrump = () => {
    const currentIndex = trumpRotation.indexOf(trumpSuit);
    const nextIndex = (currentIndex + 1) % trumpRotation.length;
    setTrumpSuit(trumpRotation[nextIndex]);
  };

  const calculateRoundScore = (bid: number, tricks: number): number => {
    if (bid === tricks) {
      return scoringSystem === 'standard' ? 10 + bid : (bid === 0 || bid === 1) ? (bid === 0 ? 10 : 11) : parseInt(`${bid}0`);
    }
    return 0;
  };

  const updatePlayerBid = (playerId: string, bid: number) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, currentBid: bid } : p
    ));
  };

  const updatePlayerTricks = (playerId: string, tricks: number) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        const roundScore = p.currentBid !== undefined ? calculateRoundScore(p.currentBid, tricks) : 0;
        return { ...p, currentTricks: tricks, roundScore };
      }
      return p;
    }));
  };

  const nextRound = () => {
    // Add round scores to total scores
    setPlayers(players.map(p => ({
      ...p,
      totalScore: p.totalScore + (p.roundScore || 0),
      currentBid: undefined,
      currentTricks: undefined,
      roundScore: undefined
    })));
    
    if (currentRound < roundStructure.length) {
      setCurrentRound(currentRound + 1);
      nextTrump();
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentRound(1);
    setTrumpSuit(trumpRotation[0]);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto py-8">
          <GameSetup onStartGame={startGame} />
        </div>
      </div>
    );
  }

  const canProgressRound = players.every(p => 
    p.currentBid !== undefined && p.currentTricks !== undefined
  );
  const isGameComplete = currentRound >= roundStructure.length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={resetGame}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            New Game
          </Button>
          <Button
            variant="ghost"
            onClick={nextTrump}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Next Trump
          </Button>
        </div>

        <GameHeader
          currentRound={currentRound}
          totalRounds={roundStructure.length}
          trumpSuit={trumpSuit}
          scoringSystem={scoringSystem}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onUpdateBid={(bid) => updatePlayerBid(player.id, bid)}
              onUpdateTricks={(tricks) => updatePlayerTricks(player.id, tricks)}
              isRoundActive={!isGameComplete}
            />
          ))}
        </div>

        {!isGameComplete && canProgressRound && (
          <Card className="p-4 text-center">
            <Button
              onClick={nextRound}
              className="bg-gradient-primary hover:bg-primary-glow text-white"
              size="lg"
            >
              Next Round ({currentRound + 1}/{roundStructure.length})
            </Button>
          </Card>
        )}

        {isGameComplete && (
          <Card className="p-6 text-center bg-gradient-gold">
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold">Final Scores:</h3>
              {players
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-sm">#{index + 1}</span>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      {player.name}
                    </span>
                    <span className="font-mono font-bold">{player.totalScore}</span>
                  </div>
                ))}
            </div>
            <Button onClick={resetGame} variant="secondary">
              Play Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
