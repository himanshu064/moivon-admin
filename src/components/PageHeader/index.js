import React from "react";

const PageHeader = ({ title }) => {
  return (
    <>
      <div className="header bg-white p-4 flex justify-between">
        <h2 className="text-primary text-[18px] font-semibold ">{title}</h2>
        <p className="text-primary text-sm">
          Event Manager / <span className="text-active">{title}</span>
        </p>
      </div>
    </>
  );
};

export default PageHeader;
