'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { FaEnvelope, FaPaperPlane, FaUsers } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  CardTitle,
  ItemList,
  Item,
  UserInfo,
  StatusIndicator,
  Username,
  Timestamp,
  ButtonGroup,
  Button
} from './Lobby.styles';

export default function Lobby() {
  const { user } = useAuth();
  const {
    onlineUsers,
    pendingInvitations,
    sentInvitations,
    inviteUser,
    acceptInvitation,
    rejectInvitation,
  } = useGame();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInviteUser = async (userId) => {
    setLoading(true);
    setError('');
    try {
      await inviteUser(userId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    setLoading(true);
    setError('');
    try {
      await acceptInvitation(invitationId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    setLoading(true);
    setError('');
    try {
      await rejectInvitation(invitationId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableUsers = onlineUsers.filter(u => u.id !== user?.id);

  return (
    <div>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle><FaEnvelope /> Convites Recebidos</CardTitle>
          </CardHeader>
          <ItemList>
            {pendingInvitations.map((inv) => (
              <Item key={inv.id} $bgColor="#ebf4ff">
                <div>
                  <Username>{inv.fromUser.username} te convidou para jogar</Username>
                  <Timestamp>{new Date(inv.createdAt).toLocaleTimeString()}</Timestamp>
                </div>
                <ButtonGroup>
                  <Button onClick={() => handleAcceptInvitation(inv.id)} disabled={loading} className="success">Aceitar</Button>
                  <Button onClick={() => handleRejectInvitation(inv.id)} disabled={loading} className="danger">Recusar</Button>
                </ButtonGroup>
              </Item>
            ))}
          </ItemList>
        </Card>
      )}

      {sentInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle><FaPaperPlane /> Convites Enviados</CardTitle>
          </CardHeader>
          <ItemList>
            {sentInvitations.map((inv) => (
              <Item key={inv.id} $bgColor="#fefce8">
                  <p>Aguardando resposta de <strong>{inv.toUser.username}</strong></p>
              </Item>
            ))}
          </ItemList>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle><FaUsers /> Usuários Online ({availableUsers.length})</CardTitle>
        </CardHeader>
        {availableUsers.length === 0 ? (
          <p>Nenhum outro usuário online.</p>
        ) : (
          <ItemList>
            {availableUsers.map((u) => {
              const hasSentInvitation = sentInvitations.some(inv => inv.toUserId === u.id);
              return (
                <Item key={u.id}>
                  <UserInfo>
                    <StatusIndicator />
                    <Username>{u.username}</Username>
                  </UserInfo>
                  <Button onClick={() => handleInviteUser(u.id)} disabled={loading || hasSentInvitation} className="primary">
                    {hasSentInvitation ? 'Enviado' : 'Convidar'}
                  </Button>
                </Item>
              );
            })}
          </ItemList>
        )}
      </Card>
    </div>
  );
}