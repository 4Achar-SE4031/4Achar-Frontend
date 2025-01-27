import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from '../login/authProvider';
import Verification from './Verification'; // فایل کامپوننت Verification
import { vi } from 'vitest';
import  checkVerificationCode  from './Verification'; // فرض کنید این تابع در کامپوننت Verification قرار دارد
import axios from 'axios';
import { toast } from 'react-toastify';


// Helper function to render the component inside AuthProvider
const renderWithAuthProvider = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
};

describe('Verification Component', () => {
  it('should display the "تایید کد" button', () => {
    renderWithAuthProvider(<Verification />);

    // یافتن دکمه تایید کد در کامپوننت
    const confirmButton = screen.getByRole('button', { name: /تایید کد/i });

    // بررسی کنید که دکمه تایید کد در صفحه وجود دارد
    expect(confirmButton).toBeInTheDocument();
  });


});
