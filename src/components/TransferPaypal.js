import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button } from '@mui/material';
import authHeader from './auth-header';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from "react-router-dom"
import createPaymentRequestBody from '../assets/PaymentRequestBody';
import { useLocation } from 'react-router-dom';

const labelStyle = {
  fontSize: 12,
  color: "grey", 
  marginBottom: 10,
  marginLeft: 8
};


export default function TransferPaypal() {
    const navigate = useNavigate();
    const paperStyle={padding: '2rem', width:'79%', marginLeft:"18%", marginRight: "3%"}
    const [amount, setAmount] = useState(0)
    const [currency, setCurrency] = useState('')
    const [currencies, setCurrencies] = useState([])
    const [debitAccounts, setDebitAccounts] = useState([])
    const [debitAccountSelected, setDebitAccountSelected] = useState(false)
    const [debitAccount, setDebitAccount]=useState({id: "", accountStatus: "", address: "", currency: "", name: "", number: "", owner: "", status: ""})
    const [funds, setFunds] = useState("")
    const [currencySelectedDebit, setCurrenctySelectedDebit] = useState("")
    const location = useLocation();

    const handleClick= async (e)=>{
      console.log(debitAccount)
      console.log(amount)
      console.log(currency)

      const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method:"POST", 
        headers: {
          Authorization: 'Basic ' + btoa('AcoWUTnHhYX44pNre97lgZtGi1br0J5fGfwZi3zLwvAuT0eRt74X5-ONBq93yovDXSKhO18OqS0U6gxj:EHrAKUqKh_HplE7-qQQtfsg2JxjyDp8TtKQzlY1X4UJZo8x0mvQn2FB9ihWHV6UOo6uI9_sukdb8jSXB'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
      })
       const result = await response.json()
       
       console.log(result)
       const token = `${result.token_type} ${result.access_token}`;
       console.log(token);

       if(token !== "") {
         const paymentRequestBody = createPaymentRequestBody(currency, amount.toString());
         console.log(JSON.stringify(paymentRequestBody))
         const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
          method:"POST", 
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentRequestBody)
        })

        const result = await response.json();
        console.log(result)

        console.log(debitAccount.id)
        await fetch(`http://localhost:8080/payments/registerPayPal/${debitAccount.id}/${amount}/${currency}`, {
            method: 'POST',
            headers:  new Headers({
              "Content-Type":"application/json",
              ...authHeader()
            })})

        // Find the approve link in the response
        const approveLink = result.links.find(link => link.rel === 'approve');
        localStorage.setItem("approveLink", JSON.stringify(approveLink));
        localStorage.setItem("paymentId", JSON.stringify(result.id))
        localStorage.setItem("paypalToken", JSON.stringify(token))

        setDebitAccount({id: "", accountStatus: "", address: "", currency: "", name: "", number: "", owner: "", status: ""})
        setAmount("")
        setCurrency("")
      }
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
        fetch(`http://localhost:8080/accounts/client/${JSON.parse(localStorage.getItem("user")).data.username}`, {
            method: 'GET',
            headers:  new Headers({
                "Content-Type":"application/json",
                ...authHeader()
            })})
            .then(res=>res.json())
            .then((result)=>{
                setDebitAccounts(result);
            }
            )
    }
    else{
      navigate('/authentication/signin');
    }
  }, [navigate, ])

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
          '& > :not(style)': { m: 4, width: '30ch', flexGrow: 2, },
        }}
        noValidate
        autoComplete="off"
      
      >
      <Paper elevation = {10} style={paperStyle}>
        <h1> Transfer money to your PayPal account</h1><br/>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="From" variant="standard" 
            value={debitAccount}
            select
            onChange={(e)=>{setDebitAccountSelected(true); setDebitAccount(e.target.value); getFunds(e.target.value.number)}}>
                {debitAccounts.map((option) => (
                <MenuItem key={option} value={option}>
                    {option.number}
                </MenuItem>
                ))}
        </TextField><br/>
        {
          debitAccountSelected && 
          <><label style={labelStyle}>Available funds: {funds} {currencySelectedDebit} </label><br/><br/></>
        }
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Amount" variant="standard" 
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
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
      <Button sx={{mt: 3, m: 1, backgroundColor: "#150E56", '&:hover': {backgroundColor: "#150E56",} }} variant="contained" 
        onClick={handleClick}>
            Submit
      </Button>
      </Paper> 
      </Box>
      </>
  );
}
