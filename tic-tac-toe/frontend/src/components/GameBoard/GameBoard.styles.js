import styled, { keyframes } from 'styled-components';

export const GameContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem 1rem;
`;

export const Container = styled.div`
  max-width: 42rem;
  margin: 0 auto;
`;

export const ErrorMessage = styled.div`
  margin-bottom: 1.5rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  padding: 1rem;
  color: #991b1b;
`;

export const Header = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
`;

export const PlayersInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const PlayerBox = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: ${({ active }) => active ? '#dbeafe' : '#f9fafb'};
  border: ${({ active }) => active ? '2px solid #93c5fd' : '1px solid #e5e7eb'};
`;

export const PlayerName = styled.span`
  font-weight: 500;
`;

export const PlayerSymbol = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ symbol }) => symbol === 'X' ? '#ef4444' : '#3b82f6'};
`;

export const StatusMessage = styled.p`
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  color: ${({ color }) => color || '#4b5563'};
`;

export const GameBoardWrapper = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GameBoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  width: 300px;
  height: 300px;
  background-color: #333;
  border-radius: 8px;
  padding: 10px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const Cell = styled.button`
  background-color: #fff;
  border-radius: 4px;
  border: none;
  font-size: 3.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .symbol {
    animation: ${fadeIn} 0.3s ease;
  }

  &.x { color: #e74c3c; }
  &.o { color: #3498db; }

  &:hover:not(:disabled) {
    background-color: #f0f0f0;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;