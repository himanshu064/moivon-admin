import React from "react";

const PageHeader = ({ title }) => {
  return (
    <>
      <div className="header bg-white text-[20px] font-semibold rounded-md p-4">
        <h2 className="text-primary">{title}</h2>
      </div>
    </>
  );
};

export default PageHeader;
