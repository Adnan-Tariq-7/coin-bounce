import React from 'react';

const TextInput = (props) => {
  return (
    <div className='flex flex-col items-center w-full'>
      <input 
        className='py-2 px-4 my-2 w-[90%] max-w-md border border-solid border-gray-300 text-xl rounded-lg focus:border-blue-500 focus:outline-none'
        {...props} 
      />
      {props.error && <p className='text-[#de1b55] text-left w-[90%] max-w-md'>{props.errormessage}</p>}
    </div>
  );
}

export default TextInput;
