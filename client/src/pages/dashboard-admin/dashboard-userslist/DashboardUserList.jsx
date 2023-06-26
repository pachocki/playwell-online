import React, { useEffect } from "react";
import { useState } from "react";
//Component from Mui
import { DataGrid } from "@mui/x-data-grid";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios"
import { toast , Toaster } from "react-hot-toast";
export default function DashboardUserList() {
  const [users, setUsers] = useState([]);
  const [transactions,setTransactions] = useState([]);


  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUsers(data);
    }
    async function fetchTransactions() {
      const response = await fetch("http://localhost:5000/api/transactions");
      const data = await response.json();
      setTransactions(data);
    }
    fetchTransactions();
    fetchUsers();
  }, []);


  const handleDelete = async (userId, username) => {
    const confirmed = window.confirm(`Are you sure you want to delete  ${username} ?`);
    if (confirmed) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/users/${userId}`);
        console.log(response.data);
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        setUsers(usersResponse.data);
        toast.success(`Successfully deleted user ${username}`);
      } catch (error) {
        console.log(error);
        toast.error(`Error deleting user ${username}`);
      }
    }
    console.clear()
  };
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 400 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "courses",
      headerName: "Courses",
      type: "string",
      width: 100,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <AiFillDelete
          className="cursor-pointer hover:fill-red-600"
          onClick={() => handleDelete(params.id, params.row.name)}
        />
      ),
    },
  ];
  
  const rows = users.map((user) => {
    const userTransactions = transactions.filter(
      (transaction) => transaction.email === user.email
    );
    const courses = userTransactions.length > 0 ? "Yes" : "No";
   
   
    return {
      id: user._id ,
      name: user ? user.username : "",
      email: user ? user.email : "",
      courses: courses 
    };
  });

  return (
    <div className="w-full h-screen bg-black/20 backdrop-blur-xl py-5 px-5 rounded-xl ">
     
      <h2 className="text-4xl text-white/80 font-bold laptop:text-3xl tablet:text-2xl mobile:text-xl mobile:font-semibold pb-2">
        New Users
      </h2>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[5]}
        checkboxSelection
        className=" !text-xl !bg-black/20 !text-white/80 "
        disableSelectionOnClick
      />
       <Toaster position="bottom-center" reverseOrder={true} />
    </div>
  );
}