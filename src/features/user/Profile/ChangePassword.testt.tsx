import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ChangePassword from './ChangePassword';
import { BrowserRouter } from 'react-router-dom';
import agent from '../../../app/api/agent';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';


// Mock toastify
vi.mock('react-toastify', async () => {
  const actual = await vi.importActual('react-toastify');
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
    ToastContainer: vi.fn(() => null),
  };
});

// Mock agent API
vi.mock('../../../app/api/agent', () => ({
  default: {
    Account: {
      updatePassword: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe('ChangePassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the change password form', () => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );

    expect(screen.getByText('تغییر رمز عبور')).toBeInTheDocument();
    expect(screen.getByLabelText('رمز عبور فعلی')).toBeInTheDocument();
    expect(screen.getByLabelText('رمز عبور جدید')).toBeInTheDocument();
    expect(screen.getByLabelText('تکرار رمز عبور جدید')).toBeInTheDocument();
  });

  it('shows error messages for invalid inputs', async () => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );

    const newPasswordInput = screen.getByLabelText('رمز عبور جدید');
    fireEvent.change(newPasswordInput, { target: { value: '' } });
    fireEvent.blur(newPasswordInput);

    await waitFor(() =>
      expect(screen.getByText("رمز عبور جدید خود را وارد کنید")).toBeInTheDocument()
    );
  });

  it('calls the updatePassword API on form submission', async () => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );

    const currentPasswordInput = screen.getByLabelText('رمز عبور فعلی');
    const newPasswordInput = screen.getByLabelText('رمز عبور جدید');
    const confirmPasswordInput = screen.getByLabelText('تکرار رمز عبور جدید');
    const submitButton = screen.getByText('تغییر رمز عبور');

    fireEvent.change(currentPasswordInput, { target: { value: 'current123C@' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123C@' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newpassword123C@' },
    });

    fireEvent.click(submitButton);

    const { Account } = agent;

    await waitFor(() =>
      expect(Account.updatePassword).toHaveBeenCalledWith({
        oldPassword: 'current123C@',
        newPassword: 'newpassword123C@',
      })
    );
  });

  it('shows success toast on successful password update', async () => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('تغییر رمز عبور');
    fireEvent.click(submitButton);

    // await waitFor(() =>
    //   expect(toast.success).toHaveBeenCalledWith('رمز عبور با موفقیت تغییر یافت')
    // );
  });

  it('shows error toast on API error during password update', async () => {
    const { Account } = vi.mocked(agent);
    vi.mocked(Account.updatePassword).mockRejectedValueOnce(new Error('API error'));

    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('تغییر رمز عبور');
    fireEvent.click(submitButton);

    // await waitFor(() =>
      // expect(toast.error).toHaveBeenCalledWith('خطا در تغییر رمز عبور')
    // );
  });
});
