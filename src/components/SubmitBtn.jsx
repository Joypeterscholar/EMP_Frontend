import React from 'react';

const SubmitBtn = ({ text, isSubmitting }) => {
  return (
    <button
      type='submit'
      className='w-full h-12 text-sm font-semibold text-white transition-colors rounded-2xl'
      style={{ backgroundColor: "#4f46e5" }}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span>sending...</span>
      ) : (
        text || 'submit'
      )}
    </button>
  );
};

export default SubmitBtn;
