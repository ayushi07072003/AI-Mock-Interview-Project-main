import { Outlet } from "react-router-dom";

const Generate = () => {
  return (
    <div className="flex-col md:px-12 ">
      <Outlet />
    </div>
  );
};

export default Generate;
