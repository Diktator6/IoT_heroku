// Author: xmrazf00

"use client";

import React, {useEffect, useState} from 'react'
import { System } from '@components/system'
import { Sharing } from '@components/sharing';
import { User } from '@components/user';
import AdminSharingCart from '@components/AdminSharingCart';
import AdminSystemCart from '@components/AdminSystemCart';
import AdminUserCart from '@components/AdminUserCart';
import { BEURL } from '@components/constants';


// Enum type for systems to show
enum Options{
  USERS = 'users',
  SYSTEMS = 'systems',
  SHARINGS = 'sharings',
}

function AdminPage() {

    const [users, setUsers] = useState<User[]>([]);
    const [systems, setSystems] = useState<System[]>([]);
    const [sharings, setSharing] = useState<Sharing[]>([]);
    const [option, setOption] = useState(Options.USERS)
    const [page, setPage] = useState(0)



  useEffect(() => {
    (async () => {
      try { 
        // Fetch all data
        const systemsResponse = await fetch(`${BEURL}/api/admin/getAll?option=${option}&page=${page} `, {
          method: "GET",
          credentials: 'include'
        });
        const responseData = await systemsResponse.json();

        if(systemsResponse.status === 401){
          window.location.href = '/login';
        }
        if(systemsResponse.status === 400){
          window.location.href = '/login';
        }

        if(option === Options.USERS){
            setUsers(responseData)
        }
        if(option === Options.SYSTEMS){
            setSystems(responseData)
        }
        if(option === Options.SHARINGS){
            setSharing(responseData)
        }
      } catch (error) {
        console.error("Error: ", error);
      }
      
    })();
  }, [option, page]); 

  const handleOptionClick = (opt:Options) => {
    setOption(opt);
    setPage(0);
  }

  return(
    <section className="bg-bgcolor-light dark:bg-bgcolor-dark dark:text-white">
    <div className="flex flex-col  px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className='flex gap-2 my-2'>
          <button type='button' onClick={() => handleOptionClick(Options.USERS)}  className="px-8 py-3 rounded bg-sky-800 text-white">Users</button>
          <button type='button' onClick={() => handleOptionClick(Options.SYSTEMS)}  className="px-8 py-3 rounded bg-sky-800 text-white">Systems</button>
          <button type='button' onClick={() => handleOptionClick(Options.SHARINGS)}  className="px-8 py-3 rounded bg-sky-800 text-white">Sharings</button>
        </div>
        {(option === Options.USERS)&&(
            users.length == 0 ?
            <p className="text-2xl">There are no Sharings!</p>:
            <div>
                {users.map(item =>(
                    <AdminUserCart user={item} key={item.id}/>
                ))}
            </div>
        )}
        {(option === Options.SYSTEMS)&&(
            systems.length == 0 ?
            <p className="text-2xl">There are no Systems!</p>:
            <div>
                {systems.map(item =>(
                    <AdminSystemCart system={item} key={item.id}/>
                ))}
            </div>
        )}
        {(option === Options.SHARINGS)&&(
            sharings.length == 0 ?
            <p className="text-2xl">There are no Sharings!</p>:
            <div>
                {sharings.map(item =>(
                    <AdminSharingCart sharing={item} key={item.id}/>
                ))}
            </div>
        )}
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

export default AdminPage