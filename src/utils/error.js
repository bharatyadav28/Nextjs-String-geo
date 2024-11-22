import toast from "react-hot-toast";

export const getError = (error) => {
  const errorMessage  = error?.response?.data?.error?.message || error?.data?.message || error?.response || error?.message || 'Something went wrong';


  toast.error(errorMessage);

  
  console.log({ error });

  return null; 
};


// import React from "react";
// import toast from "react-hot-toast";


// export const getError = (error) => {
//   return (
//     <>
//       {console.log({ error })}
//       {error?.data?.error? toast.error(error?.data?.error): error?.error? toast.error(error?.error): error.data? toast.error(error?.data?.message): error.response ? error.response.message? toast.error(error.response.message) : error.response.data.message ?  toast.error(error.response.data.message): error.response.data.error? toast.error(error.response.data.error) : toast.error(error.response) : toast.error(error.message)}
//     </>
//   );
// };
