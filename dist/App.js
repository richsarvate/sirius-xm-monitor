import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const App = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('all');
    const [loading, setLoading] = useState(false);
    const getDateRange = (period) => {
        const now = new Date();
        let start;
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
            const response = await fetch(`/api/artist-plays?${params}`);
            const result = await response.json();
            if (result.error) {
                setError(result.error);
                setData([]);
            }
            else {
                setData(result.data || []);
            }
        }
        catch (err) {
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
    return (_jsxs("div", { className: "max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "SiriusXM Artist Plays Report" }), _jsx("button", { onClick: handleLogout, className: "mt-4 p-2 bg-red-500 text-white rounded", children: "Logout" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Time Period" }), _jsxs("select", { value: period, onChange: (e) => setPeriod(e.target.value), className: "p-2 border rounded-md w-full sm:w-48", disabled: loading, children: [_jsx("option", { value: "today", children: "Today" }), _jsx("option", { value: "week", children: "This Week" }), _jsx("option", { value: "month", children: "This Month" }), _jsx("option", { value: "year", children: "This Year" }), _jsx("option", { value: "all", children: "All Time" })] })] }), error && (_jsx("div", { className: "mb-4 p-4 bg-red-100 text-red-700 rounded-md", children: error })), loading ? (_jsx("div", { className: "text-center text-gray-600", children: "Loading..." })) : data.length > 0 ? (_jsxs("div", { className: "overflow-x-auto", children: [_jsxs("div", { className: "grid grid-cols-3 gap-0 mb-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-t-lg", children: [_jsxs("div", { className: "text-center", children: ["Total Artists: ", totalArtists] }), _jsxs("div", { className: "text-center", children: ["Total Spins: ", totalSpins.toLocaleString()] }), _jsxs("div", { className: "text-center", children: ["Total Royalties: $", totalRoyalties.toLocaleString()] })] }), _jsxs("table", { className: "w-full table-auto border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-200", children: [_jsx("th", { className: "px-4 py-2 text-left text-gray-700", children: "Artist Name" }), _jsx("th", { className: "px-4 py-2 text-left text-gray-700", children: "Spins" }), _jsx("th", { className: "px-4 py-2 text-left text-gray-700", children: "Royalties" })] }) }), _jsx("tbody", { children: data.map((artist, index) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "px-4 py-2", children: artist.artist }), _jsx("td", { className: "px-4 py-2", children: artist.count }), _jsxs("td", { className: "px-4 py-2", children: ["$", (artist.count * 20).toLocaleString()] })] }, index))) })] })] })) : (_jsx("div", { className: "text-center text-gray-600", children: "No data available" }))] }));
};
export default App;
