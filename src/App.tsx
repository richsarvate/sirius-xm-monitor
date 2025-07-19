import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);

  const getDateRange = (period: string) => {
    const now = new Date();
    let start: Date;

    switch (period) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'all':
      default:
        start = new Date(2020, 0, 1);
        break;
    }

    start.setHours(start.getHours() - 3);
    return { start: start.toISOString(), end: now.toISOString() };
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { start, end } = getDateRange(period);
      const params = new URLSearchParams({ start, end });
      const response = await fetch(`http://ec2-18-216-119-43.us-east-2.compute.amazonaws.com:8000/api/artist-plays?${params}`);
      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setData([]);
      } else {
        setData(result.data || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const totalSpins = data.reduce((sum, artist) => sum + artist.count, 0);
  const totalRoyalties = data.reduce((sum, artist) => sum + (artist.count * 20), 0);
  const totalArtists = data.length;

  const handleLogout = () => {
    window.location.href = 'https://siriusxm.setupcomedy.com/auth/logout';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">SiriusXM Artist Plays Report</h1>
        <button onClick={handleLogout} className="mt-4 p-2 bg-red-500 text-white rounded">
          Logout
        </button>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Period</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="p-2 border rounded-md w-full sm:w-48"
          disabled={loading}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-3 gap-0 mb-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-t-lg">
            <div className="text-center">Total Artists: {totalArtists}</div>
            <div className="text-center">Total Spins: {totalSpins.toLocaleString()}</div>
            <div className="text-center">Total Royalties: ${totalRoyalties.toLocaleString()}</div>
          </div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-gray-700">Artist Name</th>
                <th className="px-4 py-2 text-left text-gray-700">Spins</th>
                <th className="px-4 py-2 text-left text-gray-700">Royalties</th>
              </tr>
            </thead>
            <tbody>
              {data.map((artist, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{artist.artist}</td>
                  <td className="px-4 py-2">{artist.count}</td>
                  <td className="px-4 py-2">${(artist.count * 20).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600">No data available</div>
      )}
    </div>
  );
};

export default App;
