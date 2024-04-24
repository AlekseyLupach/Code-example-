import React, { useState } from 'react';

const useStatus = () => {
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  return {
    setError,
    setSuccess,
    setInProgress,
    setMessage,
    error,
    success,
    inProgress,
    message
  };
};

export default useStatus;
