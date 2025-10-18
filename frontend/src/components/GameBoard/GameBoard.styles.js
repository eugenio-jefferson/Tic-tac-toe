import styled, { keyframes } from 'styled-components';

export const GameContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem 1rem;
  background-image: url('/xo_grid1.svg');

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

export const ButtonExitGame = styled.button`
  background-color: #6b7280;
  color: white;
  padding: 0.5rem 0.5rem;
  border: none;
  border-radius: 0.275rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background-color: #4b5563;
  }

`

export const PlayersInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #374151;
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

  &.x { color: #d10000ff; }
  &.o { color: #3498db; }

  &:hover:not(:disabled) {
    background-color: #f0f0f0;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const fadeInOverlay = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInContent = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const GameOverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: ${fadeInOverlay} 0.5s ease;
`;

export const GameOverContent = styled.div`
  text-align: center;
  animation: ${slideInContent} 0.5s ease 0.2s backwards;
`;

export const GameOverTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: ${({ color }) => color || '#111827'};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const BackToLobbyButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #4f46e5;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;