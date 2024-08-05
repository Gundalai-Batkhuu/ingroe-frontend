import React from 'react';
import LoginForm from '../components/login-form';

const LoginPage: React.FC = () => {
  return (
    <main className="flex flex-col p-4 my-20">
      <LoginForm />
    </main>
  );
};

export default LoginPage;