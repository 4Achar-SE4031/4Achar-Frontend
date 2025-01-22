import  AuthProvider  from '../../features/user/login/authProvider';
import { ThemeProvider } from '@mui/material/styles'; // Example of other providers
// import theme from '../../app/theme'; // Replace with your theme

export function TestProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* <ThemeProvider theme={theme}> */}
        {children}
      {/* </ThemeProvider> */}
    </AuthProvider>
  );
}
