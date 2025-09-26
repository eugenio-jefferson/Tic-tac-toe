import styled, { keyframes } from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff, #f9fafb);
  padding: 3rem 1rem;
`;

export const AuthBox = styled.div`
  max-width: 28rem;
  width: 100%;
  padding: 2rem;
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h2`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
`;

export const Subtitle = styled.p`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #6b7280;
`;

export const Form = styled.form`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  input:first-child {
    border-bottom: none;
  }
`;

export const Input = styled.input`
  appearance: none;
  position: relative;
  display: block;
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  color: #111827;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: #f9fafb;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
    z-index: 10;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
  margin-top: -0.5rem;
`;

export const Button = styled.button`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 0.5rem;
  color: white;
  background: linear-gradient(135deg, #6366f1, #4338ca);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #4f46e5, #3730a3);
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ToggleContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #4f46e5;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #3730a3;
    text-decoration: underline;
  }
`;

const toastIn = keyframes`
  0%   { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0);   opacity: 1; }
`;
const toastBar = keyframes`
  from { width: 100%; }
  to   { width: 0%; }
`;

export const ToastCorner = styled.div`
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none; /* não bloqueia cliques na página */
`;

export const ToastCard = styled.div`
  pointer-events: auto;
  min-width: 280px;
  max-width: 360px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 28px rgba(0,0,0,0.12);
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 40px 1fr auto;
  grid-template-rows: auto auto;
  grid-column-gap: 12px;
  align-items: center;
  animation: ${toastIn} 180ms ease-out;
`;

export const ToastIconCircle = styled.div`
  grid-row: 1 / span 2;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 2px solid #16a34a;   /* verde */
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const ToastTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #065f46;              /* verde escuro */
  line-height: 1.2;
`;

export const ToastMessage = styled.div`
  font-size: 0.85rem;
  color: #065f46;
  opacity: 0.9;
`;

export const ToastAction = styled.button`
  grid-row: 2 / 3;
  align-self: end;
  border: none;
  background: #16a34a;
  color: #ffffff;
  font-size: 0.8rem;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(0.95);
  }
`;

export const ToastTimer = styled.div`
  grid-column: 1 / -1;
  height: 3px;
  margin-top: 10px;
  background: #dcfce7;
  position: relative;
  border-radius: 999px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    background: #16a34a;
    width: 100%;
    animation: ${toastBar} 2.6s linear forwards;
  }
`;
