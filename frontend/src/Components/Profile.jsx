import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './navbar';

export default function Profile() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password'); // Default to 'password'
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { userId } = useParams();
  const id = userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost/backend/get_user.php?user_id=${id}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setUser(data);
        }
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [id]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/backend/change_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
          currentPassword,
          newPassword,
          passwordType, // Send the selected password type
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Password updated successfully');
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Failed to update password');
    }
  };

  if (error) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white items-center justify-center p-4 flex flex-col">

    <div className=" w-full bg-purple-600 z-10">
      <Navbar />
    </div>

      <div className="rounded-lg shadow-lg max-w-2xl w-full overflow-hidden border border-white items-center justify-center">
        <div className="bg-purple-600 p-6">
          <h1 className="text-3xl font-bold text-center">User Profile</h1>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 rounded-full h-20 w-20 flex items-center justify-center text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <div>
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <div className="bg-black/50 p-4 rounded-lg space-y-2 border border-white">
                <div className="flex justify-between">
                  <span className="text-gray-400">Username:</span>
                  <span>{user.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="passwordType" className="block text-sm font-medium mb-1">
                  Select Password Type
                </label>
                <select
                  id="passwordType"
                  value={passwordType}
                  onChange={(e) => setPasswordType(e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded text-white"
                >
                  <option value="password">Password</option>
                  <option value="non_admin_password">Non-Admin Password</option>
                </select>
              </div>
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded text-white"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-1/2 bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="w-1/2 bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          {message && <div className="text-center text-red-500">{message}</div>}
        </div>
      </div>
    </div>
  );
}
