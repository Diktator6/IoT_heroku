// Author: xmrazf00

"use client";

import React, {useEffect, useState} from 'react'
import { System } from '@components/system'
import SystemCart from '@components/SystemCart';
import Link from 'next/link';
import { BEURL } from '@components/constants';

// Enum type for systems to show
enum Options{
  ALL = 'all',
  PERMISSION = 'permission',
  OWN = 'own',
}

function MySystems() {

  const [items, setItems] = useState<System[]>([]);
  const [option, setOption] = useState(Options.ALL)
  const [page, setPage] = useState(0)

  // var isLoggedIn = localStorage.getItem('username') !== '';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  useEffect(() => {
    // Perform localStorage action
    const item = localStorage.getItem('key') !== '';
    setIsLoggedIn(item);

  }, [])

  useEffect(() => {
    (async () => {
      try { 
        // Fetch system data
        const systemsResponse = await fetch(`${BEURL}/api/getAllSystems?option=${option}&page=${page} `, {
          method: "GET",
          credentials: 'include'
        });
        const systemsData = await systemsResponse.json();

        if(systemsResponse.status === 401){
          window.location.href = '/login';
      }
  
        // Set the state with the list of systems
        setItems(systemsData);
        
      } catch (error) {
        console.error("Error: ", error);
        setItems([]);
      }
      
    })();
  }, [option, page]); 

  const handleOptionClick = (opt:Options) => {
    setOption(opt);
    setPage(0);
  }

  return(
    <section className="bg-bgcolor-light dark:bg-bgcolor-dark">
    <div className="flex flex-col  px-6 py-8 mx-auto md:h-screen lg:py-0">
        {/* Side menu or something for choosing options */}
        <div className='flex gap-2 my-2'>
          <button type='button' onClick={() => handleOptionClick(Options.ALL)}  className="px-8 py-3 rounded bg-sky-800 text-white">All Systems</button>
          <button type='button' onClick={() => handleOptionClick(Options.PERMISSION)} hidden={!isLoggedIn} className="px-8 py-3 rounded bg-sky-800 text-white">Systems with permission</button>
          <button type='button' onClick={() => handleOptionClick(Options.OWN)} hidden={!isLoggedIn} className="px-8 py-3 rounded bg-sky-800 text-white">My own systems</button>
          <Link href={`/systems/new`} hidden={!isLoggedIn} className="px-8 py-3 rounded bg-sky-800 text-white">Create System</Link>
        </div>
        {/* <SystemList systems={items} /> */}
        <div>
          {items.map(item =>(
            <SystemCart system={item} key={item.id}/>
          ))}
        </div>
        {/* Paggination */}
        <div className="flex justify-between my-4">
          {/* Go to previous page*/}
          <button type='button' onClick={() => setPage(prev => prev - 1)} style={{visibility: (page === 0) ? 'hidden': 'visible'}} className="px-8 py-3 rounded bg-sky-800 text-white">Previous page</button>
          <button type='button' onClick={() => setPage(prev => prev + 1)} className="px-8 py-3 rounded bg-sky-800 text-white">Next page</button>
        </div>

    </div>
    </section>
  )
}

export default MySystems