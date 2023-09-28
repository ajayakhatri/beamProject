// Copies beam reference number to clipboard

import { useState } from 'react';

function CopyButton({textToCopy}) {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => setIsCopied(true))
      .catch((error) => console.log(error));
  };

  return (
    <div className='d-flex flex-column'>
    <button className='btn btn-light w-75' onClick={copyToClipboard}>📋Copy to clipboard</button>
      {isCopied && <span>Copied to clipboard!</span>}
    </div>
  );
}

export default CopyButton;
