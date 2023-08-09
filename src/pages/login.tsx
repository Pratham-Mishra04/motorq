import configuredAxios from '@/config/axios';
import postHandler from '@/handlers/postHandler';
import { Role } from '@/types';
import { AxiosError } from 'axios';
import { setCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ExampleV3(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async () => {
    const formData = {
      email,
      password,
    };

    const res = await postHandler('/auth/login', formData);
    if (res.statusCode == 201) {
      toast.success('Logged In');
      setCookies('token', res.data.token);
      setCookies('role', res.data.role);
      var pushURL = '/';
      if (res.data.role == Role.ADMIN) pushURL = '/admin';
      else if (res.data.role == Role.APPROVER) pushURL = '/approver';
      else if (res.data.role == Role.REQUESTER) pushURL = '/requester';
      router.push(pushURL);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <div className="h-screen">
      <div className="w-1/4 max-md:w-full flex flex-col h-80 gap-2 m-auto px-6 py-24">
        <div className="w-full text-center text-3xl">Log In</div>
        <input
          className="bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(el) => setEmail(el.target.value)}
        />
        <input
          className="bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(el) => setPassword(el.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-1/3 m-auto bg-slate-50 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl font-Inconsolata text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
