import { Spinner } from "@chakra-ui/react";
import React from "react";

const Loader = () => {
  return (
    <div className='flex justify-center items-center mt-6'>
      <Spinner />
    </div>
  );
};

export default Loader;
