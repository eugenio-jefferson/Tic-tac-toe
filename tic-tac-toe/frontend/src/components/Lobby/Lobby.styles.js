import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const CardHeader = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Item = styled.div.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: ${({ $bgColor }) => $bgColor || '#f9fafb'};
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #22c55e;
`;

export const Username = styled.p`
  font-weight: 500;
  color: #1f2937;
`;

export const Timestamp = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary { background-color: #3498db; color: white; }
  &.primary:hover { background-color: #2980b9; }
  &.success { background-color: #2ecc71; color: white; }
  &.success:hover { background-color: #27ae60; }
  &.danger { background-color: #e74c3c; color: white; }
  &.danger:hover { background-color: #c0392b; }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;