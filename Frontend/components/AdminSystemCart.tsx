// Author: xmrazf00

import { System } from '@components/system'
import { BEURL } from '@components/constants';

interface AdminSystemCartProps {
  system: System;
}

const AdminSystemCart: React.FC<AdminSystemCartProps> = ({ system }) => {

    // Delete system
  const deleteSystem = async () => {
    // Show a confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete the system?');

    // If the user confirmed, proceed with deletion
    if (confirmed) {
      const response = await fetch(`${BEURL}/api/system/delete/${system.id}`,{
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });

      if(response.status == 204){
        alert("System was succesfully deleted!")
    }
    }
  };


    return (
        <div className="my-2 px-2 bg-slate-500 border-solid border-2 rounded flex justify-between items-center" >
            <div>
                <p>Id: {system.id}</p>
            </div>
            <div>
                <p>Name: {system.system_name}</p>
            </div>
            <div >
                <p>Owner: {system.owner__username}</p>
            </div>
            <div>
                <button
                onClick={deleteSystem}
                className="my-2 disabled:opacity-25 w-full text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  Delete
                </button>
            </div>
        </div>
      )
}

export default AdminSystemCart