import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const DashboardChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:5000/api/transactions");
      const transactions = await response.json();
  
      const dateLabels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleString("default", { month: "short" });
      });
  
      const activeUsers = dateLabels.map((label, index) => {
        if (index === 0) {
          // For January, use total number of transactions
          return transactions.length;
        } else {
          // For other months, filter transactions by month and return length
          const currentMonth = new Date().getMonth() ;
          const monthTransactions = transactions.filter(
            (transaction) => {
              const transactionDate = new Date(transaction.date);
              const transactionMonth = transactionDate.getMonth() + 1;
              return (
                transactionMonth === index &&
                transactionMonth <= currentMonth &&
                transaction.status === "success"
              );
            }
          );
          return monthTransactions.length;
        }
      });
  
      const data = dateLabels.map((label, index) => ({
        name: label,
        "Active User": activeUsers[index],
      }));
  
      setData(data);
    }
    fetchData();
  }, []);

  return (
   
        <div className="bg-black/20  h-[60vh]  rounded-xl mx-5 my-2 pb-5 tablet:h-[45vh] mobile:h-[35vh]">
        <div className="pt-4 text-4xl text-white/80 px-5 pb-5 laptop:text-3xl tablet:text-2xl mobile:text-xl">
          <span>Active Users</span>
        </div>
        
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="Active User" stroke="red" fill="#ff010cd6" />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      );
    }
  
export default DashboardChart

