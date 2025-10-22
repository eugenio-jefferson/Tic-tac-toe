import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import AuthPage from "../AuthPage";
import { useAuth } from "@/contexts/AuthContext";
import "@testing-library/jest-dom";

jest.mock("@/contexts/AuthContext");

describe("AuthPage", () => {
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
      register: mockRegister,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should handle login submission successfully", async () => {
    mockLogin.mockResolvedValueOnce({});
    render(<AuthPage />);

    fireEvent.change(screen.getByPlaceholderText(/nome de usuário/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "password");
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /entrar/i })
      ).not.toBeDisabled();
    });
  });
});
