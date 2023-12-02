// Author: xmrazf00

import { Sharing, State } from '@components/sharing'
import { useState } from 'react';
import { BEURL } from '@components/constants';

interface AdminSharingCartProps {
  sharing: Sharing;
}

const AdminSharingCart: React.FC<AdminSharingCartProps> = ({ sharing }) => {

    const [state, setState] = useState<State>(sharing.state);

    const putState = async (newState:State) => {
        await fetch(`${BEURL}/api/sharing/patch/${sharing.id}`,{
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            state: newState,
          }),
        });
    }


    const handleStateChange = (newState: State) => {
        if (state !== newState){
            putState(newState);
        }
        setState(newState);
    };

    const deleteSharing = async () => {
      // Show a confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete the sharing?');
  
      // If the user confirmed, proceed with deletion
      if (confirmed) {
        const response = await fetch(`${BEURL}/api/sharing/delete/${sharing.id}`,{
          method: "DELETE",
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        });
  
        if(response.status == 204){
          alert("Sharing post was succesfully deleted!")
      }
      }
    };

  return (
    <div className="my-2 px-2 bg-slate-500 border-solid border-2 rounded flex justify-between items-center" >
        <div>
            <p>id: {sharing.id}</p>
        </div>
        <div>
            <p>sysId: {sharing.system}</p>
        </div>
        <div >
            <p>{sharing.user__username}</p>
        </div>
        <div className="space-x-2">
        {/* Button to set state to 'waiting' */}
        <button
          onClick={() => handleStateChange(State.WAITING)}
          className={`${
            state === State.WAITING ? 'bg-blue-500' : 'bg-gray-500'
          } px-2 py-1 rounded text-white`}
        >
          Waiting
        </button>

        {/* Button to set state to 'accepted' */}
        <button
          onClick={() => handleStateChange(State.ACCEPTED)}
          className={`${
            state === State.ACCEPTED ? 'bg-green-500' : 'bg-gray-500'
          } px-2 py-1 rounded text-white`}
        >
          Accepted
        </button>

        {/* Button to set state to 'declined' */}
        <button
          onClick={() => handleStateChange(State.DECLINED)}
          className={`${
            state === State.DECLINED ? 'bg-red-500' : 'bg-gray-500'
          } px-2 py-1 rounded text-white`}
        >
          Declined
        </button>
      </div>
        <div>
            <button
            onClick={deleteSharing}
            className="my-2 disabled:opacity-25 w-full text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Delete
            </button>
        </div>
    </div>
  )
}

export default AdminSharingCart