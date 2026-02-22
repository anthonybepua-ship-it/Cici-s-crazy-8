/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Card } from './components/Card';
import { useCrazyEights } from './useCrazyEights';
import { Suit } from './types';
import { getSuitSymbol, getSuitColor } from './constants';
import { Trophy, RefreshCw, Info, ChevronUp, Play } from 'lucide-react';

export default function App() {
  const { 
    state, 
    playCard, 
    drawCard, 
    selectWildSuit, 
    initGame, 
    startGame,
    isCardPlayable,
    currentSuit 
  } = useCrazyEights();

  const topDiscard = state.discardPile.length > 0 ? state.discardPile[state.discardPile.length - 1] : null;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Header */}
      <header className="p-3 flex justify-between items-center border-b border-white/10 bg-slate-900/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-lg font-bold">8</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Cici's Crazy Eights</h1>
        </div>
        <div className="flex items-center gap-4">
          {state.status !== 'start_screen' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${state.currentTurn === 'player' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                {state.currentTurn === 'player' ? "Your Turn" : "AI Thinking..."}
              </span>
            </div>
          )}
          <button 
            onClick={initGame}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Restart Game"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 relative flex flex-col items-center justify-between p-2 sm:p-4 max-w-7xl mx-auto w-full overflow-hidden z-10">
        
        {/* AI Hand */}
        <div className="w-full flex flex-col items-center gap-0.5 mt-0.5">
          <div className="flex items-center gap-2 opacity-50">
            <span className="text-[7px] font-bold uppercase tracking-widest">Opponent</span>
            <span className="bg-white/10 px-1 py-0.5 rounded text-[7px]">{state.aiHand.length}</span>
          </div>
          <div className="flex -space-x-10 sm:-space-x-14 lg:-space-x-18 hover:-space-x-4 lg:hover:-space-x-6 transition-all duration-300">
            {state.aiHand.map((card, idx) => (
              <Card 
                key={card.id} 
                card={card} 
                isFaceUp={false} 
                className="scale-75 lg:scale-90 origin-top"
              />
            ))}
          </div>
        </div>

        {/* Center Board */}
        <div className="relative flex flex-row items-center justify-center gap-6 sm:gap-12 lg:gap-20 my-1">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-0.5">
             <div className="relative group">
                <div className="absolute -inset-1 bg-indigo-500 rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <Card 
                  card={{ id: 'deck', suit: Suit.SPADES, rank: '8' as any }} 
                  isFaceUp={false} 
                  onClick={state.currentTurn === 'player' ? drawCard : undefined}
                  isPlayable={state.currentTurn === 'player' && state.status === 'playing'}
                  className="relative scale-90 lg:scale-100"
                />
                {state.deck.length > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[7px] font-bold px-1 py-0.5 rounded-full border border-white/20 shadow-lg">
                    {state.deck.length}
                  </div>
                )}
             </div>
             <span className="text-[7px] font-bold uppercase tracking-widest opacity-40">Draw</span>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="relative">
              {state.discardPile.slice(-3).map((card, idx) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  className={`absolute top-0 left-0 transition-transform duration-300 scale-90 lg:scale-100`}
                  style={{ 
                    transform: `rotate(${(idx - 1) * 5}deg) translate(${idx * 2}px, ${idx * 2}px)`,
                    zIndex: idx 
                  }}
                />
              ))}
              {/* Placeholder for layout since children are absolute */}
              <div className="invisible">
                {topDiscard && <Card card={topDiscard} className="scale-90 lg:scale-100" />}
              </div>

              {/* Wild Suit Indicator */}
              {state.wildSuit && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-indigo-500 z-50"
                >
                  <span className={`text-lg ${getSuitColor(state.wildSuit)}`}>
                    {getSuitSymbol(state.wildSuit)}
                  </span>
                </motion.div>
              )}
            </div>
            <span className="text-[7px] font-bold uppercase tracking-widest opacity-40">Discard</span>
          </div>
        </div>

        {/* Player Hand */}
        <div className="w-full flex flex-col items-center gap-0.5 mb-0.5">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 opacity-50">
              <span className="text-[7px] font-bold uppercase tracking-widest">You</span>
              <span className="bg-white/10 px-1 py-0.5 rounded text-[7px]">{state.playerHand.length}</span>
            </div>
            {state.currentTurn === 'player' && state.status === 'playing' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-emerald-400 text-[7px] font-bold uppercase tracking-widest"
              >
                <ChevronUp size={8} className="animate-bounce" />
                Your Turn
              </motion.div>
            )}
          </div>
          
          <div className="flex -space-x-10 sm:-space-x-12 lg:-space-x-14 hover:-space-x-2 transition-all duration-300 px-4 pb-2">
            <AnimatePresence mode="popLayout">
              {state.playerHand.map((card) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  isPlayable={state.currentTurn === 'player' && isCardPlayable(card)}
                  onClick={() => playCard(card)}
                  className={`scale-90 lg:scale-100 origin-bottom ${state.currentTurn !== 'player' ? 'opacity-80 grayscale-[0.2]' : ''}`}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {state.status === 'start_screen' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 p-12 rounded-[40px] shadow-2xl max-w-md w-full text-center relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/20 rounded-full blur-[80px]" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-12">
                  <span className="text-5xl font-black text-white">8</span>
                </div>

                <h1 className="text-4xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  CRAZY EIGHTS
                </h1>
                <p className="text-slate-400 mb-10 text-sm leading-relaxed">
                  The classic card game of strategy and luck. <br/>
                  Match suit or rank, and use the 8s to change the game!
                </p>

                <button
                  onClick={startGame}
                  className="w-full py-4 bg-white text-slate-950 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3 group"
                >
                  <Play size={20} className="fill-current group-hover:translate-x-1 transition-transform" />
                  START GAME
                </button>
                
                <div className="mt-8 flex justify-center gap-4 opacity-40">
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold">♥</div>
                    <div className="text-[8px]">HEARTS</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold">♦</div>
                    <div className="text-[8px]">DIAMONDS</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold">♣</div>
                    <div className="text-[8px]">CLUBS</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold">♠</div>
                    <div className="text-[8px]">SPADES</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {state.status === 'selecting_suit' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            >
              <h2 className="text-2xl font-bold mb-2">Crazy 8!</h2>
              <p className="text-slate-400 text-sm mb-8">Choose the next suit to play</p>
              
              <div className="grid grid-cols-2 gap-4">
                {[Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES].map((suit) => (
                  <button
                    key={suit}
                    onClick={() => selectWildSuit(suit)}
                    className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all hover:scale-105 active:scale-95 group"
                  >
                    <span className={`text-4xl mb-2 ${getSuitColor(suit)} group-hover:scale-110 transition-transform`}>
                      {getSuitSymbol(suit)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{suit}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {(state.status === 'player_won' || state.status === 'ai_won') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 p-12 rounded-[40px] shadow-2xl max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] ${state.status === 'player_won' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`} />
              
              <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${state.status === 'player_won' ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-red-500 shadow-red-500/40'} shadow-xl`}>
                <Trophy size={40} className="text-white" />
              </div>

              <h2 className="text-4xl font-black mb-4 tracking-tight">
                {state.status === 'player_won' ? "VICTORY!" : "DEFEAT"}
              </h2>
              <p className="text-slate-400 mb-10">
                {state.status === 'player_won' 
                  ? "You've cleared all your cards. Impressive strategy!" 
                  : "The AI outplayed you this time. Ready for a rematch?"}
              </p>

              <button
                onClick={initGame}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3"
              >
                <RefreshCw size={20} />
                PLAY AGAIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Status Bar */}
      <footer className="p-2 bg-slate-900/80 border-t border-white/5 flex justify-between items-center text-[8px] font-bold uppercase tracking-widest opacity-50 z-20">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Deck: {state.deck.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Discard: {state.discardPile.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Info size={10} />
          <span>Rules: Match Suit or Rank. 8 is Wild.</span>
        </div>
      </footer>
    </div>
  );
}
