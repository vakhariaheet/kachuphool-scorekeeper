import { useState } from "react";
import { GameSetup } from "@/components/GameSetup";
import { GameHeader } from "@/components/GameHeader";
import { BiddingRound } from "@/components/BiddingRound";
import { TricksRound } from "@/components/TricksRound";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { ResultsPage } from "@/components/ResultsPage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";

interface Player {
  id: string;
  name: string;
  color: string;
  totalScore: number;
  currentBid?: number;
  currentTricks?: number;
  roundScore?: number;
}

interface RoundResult {
  round: number;
  cards: number;
  trump: string;
  results: {
    playerId: string;
    name: string;
    color: string;
    bid: number;
    tricks: number;
    roundScore: number;
    totalScore: number;
  }[];
}

const roundStructure = [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1];
const trumpRotation = ['spades', 'diamonds', 'clubs', 'hearts'];

const Index = () => {
  const [gameState, setGameState] = useState<'setup' | 'bidding' | 'tricks' | 'scores' | 'results'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [scoringSystem, setScoringSystem] = useState<'standard' | 'multiplier'>('standard');
  const [currentRound, setCurrentRound] = useState(1);
  const [trumpSuit, setTrumpSuit] = useState(trumpRotation[0]);
  const [roundsHistory, setRoundsHistory] = useState<RoundResult[]>([]);

  const startGame = (playerList: Player[], scoring: 'standard' | 'multiplier') => {
    setPlayers(playerList);
    setScoringSystem(scoring);
    setGameState('bidding');
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

  const confirmBids = () => {
    setGameState('tricks');
  };

  const confirmTricks = () => {
    setGameState('scores');
  };

  const nextRound = () => {
    // Save current round results to history
    const roundResult: RoundResult = {
      round: currentRound,
      cards: roundStructure[currentRound - 1],
      trump: trumpSuit,
      results: players.map(p => ({
        playerId: p.id,
        name: p.name,
        color: p.color,
        bid: p.currentBid || 0,
        tricks: p.currentTricks || 0,
        roundScore: p.roundScore || 0,
        totalScore: p.totalScore + (p.roundScore || 0)
      }))
    };
    
    setRoundsHistory(prev => [...prev, roundResult]);
    
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
      setGameState('bidding');
      nextTrump();
    } else {
      setGameState('scores'); // Show final results
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentRound(1);
    setTrumpSuit(trumpRotation[0]);
    setRoundsHistory([]);
  };

  const viewResults = () => {
    setGameState('results');
  };

  const backToGame = () => {
    if (isGameComplete) {
      setGameState('scores');
    } else {
      setGameState('scores');
    }
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

  const isGameComplete = currentRound > roundStructure.length;

  // Bidding Phase
  if (gameState === 'bidding') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
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
            {roundsHistory.length > 0 && (
              <Button
                variant="outline"
                onClick={viewResults}
                className="flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Results ({roundsHistory.length})
              </Button>
            )}
          </div>

          <GameHeader
            currentRound={currentRound}
            totalRounds={roundStructure.length}
            trumpSuit={trumpSuit}
            scoringSystem={scoringSystem}
          />

          <BiddingRound
            players={players}
            onUpdateBid={updatePlayerBid}
            onConfirmBids={confirmBids}
            currentRound={currentRound}
          />
        </div>
      </div>
    );
  }

  // Tricks Phase
  if (gameState === 'tricks') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
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
                onClick={() => setGameState('bidding')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Bids
              </Button>
            </div>
            {roundsHistory.length > 0 && (
              <Button
                variant="outline"
                onClick={viewResults}
                className="flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Results ({roundsHistory.length})
              </Button>
            )}
          </div>

          <GameHeader
            currentRound={currentRound}
            totalRounds={roundStructure.length}
            trumpSuit={trumpSuit}
            scoringSystem={scoringSystem}
          />

          <TricksRound
            players={players}
            onUpdateTricks={updatePlayerTricks}
            onConfirmTricks={confirmTricks}
            currentRound={currentRound}
          />
        </div>
      </div>
    );
  }

  // Scores Phase
  if (gameState === 'scores') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={resetGame}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              New Game
            </Button>
            <Button
              variant="outline"
              onClick={viewResults}
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              View Results
            </Button>
          </div>

          <GameHeader
            currentRound={currentRound}
            totalRounds={roundStructure.length}
            trumpSuit={trumpSuit}
            scoringSystem={scoringSystem}
          />

          <ScoreDisplay
            players={players}
            onNextRound={nextRound}
            onEndGame={resetGame}
            currentRound={currentRound}
            totalRounds={roundStructure.length}
            isGameComplete={isGameComplete}
          />
        </div>
      </div>
    );
  }

  // Results Page
  if (gameState === 'results') {
    return (
      <ResultsPage
        players={players}
        roundsHistory={roundsHistory}
        onBackToGame={backToGame}
        onNewGame={resetGame}
        isGameComplete={isGameComplete}
        scoringSystem={scoringSystem}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <GameSetup onStartGame={startGame} />
      </div>
    </div>
  );
};

export default Index;
