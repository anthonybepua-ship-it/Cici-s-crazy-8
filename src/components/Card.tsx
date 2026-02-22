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
      whileHover={isPlayable ? { y: -5, scale: 1.02 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-14 h-20 sm:w-16 h-24 lg:w-20 lg:h-28 rounded-md shadow-md border 
        ${isFaceUp ? 'bg-white border-slate-200' : 'bg-indigo-600 border-indigo-400'}
        ${isPlayable ? 'cursor-pointer ring-2 ring-emerald-400/50' : ''}
        flex flex-col items-center justify-center select-none
        transition-shadow duration-200
        ${className}
      `}
    >
      {isFaceUp ? (
        <>
          <div className={`absolute top-0 left-0.5 text-[10px] sm:text-xs lg:text-sm font-bold ${getSuitColor(card.suit)}`}>
            {card.rank}
          </div>
          <div className={`absolute top-0 right-0.5 text-[10px] sm:text-xs lg:text-sm ${getSuitColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
          
          <div className={`text-lg sm:text-xl lg:text-2xl ${getSuitColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>

          <div className={`absolute bottom-0 right-0.5 text-[10px] sm:text-xs lg:text-sm font-bold rotate-180 ${getSuitColor(card.suit)}`}>
            {card.rank}
          </div>
          <div className={`absolute bottom-0 left-0.5 text-[10px] sm:text-xs lg:text-sm rotate-180 ${getSuitColor(card.suit)}`}>
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
