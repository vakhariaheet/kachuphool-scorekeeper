import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy, Target, CheckCircle, XCircle } from "lucide-react";

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

interface Player {
  id: string;
  name: string;
  color: string;
  totalScore: number;
}

interface ResultsPageProps {
  players: Player[];
  roundsHistory: RoundResult[];
  onBackToGame: () => void;
  onNewGame: () => void;
  isGameComplete: boolean;
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

export function ResultsPage({ 
  players, 
  roundsHistory, 
  onBackToGame, 
  onNewGame, 
  isGameComplete,
  scoringSystem 
}: ResultsPageProps) {
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  
  const getPlayerStats = (playerId: string) => {
    let successfulBids = 0;
    let totalBids = 0;
    let totalPointsScored = 0;
    
    roundsHistory.forEach(round => {
      const playerResult = round.results.find(r => r.playerId === playerId);
      if (playerResult) {
        totalBids++;
        totalPointsScored += playerResult.roundScore;
        if (playerResult.bid === playerResult.tricks && playerResult.roundScore > 0) {
          successfulBids++;
        }
      }
    });
    
    return {
      successRate: totalBids > 0 ? Math.round((successfulBids / totalBids) * 100) : 0,
      avgPointsPerRound: totalBids > 0 ? Math.round(totalPointsScored / totalBids) : 0,
      successfulBids,
      totalBids
    };
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBackToGame}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isGameComplete ? 'Back' : 'Back to Game'}
          </Button>
          <Button
            variant="outline"
            onClick={onNewGame}
            className="flex items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            New Game
          </Button>
        </div>

        <Card className="p-6 bg-gradient-card shadow-card">
          <h1 className="text-2xl font-bold text-primary mb-2">Game Results</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{roundsHistory.length} rounds completed</span>
            <Badge variant="outline" className="bg-muted">
              {scoringSystem === 'standard' ? 'Standard Scoring' : 'Multiplier Scoring'}
            </Badge>
          </div>
        </Card>

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="rounds">Round History</TabsTrigger>
            <TabsTrigger value="stats">Player Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Current Standings
              </h3>
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <span className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "secondary"} className="font-mono text-sm min-w-[40px]">
                        #{index + 1}
                      </Badge>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono font-bold text-lg">
                        {player.totalScore}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rounds" className="space-y-4">
            {roundsHistory.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed rounds yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {roundsHistory.slice().reverse().map((round) => (
                  <Card key={round.round} className="p-4 bg-gradient-card shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Round {round.round}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{round.cards} cards</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Trump: 
                          <span className={`text-lg ${suitColors[round.trump as keyof typeof suitColors]}`}>
                            {suitSymbols[round.trump as keyof typeof suitSymbols]}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {round.results.map((result) => {
                        const bidMatched = result.bid === result.tricks;
                        return (
                          <div key={result.playerId} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                                style={{ backgroundColor: result.color }}
                              >
                                {result.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-sm">{result.name}</span>
                              {bidMatched ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Bid:</span>
                                <span className="font-mono">{result.bid}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Won:</span>
                                <span className="font-mono">{result.tricks}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Score:</span>
                                <Badge 
                                  variant={bidMatched ? "default" : "destructive"}
                                  className="font-mono text-xs h-5"
                                >
                                  {result.roundScore > 0 ? '+' : ''}{result.roundScore}
                                </Badge>
                              </div>
                              <div className="flex justify-between font-medium pt-1 border-t border-muted">
                                <span>Total:</span>
                                <span className="font-mono">{result.totalScore}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => {
                const stats = getPlayerStats(player.id);
                return (
                  <Card key={player.id} className="p-4 bg-gradient-card shadow-card">
                    <div className="flex items-center gap-2 mb-4">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-semibold">{player.name}</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Score:</span>
                        <Badge variant="secondary" className="font-mono">
                          {player.totalScore}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success Rate:</span>
                        <Badge 
                          variant={stats.successRate >= 70 ? "default" : stats.successRate >= 50 ? "secondary" : "destructive"}
                          className="font-mono"
                        >
                          {stats.successRate}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Successful Bids:</span>
                        <span className="font-mono">{stats.successfulBids}/{stats.totalBids}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Points/Round:</span>
                        <span className="font-mono">{stats.avgPointsPerRound}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}