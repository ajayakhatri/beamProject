// Displays messages dynamically

import Alert from 'react-bootstrap/Alert';

function MessageBox({message,setMessage}) {

const update=()=>{
const updatedMessage = [...message];
updatedMessage[2] = false;
setMessage(updatedMessage);
  }

  if (message[2]) {
    return (
      <Alert className='alert not-printable' style={{position:"fixed", bottom:"5%"}} variant={message[0]} onClose={() =>{update()}} dismissible >
        <Alert.Heading>{message[0]==="danger"?"Error":message[0]==="primary"?"Alert":message[0]}</Alert.Heading>
     {message[1]}
      </Alert>
    );
  }
}

export default MessageBox;