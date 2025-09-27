'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import Lobby from '../Lobby/Lobby';
import GameBoard from '../GameBoard/GameBoard';
import Leaderboard from '../Leaderboard/Leaderboard';
import { FaHome, FaTrophy } from 'react-icons/fa';
import {
  DashboardContainer,
  Header,
  HeaderContent,
  Title,
  UserInfo,
  LogoutButton,
  Nav,
  NavContent,
  TabButton,
  Main,
} from './Dashboard.styles';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('lobby');
  const { user, logout } = useAuth();
  const { currentGame } = useGame();

  if (currentGame) {
    return <GameBoard />;
  }

  const tabs = [
    { id: 'lobby', name: 'Lobby', icon: <FaHome /> },
    { id: 'leaderboard', name: 'Ranking', icon: <FaTrophy /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lobby':
        return <Lobby />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <Lobby />;
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Title>Jogo da Velha Multiplayer</Title>
          <UserInfo>
            <span>
              Olá, <strong>{user?.username}</strong>
            </span>
            <LogoutButton onClick={logout}>Sair</LogoutButton>
          </UserInfo>
        </HeaderContent>
      </Header>

      <Nav>
        <NavContent>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              $active={activeTab === tab.id}
            >
              {tab.icon}
              {tab.name}
            </TabButton>
          ))}
        </NavContent>
      </Nav>

      <Main>
        {renderContent()}
      </Main>
    </DashboardContainer>
  );
}