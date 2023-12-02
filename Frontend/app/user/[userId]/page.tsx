// Author: xmrazf00

'use client';

import { BEURL } from '@components/constants';
import { useRouter } from 'next/navigation';
import { useState, useEffect, SyntheticEvent, ChangeEvent } from 'react';

function UserPage() {

  const router = useRouter();
  const [user, setUser] = useState({
    id: 0,
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    sex: '',
    birth_date: '',
    is_admin: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BEURL}/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',

      });

      const updatedUser = await response.json();

    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${BEURL}/api/user`, {
          credentials: 'include',
        });

        const userData = await response.json();

        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    })();
  }, []);

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
        window.location.href = '/login';
    }
    }
  };

  return (
    <section className="bg-bgcolor-light dark:bg-bgcolor-dark dark:text-white">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <div className='flex align-middle justify-center'>
            <h1>{user.username}</h1>
        </div>
      <form onSubmit={handleSubmit}>
        
        <label>
          Change Password:
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          First Name:
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Sex:
          <select name="sex" value={user.sex} onChange={handleChangeSelect} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="undefined">Undefined</option>
          </select>
        </label>
        <br />
        <label>
          Birth Date:
          <input
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="date"
            name="birth_date"
            value={user.birth_date}
            onChange={handleChange}
          />
        </label>
        <br />
        {user.is_admin &&
        <p className='text-yellow-500 text-2xl'>Admin</p>}
        <br />
        <button 
            type="submit"
            className="disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" 
        >
            Update User
        </button>
      </form>
      <button 
            type="submit"
            className="disabled:opacity-25 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-400 dark:hover:bg-red-600 dark:focus:ring-primary-800" 
            onClick={deleteUser}
        >
            Delete User
        </button>
      </div>
    </div>
    </div>
    </section>
  );
}

export default UserPage;
