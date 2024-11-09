import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListDosen = () => {
  const [dosens, setDosens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the dosens data from the API when the component mounts
  useEffect(() => {
    const fetchDosens = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dosens'); // Adjust the URL to your API endpoint
        setDosens(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchDosens();
  }, []);

  // Render loading state or error if applicable
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="min-w-full bg-white ">
        <thead>
          <tr>
            <th className="border-b py-2 px-4">NIP</th>
            <th className="border-b py-2 px-4">Name</th>
          </tr>
        </thead>
        <tbody>
          {dosens.length > 0 ? (
            dosens.map((dosen) => (
              <tr key={dosen.nip}>
                <td className="border-b py-2 px-4">{dosen.nip}</td>
                <td className="border-b py-2 px-4">{dosen.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListDosen;
