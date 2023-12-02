// Author: xmrazf00

import { User } from '@components/user'
import { BEURL } from '@components/constants';

interface AdminUserCartProps {
  user: User;
}

const AdminUserCart: React.FC<AdminUserCartProps> = ({ user }) => {

    // Delete user
  const deleteUser = async () => {
    // Show a confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete the user?');

    // If the user confirmed, proceed with deletion
    if (confirmed) {
      const response = await fetch(`${BEURL}/api/user/delete/${user.id}`,{
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });

      if(response.status == 204){
        alert("User was succesfully deleted!")
    }
    }
  };


    return (
        <div className="my-2 px-2 bg-slate-500 border-solid border-2 rounded flex justify-between items-center" >
            <div>
                <p>Id: {user.id}</p>
            </div>
            <div>
                <p>Userame: {user.username}</p>
            </div>
            <div >
                <p>Name: {user.first_name} {user.last_name}</p>
            </div>
            <div>
                <button
                onClick={deleteUser}
                className="my-2 disabled:opacity-25 w-full text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  Delete
                </button>
            </div>
        </div>
      )
}

export default AdminUserCart