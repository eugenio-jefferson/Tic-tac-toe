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

  const clearFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
        // Após cadastro: volta para Login e limpa os campos
        setIsLogin(true);
        clearFields();
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthBox>
        <Header>
          <Title>{isLogin ? 'Entrar' : 'Criar conta'}</Title>
          <Subtitle>
            {isLogin
              ? 'Acesse para jogar com outros usuários'
              : 'Crie sua conta para começar a jogar'}
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
              {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </Button>
          </div>

          <ToggleContainer>
            <ToggleButton
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                clearFields(); // limpa ao alternar
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
