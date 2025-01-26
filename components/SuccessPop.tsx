// const Success = ({ isOpen, title, description }: any) => {
//   if (!isOpen) return null;

//   return (
// <div className="fixed inset-0 bg-['rgba(0, 0, 0, 0.5)'] bg-opacity-30 backdrop-blur-sm z-10 w-full h-full flex justify-center items-center">
//   <div className="flex flex-col justify-center items-center w-2/4 mt-2">
//     <div className="bg-[#473d3d] w-full px-5 py-10 rounded-lg flex flex-col justify-center items-center gap-3 text-center">
//       <p className="text-black">{title}</p>
//       <p className="text-black">{description}</p>
//     </div>
//   </div>
// </div>
//   );
// };

// export default Success;

const Success = ({ isOpen, title, description, copied }: any) => {
  if (!isOpen) return null;

  return (
    <div>
      {copied ? (
        <div className="fixed inset-0 bg-['rgba(0, 0, 0, 0.5)'] bg-opacity-30 z-10 w-full h-full flex justify-end items-start">
          <div className="flex flex-col justify-center items-center w-1/3 mt-8">
            <div className="bg-[#546dfe] absolute top-8 w-1/5 right-4 mt-10 px-8 py-2 rounded-lg flex flex-col justify-center items-center text-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-aut">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Success</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-['rgba(0, 0, 0, 0.5)'] bg-opacity-30 backdrop-blur-sm z-10 w-full h-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-1/3 mt-2">
            <div className="bg-[#546dfe] w-full px-5 py-10 rounded-lg flex flex-col justify-center items-center gap-3 text-center">
              <p className="text-black">{title}</p>
              <p className="text-black">{description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
