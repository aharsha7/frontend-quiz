import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Common/Navbar'; 
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/quiz/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Expecting array directly from res.data
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) navigate('/');
      }
    };

    fetchCategories();
  }, [navigate]);

  return (
    <div>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Available Quiz Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white p-4 rounded shadow hover:bg-blue-100 cursor-pointer transition-all"
                onClick={() => navigate(`/quiz/${cat._id}`)}
              >
                <h3 className="text-xl font-semibold">{cat.name}</h3>
                <p className="text-gray-600">
                  Timer: {cat.timer ? `${cat.timer}s` : 'Not set'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No categories available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
