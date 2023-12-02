// Author: xmrazf00

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname  } from 'next/navigation';
import {useEffect, useState} from 'react';
import { BEURL } from '@components/constants';

const Heading = () => {

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  const logout = async () => {
      await fetch(`${BEURL}/api/logout`,{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });

      localStorage.setItem('username', '');
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUsername('');
      router.push('/login');
    }
    
    useEffect(() => {
      (
        async () =>{
          try {
            const response = await fetch(`${BEURL}/api/user`,{
              credentials: 'include',
            });
            
            const content = await response.json();
            setUsername(content.username);
            if(content.username){
              setIsLoggedIn(true)
              setUserId(content.id)
              setIsAdmin(content.is_admin)
          }else{
            localStorage.setItem('username', '');
          }
        }
        catch(error){
          console.error("Error: ", error);
      }
      }
      )();
  }, [isLoggedIn]);

  const currentPathname = usePathname();

  return (
    <header className="bg-headcolor-light">
      <nav className="flex justify-between w-[92%] mx-auto h-16"> {/* Adjust the height as needed */}
        {/* Left part Image */}
        <div className='flex items-center justify-center'>
          <Link href="/">
            <Image
              src="/assets/IoT_logo.png"
              alt="Home"
              width={40}
              height={40}
              className="object-contain"
            />
            {/* <p>Home</p> */}
          </Link>
        </div>
        {/* Center part */}
        <div className="flex-grow-1"> {/* Use flex-grow-1 to make it take up the available space */}
          <ul className="flex items-center h-full">
            <li className={`h-full px-2 flex justify-center ${currentPathname === "/systems" ? "bg-bgcolor-light dark:bg-bgcolor-dark dark:text-white" : "bg-headcolor-light"}`}>
              <Link className="flex items-center justify-center h-full hover:text-gray-500" href="/systems">
                Systems
              </Link>
            </li>
            {/* <li className={`h-full px-2 ${usePathname() == "/devices" ? "bg-bgcolor-light dark:bg-bgcolor-dark dark:text-white" : "bg-headcolor-light"}`}>
              <Link className="flex items-center justify-center h-full hover:text-gray-500" href="/devices">
                Devices
              </Link>
            </li>
            <li className={`h-full px-2 flex justify-center ${usePathname() == "#" ? "bg-bgcolor-light dark:bg-bgcolor-dark dark:text-white" : "bg-headcolor-light"}`}>
              <Link className="flex items-center justify-center h-full hover:text-gray-500" href="#">
                Users
              </Link>
            </li> */}
            {/* If user is admin */}
            {isAdmin &&
              <li className={`h-full px-2 flex justify-center ${currentPathname === "#" ? "bg-bgcolor-light dark:bg-bgcolor-dark dark:text-white" : "bg-headcolor-light"}`}>
                <Link className="flex items-center justify-center h-full hover:text-gray-500" href="/admin">
                  admin
                </Link>
              </li>
            }
          </ul>
        </div>
        {/* Right part login */}
        <div className='flex justify-center py-2'>
          {isLoggedIn ? (
            <div className="flex gap-2 items-center">
              <button onClick={logout} className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]">Log Out</button>
              <Link href={`/user/${userId}`} className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]">
                {username}
              </Link>
            </div>
          ) : (
            <div className="flex gap-2 items-center justify-center">
              <Link href="/login" className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]">Log In</Link>
              <Link href="/register" className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]">Sign In</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
    );
}

export default Heading;