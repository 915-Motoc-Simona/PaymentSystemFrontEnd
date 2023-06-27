import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import User from './components/User';
import RegisterUserForm from './components/RegisterUserForm';
import Login from './components/Login';
import UserRequests from './components/UserRequests';
import Account from './components/Account';
import RegisterAccountForm from './components/RegisterAccountForm';
import AccountRequests from './components/AccountRequests';
import Payment from './components/Payment';
import RegisterPaymentForm from './components/RegisterPaymentForm';
import TransferForm from './components/TransferForm';
import PaymentRequests from './components/PaymentRequests';
import Sidebar from './navigation/Sidebar';
import Analytics from './components/Analytics';
import PaymentRequestsClient from './components/PaymentRequestsClient';
import TransferPaypal from './components/TransferPaypal';

function App() {
      return(
            <Router>
                <Sidebar />
              <Routes>
                <Route path='/' exact element={<Home/>} />
                <Route path='/users' element={<User/>} />
                <Route path='/users/register' element={<RegisterUserForm/>} />
                <Route path='/users/approve' element={<UserRequests/>} />
                <Route path='/accounts' element={<Account/>} />
                <Route path='/accounts/register' element={<RegisterAccountForm/>} />
                <Route path='/accounts/approve' element={<AccountRequests/>} />
                <Route path='/payments' element={<Payment/>} />
                <Route path='/payments/register' element={<RegisterPaymentForm/>} />
                <Route path='/payments/transfer' element={<TransferForm/>} />
                <Route path='/payments/requests' element={<PaymentRequests/>} />
                <Route path='/authentication/signin' element={<Login/>}></Route>
                <Route path='/analytics' element={<Analytics/>}></Route>
                <Route path='/payments/request/approve/client' element={<PaymentRequestsClient/>}></Route>
                <Route path='/payments/paypal' element={<TransferPaypal/>}></Route>
              </Routes>
            </Router>
        )
}

export default App;
