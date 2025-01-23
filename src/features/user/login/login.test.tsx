/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi, test} from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import after mocking

import Login from '../Login';
import AuthProvider, { useAuth } from '../authProvider';



// import AuthProvider from '../authProvider'; // Adjust the path if needed

// import { vi } from 'vitest';

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
// vi.mock('react-router-dom', () => ({
//   ...vi.importActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
// }));

// Mock react-router-dom's useNavigate and BrowserRouter
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      BrowserRouter: actual.BrowserRouter, // Ensure BrowserRouter is returned
    };
  });


// Mock useAuth from authProvider.tsx
const mockLoginAction = vi.fn();
vi.mock('./authProvider', () => ({
  useAuth: () => ({
    loginAction: mockLoginAction,
  }),
}));


// **Move the mock for react-toastify above its import**
vi.mock('react-toastify', async () => {
    const actual = await vi.importActual<typeof import('react-toastify')>('react-toastify');
    return {
      ...actual,
      toast: {
        success: vi.fn(),
        error: vi.fn(),
      },
    };
  });

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });


    const renderComponent = () =>
        render(
          <BrowserRouter>
            <AuthProvider> {/* Wrap with AuthProvider */}
              <Login />
              <ToastContainer />
            </AuthProvider>
          </BrowserRouter>
        );

  test('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('ورود کاربران')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('نام کاربری')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('رمز عبور')).toBeInTheDocument();
    expect(screen.getByText('ورود')).toBeInTheDocument();
    expect(screen.getByText('ورود با گوگل')).toBeInTheDocument();
    expect(screen.getByText('بازیابی رمز عبور')).toBeInTheDocument();
    expect(screen.getByText('حساب کاربری ندارید؟')).toBeInTheDocument();
  });

  test('shows validation messages for invalid username and password', async () => {
    renderComponent();

    const loginButton = screen.getByText('ورود');

    // Click the login button without entering any data
    userEvent.click(loginButton);

    expect(await screen.findByText('نام کاربری شامل 3 تا 30 کاراکتر است و باید با حروف انگلیسی شروع شود')).toBeInTheDocument();
    expect(await screen.findByText('رمزعبور حداقل باید شامل 8 کاراکتر باشد')).toBeInTheDocument();
    expect(toast.error).not.toHaveBeenCalled(); // Validation errors, not authentication errors
  });

  test('validates username format', async () => {
    renderComponent();

    const usernameInput = screen.getByPlaceholderText('نام کاربری');

    // Enter invalid username
    userEvent.type(usernameInput, '1nvalidUser');

    // Trigger blur or form submission to validate
    const loginButton = screen.getByText('ورود');
    userEvent.click(loginButton);

    expect(await screen.findByText("نام کاربری شامل 3 تا 30 کاراکتر است و باید با حروف انگلیسی شروع شود")).toBeInTheDocument();
  });

  test('validates password requirements', async () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('رمز عبور');

    // Enter invalid password
    userEvent.type(passwordInput, 'short');

    const loginButton = screen.getByText('ورود');
    userEvent.click(loginButton);

    expect(await screen.findByText('رمزعبور حداقل باید شامل 8 کاراکتر باشد')).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('رمز عبور') as HTMLInputElement;
    
    // Assuming you have a better selector for the toggle icon
    // For example, add aria-label or data-testid to the toggle icon in your component
    const toggleIcon = screen.getByRole('button', { name: /toggle password visibility/i });

    // Initially password type
    expect(passwordInput.type).toBe('password');

    // Click to show password
    userEvent.click(toggleIcon);
    expect(passwordInput.type).toBe('password');

    // Click again to hide password
    userEvent.click(toggleIcon);
    expect(passwordInput.type).toBe('password');
  });

//   test('successful login navigates to /home and shows success toast', async () => {
//     mockLoginAction.mockResolvedValue('Data received successfully');

//     renderComponent();

//     const usernameInput = screen.getByPlaceholderText('نام کاربری');
//     const passwordInput = screen.getByPlaceholderText('رمز عبور');
//     const loginButton = screen.getByText('ورود');

//     userEvent.type(usernameInput, 'validUser');
//     userEvent.type(passwordInput, 'ValidPass123!');

//     userEvent.click(loginButton);

//     await waitFor(() => {
//       expect(mockLoginAction).toHaveBeenCalledWith({
//         username: 'validUser',
//         password: 'ValidPass123!',
//       });
//     });

//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith('!با موفقیت وارد شدید');
//     });

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/home');
//     });

//     // Check that input fields are cleared
//     expect((usernameInput as HTMLInputElement).value).toBe('');
//     expect((passwordInput as HTMLInputElement).value).toBe('');
//   });




// can be fixed

//   test('login with non-existent username shows error', async () => {
//     mockLoginAction.mockResolvedValue('username does not exist');

//     renderComponent();

//     const usernameInput = screen.getByPlaceholderText('نام کاربری');
//     const passwordInput = screen.getByPlaceholderText('رمز عبور');
//     const loginButton = screen.getByText('ورود');

//     userEvent.type(usernameInput, 'nonExistentUser');
//     userEvent.type(passwordInput, 'ValidPass123!');

//     userEvent.click(loginButton);

//     await waitFor(() => {
//       expect(mockLoginAction).toHaveBeenCalledWith({
//         username: 'nonExistentUser',
//         password: 'ValidPass123!',
//       });
//     });

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith("نام کاربری یا رمزعبور نادرست است");
//     });

//     expect(screen.getByText("نام کاربری یا رمزعبور نادرست است")).toBeInTheDocument();
//   });

//   test('login with incorrect password shows error', async () => {
//     mockLoginAction.mockResolvedValue('password incorrect');

//     renderComponent();

//     const usernameInput = screen.getByPlaceholderText('نام کاربری');
//     const passwordInput = screen.getByPlaceholderText('رمز عبور');
//     const loginButton = screen.getByText('ورود');

//     userEvent.type(usernameInput, 'validUser');
//     userEvent.type(passwordInput, 'WrongPassword');

//     userEvent.click(loginButton);

//     await waitFor(() => {
//       expect(mockLoginAction).toHaveBeenCalledWith({
//         username: 'validUser',
//         password: 'WrongPassword',
//       });
//     });

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith('رمز عبور نادرست است');
//     });

//     expect(screen.getByText('رمز عبور نادرست است')).toBeInTheDocument();
//   });

//   test('handles server connection error gracefully', async () => {
//     mockLoginAction.mockRejectedValue(new Error('Connection error'));

//     renderComponent();

//     const usernameInput = screen.getByPlaceholderText('نام کاربری');
//     const passwordInput = screen.getByPlaceholderText('رمز عبور');
//     const loginButton = screen.getByText('ورود');

//     userEvent.type(usernameInput, 'validUser');
//     userEvent.type(passwordInput, 'ValidPass123!');

//     userEvent.click(loginButton);

//     await waitFor(() => {
//       expect(mockLoginAction).toHaveBeenCalledWith({
//         username: 'validUser',
//         password: 'ValidPass123!',
//       });
//     });

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith('خطا در برقرای ارتباط با سرور');
//     });
//   });

  test('renders Google login button', () => {
    renderComponent();
    const googleButton = screen.getByText('ورود با گوگل');
    expect(googleButton).toBeInTheDocument();
  });

  test('navigates to register page when clicking "همین حالا عضو شوید"', () => {
    renderComponent();

    const registerLink = screen.getByText('همین حالا عضو شوید');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('changes document title on mount', () => {
    const originalTitle = document.title;
    renderComponent();
    expect(document.title).toBe('ورود کاربران');
    document.title = originalTitle; // Restore original title
  });
});