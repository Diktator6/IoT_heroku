// Author: xmrazf00

"use client";

import {ChangeEvent, SyntheticEvent, useState} from "react";
import { useRouter } from "next/navigation";
import { BEURL } from "@components/constants";


function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [signLog, setSignLog] = useState('');
    const router = useRouter();
    // password checkers
    const [isUpper, setIsUpper] = useState(false);
    const [isLower, setIsLower] = useState(false);
    const [isNum, setIsNum] = useState(false);
    const [isLen, setIsLen] = useState(false);
    
    const submitRequest = async (e: SyntheticEvent) => {
        e.preventDefault();  
    
        try {
            const response = await fetch(`${BEURL}/api/register`,{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if(response.status === 201){
                router.push('/login');
            }
            if(response.status === 400){
                setSignLog("Username already exists! Choose diffrent username.")
            }
        }catch(error){
            console.error("Error: ", error);
        }
    }

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        if(username.length < 3){
            setSignLog("User name needs to be at least 3 character longs!");
            return;
        }
        if(password != rePassword){
            setSignLog("Passwords do not match!");
            setRePassword('');
            return;
        }

        submitRequest(e);
    }

    const checkPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
      
        setPassword((prevPassword) => {
          setIsLen((prevPassword.length > 7) ? true : false);
          setIsLower(/[a-z]/.test(prevPassword) ? true : false);
          setIsUpper(/[A-Z]/.test(prevPassword) ? true : false);
          setIsNum(/\d/.test(prevPassword) ? true : false);
          
          return e.target.value;
        });
      };

    return (
        <section className="bg-bgcolor-light dark:bg-bgcolor-dark">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Register
                </h1>
                <form onSubmit={submit} className="space-y-4 md:space-y-6">
                    <div>
                        <input placeholder="Username" 
                            onChange={e => setUsername(e.target.value)}
                            value={username}
                            maxLength={10}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                    </div>
                    <div >
                        <input type="password"  placeholder="Password"
                            onChange={e => checkPassword(e)}
                            value={password}
                            maxLength={20}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                    </div>    
                    <div >
                        <input type="password" id="repwd" placeholder="Re-Password"
                            onChange={e => setRePassword(e.target.value)}
                            value={rePassword}
                            maxLength={20}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                    </div>    
                    {/* Tell user, how to construct its password. */}
                    <p className="text-white">Password rules: </p>              
                    {/* <ul className="flex box-border text-xs"> */}
                    <ul className="grid grid-cols-2 gap-4 text-xs">
                        <li style={{color: isLen ? 'green' : 'red'}} className=" list-disc mx-3">
                            <p><i>8 characters</i></p>
                        </li>
                        <li style={{color: isLower ? 'green' : 'red'}} className=" list-disc mx-3 text-green-200">
                            <p><i>1 lower character</i></p>
                        </li>
                        <li style={{color: isUpper ? 'green' : 'red'}} className=" list-disc mx-3 text-green-200">
                            <p><i>1 upper character</i></p>
                        </li>
                        <li style={{color: isNum ? 'green' : 'red'}} className=" list-disc mx-3 text-green-200">
                            <p><i>1 number</i></p>
                        </li>
                    </ul>

                    <p className="text-red-500">{signLog}</p>
                    
                    <button type="submit" 
                        disabled={!(isLen && isLower && isUpper && isNum)}
                         className="disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" 
                         >
                        Register Profile
                    </button>
                    <p>Help: UserUser1</p> 
                </form>
            </div>
            </div>
            </div>
        </section>
    )
}

export default Register;