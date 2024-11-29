import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'

import { ToastContainer } from 'react-toastify';
import ChangePassword from './ChangePassword';
import agent from '../../../app/api/agent';

jest.mock('../../../app/api/agent', () => ({
  Account: {
    updatePassword: jest.fn(),
  },
}));

describe('ChangePassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<ChangePassword />);

    expect(screen.getByLabelText('رمز عبور فعلی')).toBeInTheDocument();
    expect(screen.getByLabelText('رمز عبور جدید')).toBeInTheDocument();
    expect(screen.getByLabelText('تکرار رمز عبور')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    (agent.Account.updatePassword as jest.Mock).mockResolvedValue({});
    render(
      <>
        <ToastContainer />
        <ChangePassword />
      </>
    );

    fireEvent.change(screen.getByLabelText('رمز عبور فعلی'), {
      target: { value: 'oldPassword123' },
    });
    fireEvent.change(screen.getByLabelText('رمز عبور جدید'), {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(screen.getByLabelText('تکرار رمز عبور'), {
      target: { value: 'newPassword123' },
    });

    fireEvent.click(screen.getByText('ذخیره تغییرات'));

    await waitFor(() =>
      expect(agent.Account.updatePassword).toHaveBeenCalledWith({
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      })
    );

    expect(screen.getByText('پروفایل با موفقیت به‌روز شد')).toBeInTheDocument();
  });

  test('shows error on password mismatch', async () => {
    render(<ChangePassword />);

    fireEvent.change(screen.getByLabelText('رمز عبور جدید'), {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(screen.getByLabelText('تکرار رمز عبور'), {
      target: { value: 'differentPassword' },
    });

    fireEvent.click(screen.getByText('ذخیره تغییرات'));

    expect(screen.getByText('رمزهای عبور مطابقت ندارند')).toBeInTheDocument();
  });
});
