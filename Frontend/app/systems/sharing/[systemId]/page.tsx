// Author: xmrazf00

"use client";

import React, {useEffect, useState} from 'react'
import { Sharing } from '@components/sharing'
import SharingCart from '@components/SharingCart';
import { BEURL } from '@components/constants';


// Enum type for systems to show
enum Options{
    WAITING = 'waiting',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    ALL = 'all'
}

function MySharings({ params }: { params: { systemId: string } }) {

    // const router = useRouter(); delete
    const [items, setItems] = useState<Sharing[]>([]);
    const [option, setOption] = useState(Options.ALL)
    const [page, setPage] = useState(0)

    // Maybe shallow routing
    // window.history.pushState({}, "", window.location.pathname + "?option=" + option.toString())
    // const searchParams = useSearchParams()
    
    useEffect(() => {
      (async () => {
        try { 
       
        // Fetch system sharing data
        const systemsResponse = await fetch(`${BEURL}/api/sharing/${params.systemId}?option=${option}&page=${page} `, {
          method: "GET",
          credentials: 'include'
        });
        const systemsData = await systemsResponse.json();

        if(systemsResponse.status === 401){
          window.location.href = '/login';
        }
  
        // Set the state with the list of systems
        setItems(systemsData);
        
      } catch (e) {
        console.error("Error: ", e);
        setItems([]);
      }
    })();
  }, [option, page]); 



  const handleOptionClick = (opt:Options) => {
    setOption(opt);
    setPage(0);

    // Maybe router.push({ 
    //   pathname: router.pathname,
    //   query: { systemId: params.systemId, option: opt, page: 0 }
    // });
  }
  

  return(
    <section className="bg-bgcolor-light dark:bg-bgcolor-dark dark:text-white">
    <div className="flex flex-col  px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div>
        <h1 className="text-4xl my-4">{localStorage.getItem('sytemname')}</h1>
      </div>
        {/* For choosing options */}
        <div className='flex gap-2'>
          <button type='button' onClick={() => handleOptionClick(Options.ALL)}  className="px-8 py-3 rounded bg-sky-800 text-white">All</button>
          <button type='button' onClick={() => handleOptionClick(Options.ACCEPTED)}  className="px-8 py-3 rounded bg-sky-800 text-white">Accepted</button>
          <button type='button' onClick={() => handleOptionClick(Options.DECLINED)}  className="px-8 py-3 rounded bg-sky-800 text-white">Declined</button>
          <button type='button' onClick={() => handleOptionClick(Options.WAITING)}  className="px-8 py-3 rounded bg-sky-800 text-white">Waiting</button>
        </div>
        <div>
          {items.map(item =>(
            <SharingCart sharing={item} key={item.id}/>
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

export default MySharings