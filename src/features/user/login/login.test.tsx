import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './authProvider';
import { MemoryRouter } from 'react-router-dom';

// Mock auth context
vi.mock('./authProvider');


describe('Login Component', () => {
  it('renders login form correctly', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Check if the login form is rendered
    expect(screen.getByPlaceholderText('نام کاربری')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('رمز عبور')).toBeInTheDocument();
    expect(screen.getByText('ورود')).toBeInTheDocument();
  });

  it('shows validation message when username is invalid', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const usernameInput = screen.getByPlaceholderText('نام کاربری');
    const loginButton = screen.getByText('ورود');

    fireEvent.change(usernameInput, { target: { value: 'ab' } }); // Invalid username
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('نام کاربری شامل 3 تا 30 کاراکتر است و باید با حروف انگلیسی شروع شود')).toBeInTheDocument();
    });
  });

  it('shows validation message when password is invalid', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const passwordInput = screen.getByPlaceholderText('رمز عبور');
    const loginButton = screen.getByText('ورود');

    fireEvent.change(passwordInput, { target: { value: '123' } }); // Invalid password
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('رمزعبور حداقل باید شامل 8 کاراکتر باشد')).toBeInTheDocument();
    });
  });

  it('calls loginAction with valid username and password', async () => {
    const mockLoginAction = vi.fn().mockResolvedValue('Data received successfully');
    (useAuth as vi.Mock).mockReturnValue({
      loginAction: mockLoginAction,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/نام کاربری/i), { target: { value: 'validUsername' } });
    fireEvent.change(screen.getByPlaceholderText(/رمز عبور/i), { target: { value: 'ValidPassword123!' } });

    fireEvent.click(screen.getByRole('button', { name: /ورود/i }));

    await waitFor(() => expect(mockLoginAction).toHaveBeenCalledWith({
      username: 'validUsername',
      password: 'ValidPassword123!',
    }));
  });

  it('displays toast notification on successful login', async () => {
    const mockLoginAction = vi.fn().mockResolvedValue('Data received successfully');
    (useAuth as vi.Mock).mockReturnValue({
      loginAction: mockLoginAction,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/نام کاربری/i), { target: { value: 'validUsername' } });
    fireEvent.change(screen.getByPlaceholderText(/رمز عبور/i), { target: { value: 'ValidPassword123!' } });

    fireEvent.click(screen.getByRole('button', { name: /ورود/i }));

    await waitFor(() => expect(screen.getByText(/با موفقیت وارد شدید/i)).toBeInTheDocument());
  });
});
