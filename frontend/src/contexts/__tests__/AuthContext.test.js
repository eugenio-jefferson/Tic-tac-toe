import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { apiClient } from '@/lib/api';
import { socketClient } from '@/lib/socket';

jest.mock('@/lib/api');
jest.mock('@/lib/socket');

let capturedAuth;
const TestComponent = () => {
  const auth = useAuth();
  capturedAuth = auth;
  return (
    <div>
      <span data-testid="loading">{auth.loading.toString()}</span>
      <span data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</span>
      <span data-testid="username">{auth.user ? auth.user.username : 'null'}</span>
      <button onClick={() => auth.login('user', 'pass')}>Login</button>
      <button onClick={() => auth.register('user', 'pass')}>Register</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedAuth = null;
  });

  it('should provide initial loading state and then false after checkAuthStatus', async () => {
    apiClient.getToken.mockReturnValue(null);
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('should handle login failure', async () => {
    apiClient.login.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    
    await expect(capturedAuth.login('user', 'pass')).rejects.toThrow('Invalid credentials');
    
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('should handle register failure', async () => {
    apiClient.register.mockRejectedValue(new Error('Registration failed'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await expect(capturedAuth.register('user', 'pass')).rejects.toThrow('Registration failed');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });
});