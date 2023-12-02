// Author: xmrazf00

"use client";

import { BEURL } from "@components/constants";
import React, {SyntheticEvent, useState} from "react";

// Data structure of error response
interface ErrorResponse {
    error: string;
  }
  
export default function Login(){

    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [signLog, setSignLog] = useState('');

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BEURL}/api/login`,{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if(response.status === 200){
                localStorage.setItem('username', `${username}`);
                window.location.href = '/';
            }
            if(response.status === 400){
                const data: ErrorResponse = await response.json()
                setSignLog(data.error)
                // If password was wrong clear password input
                if(data.error == "Incorrect password!"){
                    setPassword('');
                }
            }
        }catch(error){
            console.error("Error: ", error);
        }
    }

    return (
        <section className="bg-bgcolor-light dark:bg-bgcolor-dark">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Log in
                </h1>
                <form onSubmit={submit} className="space-y-4 md:space-y-6">
                    <div>
                        <input placeholder="Username"
                        onChange={e => setUsername(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <input type="password" placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>   
                    <p className="text-red-500">{signLog}</p> 
                    <button 
                        type="submit"
                        className="disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" 
                        >
                        Log in
                        </button>
                </form>
            </div>
            </div>
            </div>
        </section>
    )
}