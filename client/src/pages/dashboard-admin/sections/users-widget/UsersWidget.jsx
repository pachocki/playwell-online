import React, { Fragment, useEffect, useState } from "react";

const UsersWidget = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

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

  return (
    <div className=" mx-5 my-2  text-white/80 relative">
      <div className="flex gap-2 screen:flex-col">
        <div className="w-3/5 bg-black/20 rounded-xl pt-4 h-full px-5 tablet:px-2  screen:w-full">
          <h2 className="text-4xl font-bold laptop:text-3xl tablet:text-2xl mobile:text-xl mobile:font-semibold">
            New Users
          </h2>
          <div className="pt-2">
            <div className="flex justify-between text-xl font-bold screen:text-sm tablet:text-xl mobile:text-sm">
              <span>Username</span>
              <span>E-mail:</span>
            </div>
            <ul>
              {users &&
                users.slice(users.length - 7, users.length).map((user) => (
                  <li
                    className="flex justify-between w-full py-2 text-xl laptop:text-lg  mobile:text-sm small-mobile:text-[0.8rem]"
                    key={user.username}
                  >
                    <span>{user.username}</span>
                    <span>{user.email}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="w-2/3 bg-black/20 rounded-xl pt-4 h-full px-5 tablet:px-2 screen:w-full ">
          <h2 className="text-4xl text-white/80 font-bold laptop:text-3xl tablet:text-2xl mobile:text-xl mobile:font-semibold">
            Latest Transactions
          </h2>

          <table className="w-full flex flex-col gap-2">
            <tr className="grid grid-cols-[2fr_100px_1fr_1fr] text-left w-full pt-2 text-xl mobile:text-sm mobile:grid-cols-[2fr_50px_1fr_1fr]">
              <th>Customer :</th>
              <th>Price :</th>
              <th>Course :</th>
            </tr>
            {transactions &&
              transactions
                .slice(transactions.length - 10, transactions.length)
                .map((transaction) => (
                  <tr
                    className="grid grid-cols-[2fr_100px_1fr_1fr] text-left w-full pt-2 text-xl laptop:text-lg mobile:text-sm small-mobile:text-[0.8rem] mobile:grid-cols-[2fr_50px_1fr_1fr]"
                    key={transaction._id}
                  >
                    <td>
                      <span>{transaction.username}</span>
                    </td>
                    {transaction.subscriptions &&
                    transaction.subscriptions.length > 0 ? (
                      // Group subscriptions by course
                      Object.values(
                        transaction.subscriptions.reduce(
                          (acc, subscription) => {
                            if (acc[subscription.productName]) {
                              acc[subscription.productName].push(subscription);
                            } else {
                              acc[subscription.productName] = [subscription];
                            }
                            return acc;
                          },
                          {}
                        )
                      ).map((subscriptions, index) => (
                        <Fragment key={`${transaction._id}-${index}`}>
                          {index === 0 ? (
                            // Display customer name in first row
                            <td
                              rowSpan={
                                Object.values(
                                  transaction.subscriptions.reduce(
                                    (acc, subscription) => {
                                      if (acc[subscription.productName]) {
                                        acc[subscription.productName].push(
                                          subscription
                                        );
                                      } else {
                                        acc[subscription.productName] = [
                                          subscription,
                                        ];
                                      }
                                      return acc;
                                    },
                                    {}
                                  )
                                ).length
                              }
                            >
                              {subscriptions.map((subscription) => (
                                <div
                                  key={subscription.planName}
                                  className={
                                    subscription.planName === "Premium"
                                      ? " text-green-600"
                                      : subscription.planName === "Basic"
                                      ? " text-red-600"
                                      : ""
                                  }
                                >
                                  {subscription.planPrice} Kr
                                </div>
                              ))}
                            </td>
                          ) : null}
                          <td className="flex flex-col">
                            {subscriptions[0].productName}
                          </td>
                        </Fragment>
                      ))
                    ) : (
                      <td colSpan="5">No subscriptions found.</td>
                    )}
                  </tr>
                ))}
          </table>

          <div className="py-5">
            <span className="underline underline-offset-4  text-xl hover:text-red-500 transition-all delay-150 cursor-pointer laptop:text-lg tablet:text-sm ">
              View more Transactions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersWidget;
