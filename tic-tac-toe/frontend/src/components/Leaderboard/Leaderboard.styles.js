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

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  min-width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background-color: #f9fafb;
`;

export const Th = styled.th`
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Tbody = styled.tbody`
  background-color: white;
  & tr {
    border-bottom: 1px solid #e5e7eb;
  }
`;

export const Tr = styled.tr`
  background-color: ${({ $highlight }) => $highlight ? '#fefce8' : 'transparent'};
`;

export const Td = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
`;

export const RankIcon = styled.span`
  font-size: 1.25rem;
`;

export const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $isOnline }) => $isOnline ? '#22c55e' : '#9ca3af'};
`;