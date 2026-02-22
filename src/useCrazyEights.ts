import { useState, useEffect, useCallback } from 'react';
import { Card, GameState, Suit, Rank, GameStatus } from './types';
import { createDeck, shuffleDeck } from './constants';

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentTurn: 'player',
    status: 'start_screen',
    wildSuit: null,
  });

  const initGame = useCallback(() => {
    const fullDeck = shuffleDeck(createDeck());
    const playerHand = fullDeck.slice(0, 8);
    const aiHand = fullDeck.slice(8, 16);
    const remainingDeck = fullDeck.slice(16);
    
    // Find a starting card that isn't an 8
    let firstCardIndex = 0;
    while (remainingDeck[firstCardIndex].rank === Rank.EIGHT) {
      firstCardIndex++;
    }
    
    const firstCard = remainingDeck.splice(firstCardIndex, 1)[0];

    setState({
      deck: remainingDeck,
      playerHand,
      aiHand,
      discardPile: [firstCard],
      currentTurn: 'player',
      status: 'playing',
      wildSuit: null,
    });
  }, []);

  const startGame = () => {
    initGame();
  };

  // Remove automatic initGame on mount to allow start screen
  // useEffect(() => {
  //   initGame();
  // }, [initGame]);

  const topDiscard = state.discardPile.length > 0 ? state.discardPile[state.discardPile.length - 1] : null;
  const currentSuit = state.wildSuit || topDiscard?.suit;

  const isCardPlayable = (card: Card) => {
    if (state.status !== 'playing' || !topDiscard) return false;
    if (card.rank === Rank.EIGHT) return true;
    return card.suit === currentSuit || card.rank === topDiscard.rank;
  };

  const playCard = (card: Card, isPlayer: boolean) => {
    const handKey = isPlayer ? 'playerHand' : 'aiHand';
    const nextTurn = isPlayer ? 'ai' : 'player';
    
    const newHand = state[handKey].filter(c => c.id !== card.id);
    const newDiscard = [...state.discardPile, card];
    
    if (newHand.length === 0) {
      setState(prev => ({
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscard,
        status: isPlayer ? 'player_won' : 'ai_won',
        wildSuit: null,
      }));
      return;
    }

    if (card.rank === Rank.EIGHT) {
      setState(prev => ({
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscard,
        status: isPlayer ? 'selecting_suit' : 'playing',
        currentTurn: isPlayer ? 'player' : nextTurn, // If AI plays 8, it chooses suit immediately
      }));
      
      if (!isPlayer) {
        // AI logic for choosing suit: pick the suit it has most of
        const suitCounts = newHand.reduce((acc, c) => {
          acc[c.suit] = (acc[c.suit] || 0) + 1;
          return acc;
        }, {} as Record<Suit, number>);
        
        const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => 
          suitCounts[a] > suitCounts[b] ? a : b, Suit.HEARTS
        );
        
        setState(prev => ({ ...prev, wildSuit: bestSuit }));
      }
    } else {
      setState(prev => ({
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscard,
        currentTurn: nextTurn,
        wildSuit: null,
      }));
    }
  };

  const selectWildSuit = (suit: Suit) => {
    setState(prev => ({
      ...prev,
      wildSuit: suit,
      status: 'playing',
      currentTurn: 'ai',
    }));
  };

  const drawCard = (isPlayer: boolean) => {
    if (state.deck.length === 0) {
      // Skip turn if deck empty
      setState(prev => ({
        ...prev,
        currentTurn: isPlayer ? 'ai' : 'player',
      }));
      return;
    }

    const newDeck = [...state.deck];
    const drawnCard = newDeck.pop()!;
    const handKey = isPlayer ? 'playerHand' : 'aiHand';

    setState(prev => ({
      ...prev,
      deck: newDeck,
      [handKey]: [...prev[handKey], drawnCard],
      // After drawing, if the card is playable, we could allow playing it, 
      // but standard "Crazy 8s" often ends the turn or allows playing only the drawn card.
      // Let's stick to: draw ends turn if not playable, or just ends turn to keep it simple.
      currentTurn: isPlayer ? 'ai' : 'player',
    }));
  };

  // AI Turn Logic
  useEffect(() => {
    if (state.status === 'playing' && state.currentTurn === 'ai') {
      const timer = setTimeout(() => {
        const playableCard = state.aiHand.find(isCardPlayable);
        if (playableCard) {
          playCard(playableCard, false);
        } else {
          drawCard(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.currentTurn, state.status, state.aiHand, currentSuit, topDiscard]);

  return {
    state,
    playCard: (card: Card) => playCard(card, true),
    drawCard: () => drawCard(true),
    selectWildSuit,
    initGame,
    startGame,
    isCardPlayable,
    currentSuit,
  };
};
