import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button, Switch, FormControlLabel } from '@mui/material';
import authHeader from './auth-header';
import {useNavigate} from "react-router-dom"
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import ErrorModal from './ErrorModal';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: "#1597BB",
    '&:hover': {
      backgroundColor: alpha("#1597BB", theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: "#1597BB",
  },
}));

export default function RegisterUserForm() {
    const navigate = useNavigate();
    const paperStyle={padding: '2rem', width:'79%', marginLeft:"18%", marginRight: "3%"}
    const paperStyleAddress={padding: '2rem', width:'98%'}
    const [username, setUsername]=useState("")
    const [fullname, setFullname]=useState("")
    const [city, setCity]=useState("")  
    const [country, setCountry]=useState("")  
    const [zipcode, setZipcode]=useState(0)  
    const [streetPlusNumber, setStreetPlusNumber]=useState("")  
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const roles=["CLIENT", "ADMINISTRATOR"]
    const [role, setRole]=useState("")
    const [phoneNumber, setPhoneNumber]=useState("")
    const [twoFA, setTwoFA]=useState(false)
    const [error, setError] = useState(null)

    const handleModalClose = () => {
      setError(null);
    };
  
    const handleClick= async (e) => {
      if(username === "" || password === "" || email === "" || fullname === "" || role === "" || phoneNumber === "" || country === "" || city === "" || streetPlusNumber === "" || zipcode === "") {
        setError("Please fill in all fields before submiting the form")
        return
      }
      e.preventDefault()
      const user={username, password, fullname, address: {country, city, streetPlusNumber, zipcode}, email, role, phoneNumber, twoFAEnabled: twoFA}
      console.log(user)
      var response
      try {
        response = await fetch("http://localhost:8080/users", {
        method:"POST",
        headers:new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        }),
        body:JSON.stringify(user)
      })
      if (!response.ok) {
        const errorResponse = await response.text();
        console.log(errorResponse)
        throw new Error(errorResponse || "Payment cannot be initiated");
       }
        setUsername('')
        setFullname('')
        setCity('')
        setCountry('')
        setStreetPlusNumber('')
        setZipcode(0)
        setEmail('')
        setPassword('')
        setRole('')
        setPhoneNumber('')
        setTwoFA(false)

    } catch (err) 
      {
        setError(err.message);
        return
      }

    }

    

    const handleChangeTwoFA = (e) => {
      console.log(e.target.checked)
      setTwoFA(e.target.checked)

    }

  
    useEffect(()=>{
      if(JSON.parse(localStorage.getItem("user")) === null){
      navigate('/authentication/signin');
    }
  }, [navigate, ])
  
    return (
      <>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 4, width: '30ch', flexGrow: 2, },
        }}
        noValidate
        autoComplete="off"
      
      >
      <Paper elevation = {10} style={paperStyle}>
        <h1> Add new user</h1>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic-name" label="Username" variant="standard" fullWidth
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
        />
        <TextField
            sx={{m: 1, width: '40%', ml: 15}}
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="standard"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            fullWidth
          />
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Full name" variant="standard" fullWidth 
              value={fullname}
              onChange={(e)=>setFullname(e.target.value)}/>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="Email" variant="standard" fullWidth 
              value={email}
              onChange={(e)=>setEmail(e.target.value)}/>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Phone number" variant="standard" fullWidth 
              value={phoneNumber}
              onChange={(e)=>setPhoneNumber(e.target.value)}/>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="Role" variant="standard" fullWidth 
              value={role}
              select
              onChange={(e)=>setRole(e.target.value)}>
              {roles.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
                ))}
        </TextField>
        <FormControlLabel control={<CustomSwitch checked={twoFA} onChange={handleChangeTwoFA} />} label="Two Factor Authentication" sx={{ color: grey[600] }} />        
        <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '30ch', flexGrow: 2,},
            }}
            noValidate
            autoComplete="off"

        >
        <Paper elevation = {13} style={paperStyleAddress}>
        <h2>Address</h2>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Country" variant="standard" fullWidth 
              value={country}
              onChange={(e)=>setCountry(e.target.value)}/>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="City" variant="standard" fullWidth 
              value={city}
              onChange={(e)=>setCity(e.target.value)}/>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Street and number" variant="standard" fullWidth 
              value={streetPlusNumber}
              onChange={(e)=>setStreetPlusNumber(e.target.value)}/>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="Zipcode" variant="standard" fullWidth 
              value={zipcode}
              onChange={(e)=>setZipcode(e.target.value)}/>      
        </Paper>
        </Box>
      <Button sx={{mt: 3, m: 1, backgroundColor: "#150E56", '&:hover': {backgroundColor: "#150E56",} }} variant="contained" 
        onClick={handleClick}>
            Submit
      </Button>
      </Paper> 
      </Box>
      {error && <ErrorModal errorMessage={error} onClose={handleModalClose} />}
      </>
  );
}
