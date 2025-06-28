import React, { useState } from "react";
import AppBar from "./AppBar";
import axios from "axios";

const Admin = () => {
  const [users, setUsers] = useState([]);

  const userDetails = async () => {
    try {
      const res = await axios.get("https://ajaybinu-travelplanner.duckdns.org/auth/all-users");

      //   console.log(res.data);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      await axios.delete(`https://ajaybinu-travelplanner.duckdns.org/auth/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <AppBar />
      <section>
        <img
          src="/background_visual-85f87405.svg"
          alt=""
          className="w-screen h-screen object-cover absolute -z-10 "
        />
        <div className="h-screen flex flex-col items-center justify-center gap-3">
          <h1 className="text-6xl font-bold  text-green-700/80 text-shadow-lg/20">
            Welcome Admin
          </h1>
          <p className="text-2xl font-bold text-blue-950 text-shadow-lg/20">
            You can Edit the Users Here.
          </p>

          <p className="text-2xl text-gray-900/50">
            Life’s too short to stay in one place-go explore, dream big, and
            wander freely.
          </p>
          <button
            onClick={userDetails}
            className="font-semibold  rounded-full p-2 bg-green-600/90 cursor-pointer"
          >
            Explore Users
          </button>
          <table className="border-separate border-spacing-16 ">
            <thead>
              <tr>
                <td>UserId</td>
                <td>UserName</td>
                <td>Email Id</td>
                <td>Role</td>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.roles}</td>
                  {/* <td>
                    {user.roles.includes("USER") && (
                      <button
                        className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                        // onClick={() => handleUserButtonClick(user.id)}
                      >
                        Edit
                      </button>
                    )}
                  </td> */}
                  <td>
                    {user.roles.includes("USER") && (
                      <button
                        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleUserDelete(user.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Admin;
