"use client";

import { useEffect, useState } from "react";

interface User {
  user_uuid: string;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role: Role;
}

interface Role {
  role_uuid: string;
  role_name: string;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchRoles() {
      try {
        const res = await fetch("/api/roles");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Role[] = await res.json();
        setRoles(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    fetchRoles();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="w-full flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center justify-center py-2">
        <h1 className="mt-4 text-gray-400 text-4xl font-bold ">
          Welcome to BeginnersAppDev
        </h1>
      </div>
      <div className="w-full flex items-center justify-center mb-32 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left">
        <div className="mb-6">
          <h2 className="mt-10 mb-3 text-2xl font-semibold">Users List</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">UUID</th>
                <th className="border border-gray-300 p-2">Username</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Role</th>
                <th className="border border-gray-300 p-2">Active</th>
                <th className="border border-gray-300 p-2">Date de création</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_uuid}>
                  <td className="border border-gray-300 p-2">
                    {user.user_uuid}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">
                    {user.role ? user.role.role_name : "No Role"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {user.is_active ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="mb-3 mt-6 text-2xl font-semibold">Roles List</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">UUID</th>
                <th className="border border-gray-300 p-2">Role Name</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.role_uuid}>
                  <td className="border border-gray-300 p-2">
                    {role.role_uuid}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {role.role_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
