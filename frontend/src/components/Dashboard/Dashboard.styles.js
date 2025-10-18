// src/components/Dashboard.styles.js
import styled from "styled-components";

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

export const Header = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const HeaderContent = styled.div`
  max-width: 80rem;
  margin: auto;
  padding: 1.5rem 1rem 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Image = styled.img`
  height: 50px;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: rgba(33, 36, 39, 1);
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #000000ff;
`;

export const LogoutButton = styled.button`
  background-color: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background-color: #4b5563;
  }
`;

export const Nav = styled.nav`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
`;

export const NavContent = styled.div`
  max-width: 80rem;
  margin: auto;
  padding: 0 1rem;
  display: flex;
  gap: 2rem;
`;

export const TabButton = styled.button`
  padding: 1rem 0.25rem 0.25rem 0.25rem;
  border: none;
  border-bottom: 3px solid;
  font-weight: 500;
  font-size: 0.875rem;
  border-color: ${({ $active }) => ($active ? "#4f46e5" : "transparent")};
  color: ${({ $active }) => ($active ? "#4f46e5" : "#6b7280")};
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #4b5563;
    border-color: #d1d5db;
    border: none;
    border-bottom: 3px solid #d1d5db;
  }
`;

export const Main = styled.main`
  max-width: 80rem;
  margin: auto;
  padding: 1.5rem 1rem;
  color: #000000ff;
`;
