import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";

const CarOwnerCreateVehicle = () => {
  const categoriesData = [
    { title: "Sedan" },
    { title: "SUV" },
    { title: "Sports Car" },
    { title: "Luxury" },
    { title: "Electric" },
  ];

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll text-black bg-red-500">
      <h5 className="text-[30px] font-Poppins text-center">Create Vehicle</h5>

      <form onSubmit={(e) => e.preventDefault()}>
        <br />
        <div>
          <label className="pb-2 text-black">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your vehicle name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2 text-black">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your vehicle description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2 text-black">
            Category <span className="text-red-500">*</span>
          </label>
          <select className="w-full mt-2 border h-[35px] rounded-[5px]">
            <option value="Choose a category" className="text-black">
              Choose a category
            </option>
            {categoriesData.map((i) => (
              <option value={i.title} key={i.title} className="text-black">
                {i.title}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2  text-black">Tags</label>
          <input
            type="text"
            name="tags"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your vehicle tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2 text-black">Original Price</label>
          <input
            type="number"
            name="price"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your vehicle price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2 text-black">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your vehicle price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2 text-black">
            Vehicle Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your vehicle stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2 text-black">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input type="file" name="" id="upload" className="hidden" multiple />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CarOwnerCreateVehicle;
