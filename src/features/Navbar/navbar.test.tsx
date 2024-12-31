import { render, screen } from '@testing-library/react';
import  AuthProvider  from '../user/login/authProvider';
import Navbar from './navbar';
import { BrowserRouter } from 'react-router-dom';

// Helper function to render the component inside AuthProvider
const renderWithAuthProvider = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  it('renders the logo', () => {
    // Render the Navbar component within the AuthProvider context
    const { getByAltText } = renderWithAuthProvider(<Navbar />);
    // Check if the logo is rendered
    expect(getByAltText('Logo')).toBeInTheDocument();
  });
});
