// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { ToastContainer } from 'react-toastify';
// import UserInfo from './UserInfo';
// import { BrowserRouter as Router } from 'react-router-dom';
// import agent from '../../../app/api/agent';

// // Mock dependencies
// jest.mock('../Authentication/authProvider', () => ({
//   useAuth: jest.fn(),
// }));
// jest.mock('../../../app/api/agent', () => ({
//   Account: {
//     current: jest.fn(),
//     updateUser: jest.fn(),
//   },
// }));

// describe('UserInfo Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders form fields correctly', () => {
//     render(
//       <Router>
//         <UserInfo />
//       </Router>
//     );

//     expect(screen.getByLabelText('تغییر نام کاربری')).toBeInTheDocument();
//     expect(screen.getByLabelText('تغییر نام')).toBeInTheDocument();
//     expect(screen.getByLabelText('تغییر نام خانوادگی')).toBeInTheDocument();
//     expect(screen.getByLabelText('تغییر ایمیل')).toBeInTheDocument();
//   });

//   test('submits form with valid data', async () => {
//     (agent.Account.updateUser as jest.Mock).mockResolvedValue({});
//     render(
//       <Router>
//         <ToastContainer />
//         <UserInfo />
//       </Router>
//     );

//     fireEvent.change(screen.getByLabelText('تغییر نام کاربری'), {
//       target: { value: 'newUsername' },
//     });

//     fireEvent.click(screen.getByText('ذخیره تغییرات'));

//     await waitFor(() =>
//       expect(agent.Account.updateUser).toHaveBeenCalledWith(
//         expect.objectContaining({
//           userName: 'newUsername',
//         })
//       )
//     );

//     expect(screen.getByText('پروفایل با موفقیت به‌روز شد')).toBeInTheDocument();
//   });

//   test('shows error on form submission failure', async () => {
//     (agent.Account.updateUser as jest.Mock).mockRejectedValue(new Error());
//     render(
//       <Router>
//         <ToastContainer />
//         <UserInfo />
//       </Router>
//     );

//     fireEvent.click(screen.getByText('ذخیره تغییرات'));

//     await waitFor(() =>
//       expect(screen.getByText('خطا در به‌روزرسانی پروفایل')).toBeInTheDocument()
//     );
//   });
// });
