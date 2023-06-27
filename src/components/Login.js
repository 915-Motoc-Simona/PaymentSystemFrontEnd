import { useRef, useState, useEffect} from 'react'
import axios from '../api/axios';
import {useNavigate} from "react-router-dom"
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Button, Modal, Typography, TextField } from '@mui/material';
import image from '../assets/background2blur2.jpg'


const LOGIN_URL = '/api/authenticate/signin';
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
  };

  const backgroundStyle = {
    backgroundImage:`url(${image})`,
    backgroundSize:"cover",
    backgroundPosition: 'center',
    backgroundRepeat:"no-repeat",
    height: '40rem',
  }
  
  const paperStyle = {
    padding: '30px 20px',
    width: 400,
    margin: 'auto',
    marginTop: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: '10px',
  };
  
  const labelStyle = {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  };
  
  const inputStyle = {
    height: 40,
    width: '100%',
    padding: '0 10px',
    marginBottom: 20,
    border: '1px solid #DBDBDB',
    borderRadius: '5px',
    fontSize: 16,
  };
  
  const btnStyle = {
    height: 40,
    width: '100%',
    padding: '0 10px',
    marginBottom: 20,
    borderRadius: '5px',
    fontSize: 16,
    backgroundColor: '#150E56',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#150E56',
    },
  };

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [otp, setOtp] = useState('');
    const [twoFA, setTwoFA] = useState(false);

    let faceio;
    useEffect(() => {
            userRef.current.focus();
            // Load the FaceIO API script
        const script = document.createElement('script');
        script.src = 'https://cdn.faceio.net/fio.js';
        document.body.appendChild(script);

        return () => {
        // Remove the FaceIO API script when the component is unmounted
        document.body.removeChild(script); 
    }
    }, [])

    useEffect(() => {
        setErrMsg('');
        
    }, [username, pwd]) 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userAccount = {username: username, password: pwd};
        console.log(userAccount);
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(userAccount),  {
                headers:{"Content-Type":"application/json"},
            });
            console.log(JSON.stringify(response));
            localStorage.setItem("user", JSON.stringify(response));
            setSuccess(true);
        } catch(err){
            console.log(err.response.data.message)
            if (!err?.response) {
                setErrMsg('No Server Response');
            }
            else if (err.response.data.message === "OTP-not-sent") {
                // OTP to be sent
                console.log("OTP is being sent"); 
                setTwoFA(true);
                await axios.post("/api/phoneNumber/request-otp",
                    JSON.stringify(userAccount),  {
                    headers:{"Content-Type":"application/json"},
                });
            }
            else if (err.response?.status === 400){
                setErrMsg('Missing Username or Password')
            }
            else if (err.response?.status === 401){
                setErrMsg('Unauthorized');
            } 
            else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const handleSubmit2 = async (e) => { 
            const userAccount = {username: username, password: pwd, otp: otp};
            console.log(userAccount);
            try {
                const response = await axios.post(LOGIN_URL,
                    JSON.stringify(userAccount),  {
                    headers:{"Content-Type":"application/json"},
                });
                console.log(JSON.stringify(response));
                localStorage.setItem("user", JSON.stringify(response));
                setSuccess(true);
                setTwoFA(false);
            } catch(err){
                console.log(err.response.data.message)
                if (!err?.response) {
                    setErrMsg('No Server Response');
                }
                else if (err.response?.status === 400){
                    setErrMsg('Missing Username or Password')
                }
                else if (err.response?.status === 401){
                    setErrMsg('Unauthorized');
                } 
                else {
                    setErrMsg('Login Failed');
                }
                errRef.current.focus();
            }
        }

    const handleClose = () => setTwoFA(false);


    return(
        <>
        {
            success ? (
              navigate('/'),
              window.location.reload(false)
            ) : (
        <div style={backgroundStyle}>
        <section>
            <Paper elevation = {3} style={paperStyle}>
            <label style={labelStyle}>Sign In</label>
                <form>
                    <label htmlFor="username" style={labelStyle}>Username</label>
                    <input 
                        type="text" 
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        style={inputStyle}
                    />
                    <br/>

                    <label htmlFor="password" style={labelStyle}>Password</label>
                    <input 
                        type="password" 
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        style={inputStyle}
                    />
                    <br/>
                    <button style={btnStyle} onClick={handleSubmit}> Sign In</button>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                        {errMsg}
                    </p>
                </form>
                <Modal
                      open={twoFA}
                      onClose={handleClose}
                    >
                      <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Enter OTP code from SMS
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <TextField margin="normal" id="outlined-basic" label="OTP" variant="standard" fullWidth 
                                value={otp}
                                onChange={(e)=>setOtp(e.target.value)}/>
                        </Typography>
                        <Button style={btnStyle} variant="outlined" color='success' onClick={() => handleSubmit2()}> Submit</Button> 
                        <Button style={btnStyle} variant="outlined" color="error" onClick={handleClose}> Cancel </Button>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                        {errMsg}
                        </p>
                      </Box>
                </Modal>
        </Paper>
        </section>
        </div>
            )}
            </>

    )
}

export default Login