'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { FaTrophy, FaMedal, FaCrown } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  CardTitle,
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  RankIcon,
  PlayerInfo,
  StatusIndicator
} from './Leaderboard.styles';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  if (loading) return <p>Carregando ranking...</p>;
  if (error) return <p style={{color: 'red'}}>Erro ao carregar ranking: {error}</p>;

  const getRankIcon = (position) => {
    if (position === 1) return <RankIcon><FaCrown color="#f59e0b" /></RankIcon>;
    if (position === 2) return <RankIcon><FaMedal color="#a1a1aa" /></RankIcon>;
    if (position === 3) return <RankIcon><FaMedal color="#a16207" /></RankIcon>;
    return `${position}º`;
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle><FaTrophy /> Ranking dos Jogadores</CardTitle>
        </CardHeader>
        {leaderboard.length === 0 ? (
          <p>Nenhum jogador no ranking ainda.</p>
        ) : (
          <TableContainer>
            <Table>
              <Thead>
                <tr>
                  <Th>Posição</Th>
                  <Th>Jogador</Th>
                  <Th>Vitórias</Th>
                  <Th>Derrotas</Th>
                  <Th>Empates</Th>
                </tr>
              </Thead>
              <Tbody>
                {leaderboard.map((player, index) => (
                  <Tr key={player.id} $highlight={index < 3}>
                    <Td>{getRankIcon(index + 1)}</Td>
                    <Td>
                      <PlayerInfo>
                        <StatusIndicator $isOnline={player.isOnline} />
                        {player.username}
                      </PlayerInfo>
                    </Td>
                    <Td style={{color: '#16a34a', fontWeight: 500}}>{player.stats.wins}</Td>
                    <Td style={{color: '#dc2626', fontWeight: 500}}>{player.stats.losses}</Td>
                    <Td style={{color: '#f59e0b', fontWeight: 500}}>{player.stats.draws}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </div>
  );
}