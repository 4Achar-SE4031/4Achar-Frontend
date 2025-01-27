import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides helpful matchers.
import { vi } from 'vitest';
import UserInfo from './UserInfo';
import { BrowserRouter } from 'react-router-dom';
import agent from "../../../app/api/agent"
import '@testing-library/jest-dom';


vi.mock('react-toastify', async () => {
  const actual = await vi.importActual('react-toastify');
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn()
    },
    ToastContainer: vi.fn(() => null)
  };
});

// vi.mock('react-multi-date-picker', () => ({
//   default: () => <div>Mock DatePicker</div>,
// }));

// vi.mock('react-date-object/calendars/persian', () => ({}));
// vi.mock('react-date-object/locales/persian_fa', () => ({}));

vi.mock('../../../app/api/agent', () => ({
  default: {
    Account: {
      current: vi.fn().mockResolvedValue({
        userName: 'testUser',
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        // gender: 'M',
        // birthDate: '2000-01-01',
        // province: 'Tehran',
        // city: 'Tehran',
        // profilePictureUrl: '',
      }),
      updateUser: vi.fn().mockResolvedValue({}),
    },
  }
}));

import { toast } from 'react-toastify';
import { TestProvider } from '../../events/testProvider';
import { SearchProvider } from '../../Search/searchStatus';

describe('UserInfo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders the user information form', async () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <SearchProvider>
            <UserInfo />
          </SearchProvider>
        </TestProvider>
      </BrowserRouter>
    );

    expect(await screen.findByText('مشخصات فردی')).toBeInTheDocument();
    expect(screen.getByLabelText('تغییر نام کاربری')).toBeInTheDocument();
    expect(screen.getByLabelText('تغییر نام')).toBeInTheDocument();
    expect(screen.getByLabelText('تغییر نام خانوادگی')).toBeInTheDocument();
    expect(screen.getByLabelText('تغییر ایمیل')).toBeInTheDocument();
  });

  it('displays user data fetched from the API', async () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <SearchProvider>
            <UserInfo />
          </SearchProvider>
        </TestProvider>
      </BrowserRouter>
    );

    expect(await screen.findByDisplayValue('testUser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('testuser@example.com')).toBeInTheDocument();
  });

  it('shows error messages for invalid form inputs', async () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <SearchProvider>
            <UserInfo />
          </SearchProvider>
        </TestProvider>
      </BrowserRouter>
    );

    const emailInput = await screen.findByLabelText('تغییر ایمیل');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    fireEvent.blur(emailInput);

    await waitFor(() =>
      expect(screen.getByText('فرمت ایمیل نادرست است')).toBeInTheDocument()
    );
  });

  it('calls the updateUser API on form submission', async () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <SearchProvider>
            <UserInfo />
          </SearchProvider>
        </TestProvider>
      </BrowserRouter>
    );

    const userNameInput = await screen.findByLabelText('تغییر نام کاربری');
    const firstNameInput = screen.getByLabelText('تغییر نام');
    const lastNameInput = screen.getByLabelText('تغییر نام خانوادگی');
    const emailInput = screen.getByLabelText('تغییر ایمیل');
    const submitButton = screen.getByText('ذخیره تغییرات');

    fireEvent.change(userNameInput, { target: { value: 'newUser' } });
    fireEvent.change(firstNameInput, { target: { value: 'New' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });

    fireEvent.click(submitButton);
    const { Account } = agent;


    await waitFor(() =>
      expect(Account.updateUser).toHaveBeenCalledWith({
        userName: 'newUser',
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
      })
    );
  });

  it('shows success toast on successful form submission', async () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <SearchProvider>
            <UserInfo />
          </SearchProvider>
        </TestProvider>
      </BrowserRouter>
    );

    const submitButton = await screen.findByText('ذخیره تغییرات');
    fireEvent.click(submitButton);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('پروفایل با موفقیت به‌روز شد'));
  });

  it('shows error toast on API error during form submission', async () => {
    const { Account } = vi.mocked(agent);
    vi.mocked(Account.updateUser).mockRejectedValueOnce(new Error('API error'));

    // const toast = require('react-toastify').toast;
    render(
      <BrowserRouter>
        <TestProvider>
          <SearchProvider>
            <UserInfo />
          </SearchProvider>
        </TestProvider>
      </BrowserRouter>
    );

    const submitButton = await screen.findByText('ذخیره تغییرات');
    fireEvent.click(submitButton);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('خطا در به‌روزرسانی پروفایل'));
  });
});
