import configuredAxios from '@/config/axios';
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
        try {
            const res = await configuredAxios.post('/auth/login', formData);
            if (res.status == 201) {
                setCookies('token', res.data.token);
                router.push('/');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error('Internal Server Error');
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
                    className="w-1/3 m-auto bg-slate-100 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl font-Inconsolata text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
