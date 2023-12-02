// Author: xmrazf00

'use client';

import { useRouter } from 'next/navigation';
import { System, Right } from '@components/system';
import { Share_type} from '@components/sharing';
import {  } from 'next/server'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import RightNode from '@components/RightNode';
import Link from 'next/link';
import { Device } from '@components/device';
import DeviceCart from '@components/DeviceCart';
import { BEURL } from '@components/constants';

function Page({ params }: { params: { systemId: string } }) {

  const router = useRouter();
  const [items, setItems] = useState<System>();
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    (async () => {
      try { 
        // Fetch system data
        const systemResponse = await fetch(`${BEURL}/api/system/${params.systemId}`, {
          method: "GET",
          credentials: 'include'
        });
        const systemData = await systemResponse.json();
      
        if(systemResponse.status === 404){

        }
        if(systemResponse.status === 200){
          // Set the state with system data
          setItems(systemData);
          localStorage.setItem('sytemname', `${systemData.system_name}`);
        }
  
        
      } catch (e) {
        console.error("Error: ", e);
      }
      
    })();
  }, []); 

  // For devices
  const fetchData = async () => {
    try {
      const systemResponse = await fetch(`${BEURL}/api/device/system/${params.systemId}`, {
        method: "GET",
        credentials: 'include'
      });
      const systemData = await systemResponse.json();

      if (systemResponse.status === 200) {
        setDevices(systemData);
      }
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Setup interval to fetch data every 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [params.systemId]);

  // Create new post in sharing table
  const setSharing = async (e: SyntheticEvent) => {
    e.preventDefault();  

    var share_type = Share_type.USER_TO_SYSTEM

    try {
        const response = await fetch(`${BEURL}/api/sharing/new`, {
            method: "POST",
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                share_type,
                system: params.systemId
            })
        });

        if(response.status === 201){
        }
        if(response.status === 400){
        }
    }catch(error){
      console.error("Error: ", error);
    }
  }

  // Accept or decline sharing

  if (items === undefined) {
    return <div>Loading...</div>; // Render a loading indicator
  }

  function handleClick(e: React.SyntheticEvent): void {
    if(items?.right === Right.REGISTERED){
      setSharing(e)
      setItems({
        ...items,
        right: Right.WAITING_USER_TO_OWNER
      })
    }
  }

  const deleteSystem = async () => {
    // Show a confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete the system?');

    // If the user confirmed, proceed with deletion
    if (confirmed) {
      const response = await fetch(`${BEURL}/api/system/delete/${items.id}`,{
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });
      
      if(response.status == 204){
          alert("System was succesfully deleted!")
          router.push('/systems');
      }
    }
  };

  return (
    <section className="bg-bgcolor-light dark:bg-bgcolor-dark dark:text-white">
    <div className="flex flex-col items-center px-6 py-8 mx-auto h-screen" >
    <div className="w-full p-6 flex justify-between">
      <div className="space-y-4">
        <h1 className="text-4xl">{items.system_name}</h1>
        {(items.right === Right.OWNED)? 
          <p>This is your system</p> :
          <p>Owner: {items.owner__username}</p>
        }
        <p>{items.description}</p>
      </div>
      <div>
        {/* Owner things here */}
        {(items.right == Right.OWNED)?
        <div className="flex flex-col">
          <button 
             className="my-2 disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Edit
          </button>
          <Link 
            href={`/systems/sharing/${items.id}`}
            className="my-2 disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
              Sharing Posts
          </Link>
          <Link 
            href={`/devices/new/${items.id}`}
            className="my-2 disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
              Add new Divece
          </Link>
          <button 
            onClick={deleteSystem}
             className="my-2 disabled:opacity-25 w-full text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Delete system
          </button>
        </div>:
        // If not owner
        <RightNode right={items.right} onButtonClick={handleClick}/>
      }
      {/* If waiting to accept/dicline from user side */}
      {(items.right === Right.WAITING_OWNER_TO_USER) &&
        <>
            <button >Accept</button>
            <button >Decline</button>
        </>
      }
      </div>
    </div>
      {/* All devices */}
        <div >
          {devices.map(item =>(
            <DeviceCart device={item} key={item.id}/>
          ))}
        </div>
    </div>
    </section>
  )
}

export default Page