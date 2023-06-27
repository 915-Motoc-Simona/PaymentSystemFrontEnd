import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button } from '@mui/material';
import authHeader from './auth-header';
import MenuItem from '@mui/material/MenuItem';
import Sidebar from '../navigation/Sidebar';
import {useNavigate} from "react-router-dom"


export default function RegisterAccountForm() {
    const navigate = useNavigate();
    const paperStyle={padding: '2rem', width:'79%', marginLeft:"18%", marginRight: "3%"}
    const paperStyleAddress={padding: '20px 20px', width:540}
    const [number, setNumber]=useState("")
    const [name, setName]=useState("")
    const [city, setCity]=useState("")  
    const [country, setCountry]=useState("")  
    const [zipcode, setZipcode]=useState(0)  
    const [streetPlusNumber, setStreetPlusNumber]=useState("")  
    const [currency, setCurrency]=useState("")
    const [accountStatus, setAccountStatus]=useState("")
    const [username, setUsername]=useState("")

    const [currencies, setCurrencies]=useState([])
    const [accountStatuses, setAccountStatuses]=useState([])
    const [clients, setClients]=useState([])
  
  
    const handleClick=(e)=>{
      e.preventDefault()
      const account={number: "", name, address: {country: "", city: "", streetPlusNumber: "", zipcode: ""} , currency, accountStatus, owner: {username}}
      console.log(account)
      fetch("http://localhost:8080/accounts", {
        method:"POST",
        headers:new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        }),
        body:JSON.stringify(account)
      }).then(()=>{
        console.log("New account added")
        setNumber('')
        setName('')
        setCity('')
        setCountry('')
        setStreetPlusNumber('')
        setZipcode(0)
        setCurrency('')
        setAccountStatus('')
        setUsername('')
      });
    }

  
    useEffect(()=>{
      if(JSON.parse(localStorage.getItem("user"))){
        fetch("http://localhost:8080/accounts/currencies", {
            method: 'GET',
            headers:  new Headers({
              "Content-Type":"application/json",
              ...authHeader()
            })})
            .then(res=>res.json())
            .then((result)=>{
              setCurrencies(result);
            }
            )
        fetch("http://localhost:8080/accounts/accountStatuses", {
            method: 'GET',
            headers:  new Headers({
              "Content-Type":"application/json",
              ...authHeader()
            })})
            .then(res=>res.json())
            .then((result)=>{
              setAccountStatuses(result);
            }
            )
        if(JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN"){
          fetch("http://localhost:8080/users/clients", {
              method: 'GET',
              headers:  new Headers({
                "Content-Type":"application/json",
                ...authHeader()
              })})
              .then(res=>res.json())
              .then((result)=>{
                setClients(result);
              }
              )
          } else {
            console.log(JSON.parse(localStorage.getItem("user")).data.username);
            setUsername(JSON.parse(localStorage.getItem("user")).data.username);
          }
    }
    else{
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
        <h1> Add new account</h1>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Name" variant="standard" 
            value={name}
            onChange={(e)=>setName(e.target.value)}
        />
        <TextField sx={{m: 1, ml: 15, width: '40%'}} id="outlined-basic" label="Currency" variant="standard" 
              value={currency}
              select
              onChange={(e)=>setCurrency(e.target.value)}>
                {currencies.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
                ))}
        </TextField>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Account status" variant="standard"
              value={accountStatus}
              select
              onChange={(e)=>setAccountStatus(e.target.value)}>
                {accountStatuses.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
                ))}
        </TextField>
        {
          JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN" &&
          <TextField sx={{m: 1, ml: 15, width: '40%'}} id="outlined-basic" label="Owner" variant="standard"
                value={username}
                select
                onChange={(e)=>setUsername(e.target.value)}>
                  {clients.map((option) => (
                  <MenuItem key={option} value={option}>
                      {option}
                  </MenuItem>
                  ))}
          </TextField>
        }
        <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '30ch'},
            }}
            noValidate
            autoComplete="off"

        >
        </Box>
  
      <Button sx={{mt: 3, m: 1, backgroundColor: "#150E56", '&:hover': {backgroundColor: "#150E56",} }} variant="contained" 
        onClick={handleClick}>
            Submit
      </Button>
      </Paper> 
      </Box>
      </>
  );
}
