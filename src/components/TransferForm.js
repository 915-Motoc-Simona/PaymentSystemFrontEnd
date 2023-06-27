import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button } from '@mui/material';
import authHeader from './auth-header';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from "react-router-dom"
import Autocomplete from '@mui/material/Autocomplete';

const labelStyle = {
  fontSize: 12,
  color: "grey", 
  marginBottom: 10,
  marginLeft: 8
};

export default function RegisterPaymentForm() {
    const navigate = useNavigate();
    const paperStyle={padding: '2rem', width:'79%', marginLeft:"18%", marginRight: "3%"}
    const [debitAccount, setDebitAccount]=useState({id: "", accountStatus: "", address: "", currency: "", name: "", number: "", owner: "", status: ""})
    const [creditAccount, setCreditAccount]=useState({id: "", accountStatus: "", address: "", currency: "", name: "", number: "", owner: "", status: ""})  
    const [amount, setAmount]=useState(0)
    const [currency, setCurrency]=useState("")
    const [creditAccountNumber, setCreditAccountNumber]=useState("")
    const [debitAccountNumber, setDebitAccountNumber]=useState("")

    const [creditAccounts, setCreditAccounts]=useState([])
    const [debitAccounts, setDebitAccounts]=useState([])
  
  
    const handleClick=async(e)=> {
      e.preventDefault()
      console.log(debitAccount + creditAccount)
      const payment={type: "INTERNAL", debitBankAccount: debitAccount, creditBankAccount: creditAccount, currency: creditAccount.currency, amount: amount}
      console.log("Payment: " + payment)
        await fetch("http://localhost:8080/payments/transfer", {
          method:"POST",
          headers:new Headers({
            "Content-Type":"application/json",
            ...authHeader()
          }),
          body:JSON.stringify(payment)
        }).then(()=>{
          setDebitAccount({id: '', accountStatus: '', address: '', currency: '', name: '', number: '', status: '', owner: ''})
          setCreditAccount({id: '', accountStatus: '', address: '', currency: '', name: '', number: '', status: '', owner: ''})
          setAmount('')
          setCurrency('')

        }).catch(error => {
          console.error(error.message);
        });
    }

  
    useEffect(()=>{
      if(JSON.parse(localStorage.getItem("user"))){
        if(JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT"){
          fetch(`http://localhost:8080/accounts/client/${JSON.parse(localStorage.getItem("user")).data.username}`, {
            method: 'GET',
            headers:  new Headers({
              "Content-Type":"application/json",
              ...authHeader()
            })})
            .then(res=>res.json())
            .then((result)=>{
              setDebitAccounts(result);
              setCreditAccounts(result);
            }
            )
        }
    }
    else{
      navigate('/authentication/signin');
    }
  }, [navigate, ])

  const [funds, setFunds] = useState("")
  const [currencySelectedDebit, setCurrenctySelectedDebit] = useState("")
  const [debitAccountSelected, setDebitAccountSelected] = useState(false)

  const getFunds = async (event) => {
    console.log(event)
    await fetch(`http://localhost:8080/accounts/${event}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    }).then(res=>res.json())
      .then((result)=>{
      console.log(result)
      setCurrenctySelectedDebit(result.currency)
      fetch(`http://localhost:8080/balances/bankAccount/${result.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
    }
    ).then(res=>res.json())
    .then((result)=>{
    console.log(result.availableAmountCredit - result.availableAmountDebit)
    setFunds((result.availableAmountCredit - result.availableAmountDebit).toFixed(2))
  })
  })
 }
  
    return (
      <>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 4, width: '30ch', flexGrow: 2},
        }}
        noValidate
        autoComplete="off"
      
      >
      <Paper elevation = {10} style={paperStyle}>
        <h1> Transfer money between your accounts</h1><br/>
        {
          JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" &&
          <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="From" variant="standard" 
                value={debitAccount}
                select
                onChange={(e)=>{setDebitAccountSelected(true); setDebitAccount(e.target.value); getFunds(e.target.value.number)}}>
                  {debitAccounts.map((option) => (
                  <MenuItem key={option} value={option}>
                      {option.number}
                  </MenuItem>
                  ))}
          </TextField>
        }
        {
          JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" &&
          <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="To" variant="standard" 
            value={creditAccount}
            select
            onChange={(e)=>{console.log(e.target.value.number); setCreditAccount(e.target.value); setCurrency(e.target.value.currency)}}>
                {creditAccounts.map((option) => (
                <MenuItem key={option} value={option}>
                    {option.number}
                </MenuItem>
                ))}
        </TextField>
        }
        {
          JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" && debitAccountSelected && 
          <><br/><label style={labelStyle}>Available funds: {funds} {currencySelectedDebit} </label></>
        }
        {  JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" && <><br/><br/><br/></> }
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Amount" variant="standard"  fullWidth 
              value={amount}
              onChange={(e)=>setAmount(e.target.value)}>
        </TextField>
        <TextField sx={{m: 1, width: '40%', ml: 15}}
            id="filled-read-only-input"
            label="Currency"
            variant="filled"
            value={currency}
            InputProps={{
                readOnly: true,
            }}
        />
      <Button sx={{mt: 3, m: 1, backgroundColor: "#150E56", '&:hover': {backgroundColor: "#150E56",} }} variant="contained" 
        onClick={handleClick}>
            Submit
      </Button>
      </Paper> 
      </Box>
      </>
  );
}
