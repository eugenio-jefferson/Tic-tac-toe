import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

export const AuthBox = styled.div`
  max-width: 28rem;
  width: 100%;
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
  font-size: 0.875rem;
  color: #4b5563;
`;

export const Form = styled.form`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
`;

export const InputGroup = styled.div`
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  input:first-child {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  input:last-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

export const Input = styled.input`
  appearance: none;
  position: relative;
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  color: #111827;
  
  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #4f46e5;
    z-index: 10;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
`;

export const Button = styled.button`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: #4f46e5;
  cursor: pointer;
  
  &:hover {
    background-color: #4338ca;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ToggleContainer = styled.div`
    text-align: center;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  
  &:hover {
    color: #4338ca;
    text-decoration: underline;
  }
`;