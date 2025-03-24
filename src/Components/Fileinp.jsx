import React, { useState } from "react";
import { read, utils } from "xlsx";

const Fileinp = () => {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  console.log(data);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(sheet);
      setData(jsonData);
      setFilteredData([]);
    };

    reader.readAsBinaryString(file);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    if (!value) {
      setFilteredData([]);
      return;
    }

    const newFilteredData = data.filter((item) =>
      item.Category?.toUpperCase().includes(value.toUpperCase())
    );
    setFilteredData(newFilteredData);
  };

  return (
    <>
      <form className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by Category..."
            value={filterValue}
            onChange={handleFilter}
          />
        </div>
      </form>

      <div className="flex flex-col items-center justify-center w-full p-4">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload an Excel file (.xlsx)
            </p>
          </div>
          <input
            onChange={handleFile}
            id="dropzone-file"
            type="file"
            accept=".xlsx"
            className="hidden"
          />
        </label>
      </div>

      {filteredData.length > 0 ? (
        <div className="w-full mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(filteredData[0]).map((key, index) => (
                  <th
                    key={key}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 border"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row, rowIndex) => (
                <>
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {Object.values(row).map((value, colIndex, index) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2 text-sm text-gray-600 border"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          {filterValue ? "No data found" : "Enter a search term to filter data"}
        </p>
      )}
    </>
  );
};

export default Fileinp;
