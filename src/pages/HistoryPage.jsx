import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Common/Navbar";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/result/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
        {history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td className="p-2 border">{item.category.name}</td>
                  <td className="p-2 border">{item.score}</td>
                  <td className="p-2 border">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History;
