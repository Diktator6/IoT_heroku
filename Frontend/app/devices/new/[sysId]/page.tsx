// Author: xmrazf00

"use client";

import {SyntheticEvent, useState} from "react";
import { useRouter } from "next/navigation";

import { BEURL } from '@components/constants';


function NewDevicePage({ params }: { params: { sysId: string } }){

    const [signLog, setSignLog] = useState('');
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const submit = async (e:SyntheticEvent) => {
        e.preventDefault();

        try{
            const now = new Date();
           const response = await fetch(`${BEURL}/api/device/new/${params.sysId}`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    description,
                })
           });
           // System was created succesfully and page will be redirected to the system
           if(response.status === 201){
                alert("Device was created!")
                router.push(`/systems/${params.sysId}`)
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
                    Create new device
                </h1>
                <form onSubmit={submit} className="space-y-4 md:space-y-6">
                    <div>
                        <input 
                            placeholder="Username" 
                            onChange={e => setName(e.target.value)}
                            value={name}
                            maxLength={10}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                    </div>
                    <div>
                        <textarea
                            placeholder="Description"
                            name="DeviceDescription"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>   

                    <p className="text-red-500">{signLog}</p>
                    
                    <button type="submit" 
                         className="disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" 
                         >
                        Add new Device
                    </button>
                </form>
            </div>
            </div>
            </div>
        </section>
    )
}

export default NewDevicePage;