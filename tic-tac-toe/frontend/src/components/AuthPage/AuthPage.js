'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AuthContainer,
  AuthBox,
  Header,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Input,
  ErrorMessage,
  Button,
  ToggleContainer,
  ToggleButton,
} from './AuthPage.styles';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (error) {
      setError(error.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthBox>
        <Header>
          <Title>Jogo da Velha Multiplayer</Title>
          <Subtitle>
            {isLogin ? 'Entre na sua conta' : 'Crie uma nova conta'}
          </Subtitle>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </Button>
          </div>

          <ToggleContainer>
            <ToggleButton
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </ToggleButton>
          </ToggleContainer>
        </Form>
      </AuthBox>
    </AuthContainer>
  );
}