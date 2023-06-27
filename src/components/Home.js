import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {useNavigate} from "react-router-dom"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import authHeader from './auth-header';

function Home() {
  const paperStyle={padding: '2rem', width:'50%', marginLeft:"18%", marginRight: "3%"}
  const navigate = useNavigate();
  const labelStyle = {fontSize: 18, fontWeight: 600, marginBottom: 8};
  const rowStyle = {backgroundColor: '#fff','&:hover': {backgroundColor: '#dedede',}}
  const [userCount, setUserCount] = useState(0);
  const [accountCount, setAccountCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);

  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("user")) === null){
      navigate('/authentication/signin');
    } else {
      if(JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN") {
        fetch(`http://localhost:8080/users/approve`, {
          method: 'GET',
          headers:  new Headers({
            "Content-Type":"application/json",
            ...authHeader()
          })})
          .then(res=>res.json())
          .then((result)=>{
            setUserCount(result.length);
          })
        fetch(`http://localhost:8080/accounts/approve`, {
          method: 'GET',
          headers:  new Headers({
            "Content-Type":"application/json",
            ...authHeader()
          })})
          .then(res=>res.json())
          .then((result)=>{
            setAccountCount(result.length);
          }
          )
        fetch(`http://localhost:8080/payments/requests`, {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setPaymentCount(result.length);
        }
        )
      }
       else {
        navigate('/payments');
       }
    }
  }, [navigate, ])

  const handleUser = () => {
    navigate('/users/approve');
  }

  const handleAccount = () => {
    navigate('/accounts/approve');
  }

  const handlePayment = () => {
    navigate('/payments/requests');
  }

  return (
    <>
      {
        JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN" &&
        <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 4, width: '30ch', flexGrow: 2, },
        }}
        noValidate
        autoComplete="off"
      
        >
        <Paper elevation = {10} style={paperStyle}>
          <label style={labelStyle}>Waiting for approve</label>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><b>Entity</b></TableCell>
                  <TableCell align="right"><b>Items</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow onClick = {handleUser} sx={rowStyle}>
                    <TableCell component="th" scope="row">User</TableCell>
                    <TableCell align="right">{userCount}</TableCell>
                  </TableRow>
                  <TableRow onClick = {handleAccount} sx={rowStyle}>
                    <TableCell component="th" scope="row">Account</TableCell>
                    <TableCell align="right">{accountCount}</TableCell>
                  </TableRow>
                  <TableRow onClick = {handlePayment} sx={rowStyle}>
                    <TableCell component="th" scope="row">Payment</TableCell>
                    <TableCell align="right">{paymentCount}</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
        </Paper>
        </Box>
      }
    </>
  );
}

export default Home;