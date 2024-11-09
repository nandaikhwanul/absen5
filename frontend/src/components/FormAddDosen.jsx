import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddDosen = () => {
  const [dosenData, setDosenData] = useState([{ nip: "", name: "" }]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (index, e) => {
    const values = [...dosenData];
    values[index][e.target.name] = e.target.value;
    setDosenData(values);
  };

  const handleAddRow = () => {
    setDosenData([...dosenData, { nip: "", name: "" }]);
  };

  const handleRemoveRow = (index) => {
    const values = [...dosenData];
    values.splice(index, 1);
    setDosenData(values);
  };

  const saveDosen = async (e) => {
    e.preventDefault();
    setMsg(""); // Reset message before submission

    // Validate if all fields are filled
    for (let i = 0; i < dosenData.length; i++) {
      if (!dosenData[i].nip || !dosenData[i].name) {
        setMsg("All fields are required!");
        return;
      }
    }

    try {
      // Send all dosen data as a bulk request
      await axios.post("http://localhost:5000/dosens/bulk", { dosenData });
      navigate("/users"); // Redirect to the dosens list page if you have one
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-top relative lg:left-32 sm:left-52 min-h-screen bg-white dark:bg-gray-900 w-full">
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form className="p-6 grid grid-cols" onSubmit={saveDosen}>
              <h1 className="font-bold text-2xl text-center">ADD DOSEN</h1>

              {dosenData.map((data, index) => (
                <div key={index} className="flex flex-col mt-4">
                  <div className="flex flex-col mb-4">
                    <input
                      type="text"
                      name="nip"
                      placeholder="NIP"
                      className="py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none lg:w-[800px] w-[400px] sm:w-[600px]"
                      value={data.nip}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </div>
                  <div className="flex flex-col mb-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none lg:w-[800px] w-[400px] sm:w-[600px]"
                      value={data.name}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </div>
                  {dosenData.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="py-3 px-4 bg-red-600 text-white rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddRow}
                className="mt-4 py-3 px-4 bg-green-600 text-white rounded-lg"
              >
                Add Another Dosen
              </button>

              {msg && <p className="mt-2 text-red-600">{msg}</p>}

              <button
                type="submit"
                className="mt-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 focus:outline-none"
              >
                Add Dosens
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddDosen;
