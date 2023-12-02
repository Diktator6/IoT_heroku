// Author: xmrazf00

'use client';

import { BEURL } from '@components/constants';
import { useRouter } from 'next/navigation';
import  { useState, SyntheticEvent } from 'react'

interface ResponseMes {
    mes: string;
    error:string;
}

function NewSystem() {

    const router = useRouter();
    const [system_name, setSystem_name] = useState('')
    const [description, setDescription] = useState('')
    const [signLog, setSignLog] = useState('');

    const submit = async (e:SyntheticEvent) => {
        e.preventDefault();

        try{
            const now = new Date();
           const response = await fetch(`${BEURL}/api/newSystem`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({
                    system_name,
                    description,
                    date_created: now,
                })
           });
           // System was created succesfully and page will be redirected to the system
           if(response.status === 201){
                const data: ResponseMes = await response.json();
                router.push(`/systems/${data.mes}`)
           }
            // User already has system with this name   
           if(response.status === 400){
                const data: ResponseMes = await response.json()
                setSignLog(data.error)
           }
            // User does not exists
           if(response.status === 401){
                window.location.href = '/login';
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
                    Create Your System
                </h1>
                <form onSubmit={submit} className="space-y-4 md:space-y-6">
                    <div>
                        <input placeholder="System name"
                        onChange={e => setSystem_name(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Description"
                            name="systemDescription"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <p className="text-red-500">{signLog}</p> 
                    <button 
                        onClick={submit}
                        type="submit"
                        className="disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" 
                        >
                        Create System
                        </button>
                </form>
            </div>
            </div>
            </div>
        </section>
    )
}

export default NewSystem