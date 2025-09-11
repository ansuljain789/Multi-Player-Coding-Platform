// import React from 'react';
// import Avatar from 'react-avatar';

// function Client({email}) {

//   return (
//     <div className="d-flex align-items-center mb-3">
//       <Avatar name={email.toString()} size={50} round="14px" className="mr-3" />
//       <span className='mx-2'>{email.toString()}</span>
//     </div>
//   );
// }

// export default Client;

import React from "react";
import Avatar from "react-avatar";

function Client({ email }) {
  // fallback if email is undefined
  const displayName = email ? email.toString() : "Unknown";

  return (
    <div className="d-flex align-items-center mb-3">
      <Avatar name={displayName} size={50} round="14px" className="mr-3" />
      <span className="mx-2">{displayName}</span>
    </div>
  );
}

export default Client;

