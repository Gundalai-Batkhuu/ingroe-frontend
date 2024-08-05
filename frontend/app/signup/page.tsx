import React from 'react';
import SignupForm from '../components/signup-form';

const SignupPage: React.FC = () => {
  return (
    <main className="flex flex-col p-4 my-20">
      <SignupForm />
    </main>
  );
};

export default SignupPage;