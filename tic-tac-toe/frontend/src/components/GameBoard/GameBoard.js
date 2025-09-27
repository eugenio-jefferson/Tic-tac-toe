'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';

import {
  FaTrophy,
  FaSadTear,
  FaHandshake,
  FaHourglassHalf,
  FaCrosshairs,
} from 'react-icons/fa';
import {
  GameContainer,
  Container,
  ErrorMessage,
  Header,
  HeaderTop,
  Title,
  PlayersInfo,
  PlayerBox,
  PlayerName,
  PlayerSymbol,
  StatusMessage,
  GameBoardWrapper,
  GameBoardGrid,
  Cell,
  GameOverOverlay,
  GameOverContent,
  GameOverTitle,
  BackToLobbyButton,
} from './GameBoard.styles';

export default function GameBoard() {
  const { user } = useAuth();
  const { currentGame, makeMove, abandonGame, leaveGame } = useGame();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!currentGame) {
    return (
      <GameContainer>
        <p style={{ textAlign: 'center' }}>Nenhum jogo ativo encontrado.</p>
      </GameContainer>
    );
  }

  const isPlayer1 = currentGame.player1Id === user?.id;
  const isMyTurn = currentGame.currentPlayer === user?.id;
  const isGameOver = currentGame.status === 'FINISHED' || currentGame.status === 'ABANDONED';


  const handleCellClick = async (position) => {
    if (!isMyTurn || currentGame.status !== 'IN_PROGRESS' || loading || currentGame.board[position] !== null) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await makeMove(position);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAbandonGame = async () => {
    if (window.confirm('Tem certeza que deseja abandonar o jogo?')) {
      setLoading(true);
      setError('');
      try {
        await abandonGame();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getGameStatusMessage = () => {
    if (currentGame.status === 'FINISHED') {
      if (currentGame.winner === user?.id) return { icon: <FaTrophy />, message: 'Você venceu!', color: '#16a34a' };
      if (currentGame.winner) return { icon: <FaSadTear />, message: 'Você perdeu!', color: '#dc2626' };
      return { icon: <FaHandshake />, message: 'Empate!', color: '#f59e0b' };
    }
    if (currentGame.status === 'ABANDONED') {
      if (currentGame.winner === user?.id) return { icon: <FaTrophy />, message: 'Você venceu por abandono!', color: '#16a34a' };
      return { icon: <FaSadTear />, message: 'Você abandonou o jogo!', color: '#dc2626' };
    }
    if (isMyTurn) return { icon: <FaCrosshairs />, message: 'Sua vez!', color: '#2563eb' };
    return { icon: <FaHourglassHalf />, message: 'Aguardando jogada do oponente...', color: '#4b5563' };
  };

  const statusMessage = getGameStatusMessage();

   return (
    <GameContainer>
      <Container>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Header>
          <HeaderTop>
            <Title>Jogo da Velha</Title>
            <button
              onClick={handleAbandonGame}
              disabled={loading || isGameOver} 
            >
              Abandonar Jogo
            </button>
          </HeaderTop>
          <PlayersInfo>
            <PlayerBox active={isPlayer1 && isMyTurn && !isGameOver}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <PlayerName>{currentGame.player1.username} {isPlayer1 && '(Você)'}</PlayerName>
                <PlayerSymbol symbol="X">X</PlayerSymbol>
              </div>
            </PlayerBox>
            <PlayerBox active={!isPlayer1 && isMyTurn && !isGameOver}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <PlayerName>{currentGame.player2.username} {!isPlayer1 && '(Você)'}</PlayerName>
                <PlayerSymbol symbol="O">O</PlayerSymbol>
              </div>
            </PlayerBox>
          </PlayersInfo>
          {!isGameOver && (
             <StatusMessage color={statusMessage.color}>
              <span style={{ marginRight: '8px' }}>{statusMessage.icon}</span>
              {statusMessage.message}
            </StatusMessage>
          )}
        </Header>

        <GameBoardWrapper>
          <GameBoardGrid>
            {currentGame.board.map((cell, index) => (
              <Cell
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!isMyTurn || isGameOver || cell !== null || loading}
                className={cell ? cell.toLowerCase() : ''}
              >
                {cell && <span className="symbol">{cell}</span>}
              </Cell>
            ))}
          </GameBoardGrid>
          
          {isGameOver && (
            <GameOverOverlay>
              <GameOverContent>
                <GameOverTitle color={statusMessage.color}>
                  {statusMessage.icon}
                  {statusMessage.message}
                </GameOverTitle>
                <BackToLobbyButton onClick={leaveGame}>
                  Voltar ao Lobby
                </BackToLobbyButton>
              </GameOverContent>
            </GameOverOverlay>
          )}

          {loading && <div style={{ marginTop: '1rem' }}>Carregando...</div>}
        </GameBoardWrapper>
      </Container>
    </GameContainer>
  );
}