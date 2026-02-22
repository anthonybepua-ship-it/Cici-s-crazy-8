import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType, Suit } from '../types';
import { getSuitSymbol, getSuitColor } from '../constants';

interface CardProps {
  card: CardType;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className = ""
}) => {
  return (
    <motion.div
      layoutId={card.id}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-16 h-24 sm:w-20 h-28 lg:w-24 lg:h-32 rounded-lg shadow-md border 
        ${isFaceUp ? 'bg-white border-slate-200' : 'bg-indigo-600 border-indigo-400'}
        ${isPlayable ? 'cursor-pointer ring-2 ring-emerald-400/50' : ''}
        flex flex-col items-center justify-center select-none
        transition-shadow duration-200
        ${className}
      `}
    >
      {isFaceUp ? (
        <>
          <div className={`absolute top-0.5 left-1 text-xs sm:text-sm lg:text-base font-bold ${getSuitColor(card.suit)}`}>
            {card.rank}
          </div>
          <div className={`absolute top-0.5 right-1 text-xs sm:text-sm lg:text-base ${getSuitColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
          
          <div className={`text-xl sm:text-2xl lg:text-3xl ${getSuitColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>

          <div className={`absolute bottom-0.5 right-1 text-xs sm:text-sm lg:text-base font-bold rotate-180 ${getSuitColor(card.suit)}`}>
            {card.rank}
          </div>
          <div className={`absolute bottom-0.5 left-1 text-xs sm:text-sm lg:text-base rotate-180 ${getSuitColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-24 sm:w-20 sm:h-32 border-2 border-white/20 rounded-lg flex items-center justify-center">
            <div className="text-white/30 text-4xl font-bold">8</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
