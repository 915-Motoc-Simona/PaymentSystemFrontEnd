import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button, Switch, FormControlLabel } from '@mui/material';
import authHeader from './auth-header';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from "react-router-dom"
import Autocomplete from '@mui/material/Autocomplete';
import { grey } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import ErrorModal from './ErrorModal';

const labelStyle = {
  fontSize: 12,
  color: "grey", 
  marginBottom: 10,
  marginLeft: 8
};

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: "#1597BB",
    '&:hover': {
      backgroundColor: alpha("#117A65", theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: "#1597BB",
  },
}));

export default function RegisterPaymentForm() {
    const navigate = useNavigate();
    const paperStyle={padding: '2rem', width:'79%', marginLeft:"18%", marginRight: "3%"}
    const [type, setType]=useState("")
    const [debitAccount, setDebitAccount]=useState({id: "", accountStatus: "", address: "", currency: "", name: "", number: "", owner: "", status: ""})
    const [creditAccount, setCreditAccount]=useState({id: "", accountStatus: "", address: "", currency: "", name: "", number: "", owner: "", status: ""})  
    const [currency, setCurrency]=useState("")
    const [amount, setAmount]=useState(0)
    const [creditAccountNumber, setCreditAccountNumber]=useState("")
    const [debitAccountNumber, setDebitAccountNumber]=useState("")
    const [funds, setFunds] = useState("")
    const [currencySelectedDebit, setCurrenctySelectedDebit] = useState("")
    const [debitAccountSelected, setDebitAccountSelected] = useState(false)

    const [currencies, setCurrencies]=useState([])
    const [creditAccounts, setCreditAccounts]=useState([])
    const [debitAccounts, setDebitAccounts]=useState([])
    const types=["INTERNAL", "EXTERNAL"]

    const [operation, setOperation] = useState(true);
    const [operationLabel, setOperationLabel] = useState("Send money")

    const [friends, setFriends] = useState([]);
    const [friend, setFriend] = useState([]);

    const [error, setError] = useState(null)

    const handleChangeOpration = () => {
      setOperation(!operation);
      if(operationLabel === "Send money") {
        setOperationLabel("Request money"); 
      } else {
        setOperationLabel("Send money"); 
      }
    }

    const handleModalClose = () => {
      setError(null);
    };
  
  
    const handleClick=async(e)=> {
      e.preventDefault()
      if(operation) {
            var debitAccountResponse;
            try {
              debitAccountResponse = await fetch(`http://localhost:8080/accounts/${debitAccountNumber}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader(),
                },
              });
              console.log(debitAccountResponse)
              if (!debitAccountResponse.ok) {
               const errorResponse = await debitAccountResponse.text();
               throw new Error(errorResponse || "Debit account does not exist");
              }
            } catch (err) {
              console.log(err.message)
              setError(err.message);
              console.log(error)
              return
            }
            var creditAccountResponse;
            try {
              creditAccountResponse = await fetch(`http://localhost:8080/accounts/${creditAccountNumber}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader(),
                },
              });
              console.log(creditAccountNumber)
              if (!creditAccountResponse.ok) {
               const errorResponse = await creditAccountResponse.text();
               throw new Error(errorResponse || "Credit account does not exist");
              }
            } catch (err) {
              console.log(err.message)
              setError(err.message);
              console.log(error)
              return
            }

        var creditAccountToBeSent, debitAccountToBeSent, responseCredit;
        console.log(debitAccountNumber)
        if(debitAccountNumber !== null && debitAccountNumber !== undefined && debitAccountNumber !== "") { // admin mode
          debitAccountToBeSent = await debitAccountResponse.json();
          creditAccountToBeSent = await creditAccountResponse.json();
        } else { // client mode
          debitAccountToBeSent = debitAccount
          try {
            responseCredit = await fetch(`http://localhost:8080/accounts/${friend}/0/${currency}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader(),
                },
              });
              console.log(responseCredit)
              if (!responseCredit.ok) {
                const errorResponse = await responseCredit.text();
                throw new Error(errorResponse);
                }
          } catch (err) {
            setError(err.message);
            return
          }
          creditAccountToBeSent = await responseCredit.json()
        }
        
        const payment={type: "SEND", debitBankAccount: debitAccountToBeSent, creditBankAccount: creditAccountToBeSent, currency: currency, amount: amount}
        console.log("Payment: " + JSON.stringify(payment))
        try{
        const paymentResponse = await fetch("http://localhost:8080/payments", {
            method:"POST",
            headers:new Headers({
              "Content-Type":"application/json",
              ...authHeader()
            }),
            body:JSON.stringify(payment)
          })
          setType('')
          setDebitAccount({id: '', accountStatus: '', address: '', currency: '', name: '', number: '', status: '', owner: ''})
          setCreditAccount({id: '', accountStatus: '', address: '', currency: '', name: '', number: '', status: '', owner: ''})
          setCurrency('')
          setAmount('')
          setDebitAccountSelected(false);
          setCreditAccountNumber('')
          setDebitAccountNumber('')
          setFriend('')
          setDebitAccountNumber('')
          setCreditAccountNumber('')
          console.log(paymentResponse)
          if (!paymentResponse.ok) {
            const errorResponse = await paymentResponse.text();
            throw new Error(errorResponse || "Payment cannot be initiated");
           }
        } catch (err) 
        {
          setError(err.message);
          return
        }
      } else { //request money
          var responseDebit
          var responseCredit
          try{
            responseDebit = await fetch(`http://localhost:8080/accounts/${friend}/${amount}/${currency}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader(),
                },
              });
            console.log(responseDebit);
            if (!responseDebit.ok) {
              const errorResponse = await responseDebit.text();
              throw new Error(errorResponse);
              }

          } catch (err) {
            setError(err.message);
            return
          }
          try {
            responseCredit = await fetch(`http://localhost:8080/accounts/${JSON.parse(localStorage.getItem("user")).data.username}/0/${currency}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeader(),
                },
              });
              console.log(responseCredit)
              if (!responseCredit.ok) {
                const errorResponse = await responseCredit.text();
                throw new Error(errorResponse);
                }
          } catch (err) {
            setError(err.message);
            return
          }
          const resultDebit = await responseDebit.json()
          const resultCredit = await responseCredit.json()
          const payment={type: "REQUEST", debitBankAccount: resultDebit, creditBankAccount: resultCredit, currency: currency, amount: amount}
          console.log("Payment: " + JSON.stringify(payment))
          try{
            const paymentResponse = await fetch("http://localhost:8080/payments", {
                method:"POST",
                headers:new Headers({
                  "Content-Type":"application/json",
                  ...authHeader()
                }),
                body:JSON.stringify(payment)
              })
              console.log(paymentResponse)
              if (!paymentResponse.ok) {
                const errorResponse = await paymentResponse.text();
                throw new Error(errorResponse || "Payment cannot be initiated");
               }
               setType('')
               setDebitAccount({id: '', accountStatus: '', address: '', currency: '', name: '', number: '', status: '', owner: ''})
               setCreditAccount({id: '', accountStatus: '', address: '', currency: '', name: '', number: '', status: '', owner: ''})
               setCurrency('')
               setAmount('')
               setDebitAccountSelected(false);
               setCreditAccountNumber('')
               setDebitAccountNumber('')
               setFriend('')
            } catch (err) 
            {
              setError(err.message);
              return
            }
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
            }
            )
            fetch(`http://localhost:8080/payments/friends`, {
              method: 'GET',
              headers:  new Headers({
                "Content-Type":"application/json",
                ...authHeader()
              })})
              .then(res=>res.json())
              .then((result)=>{
                console.log("Friends " + JSON.stringify(result));
                setFriends(result);
              }
              )
        } else if(JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN"){
          fetch(`http://localhost:8080/accounts/notClosed`, {
            method: 'GET',
            headers:  new Headers({
              "Content-Type":"application/json",
              ...authHeader()
            })})
            .then(res=>res.json())
            .then((result)=>{
              setCreditAccounts(result);
              setDebitAccounts(result);
            }
            )
        }
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
    }).catch(error => {
      setError(error.message)
    });
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
        <h1> Initiate new payment</h1><br/>
        {
          JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" &&
          <>
          <FormControlLabel control={<CustomSwitch checked={operation} onChange={handleChangeOpration} />} label={operationLabel} sx={{ color: grey[600] }} /> <br/><br/>
          </>  
        }
        {
          operation && JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" &&
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
          !operation && JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" &&
          <Autocomplete
            freeSolo
            id="combo-box-demo"
            options={friends.map((option) => {return option.username})}
            sx={{m: 1, width: '40%'}}
            renderInput={(params) => <TextField {...params} variant="standard" label="From" />}
            onChange={(event, value) => {setFriend(value)}}
          />
        }
        {
          JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN" &&
          <Autocomplete
            freeSolo
            id="combo-box-demo"
            options={debitAccounts.map((option) => {return option.number + " - " + option.owner.username})}
            sx={{m: 1, width: '40%'}}
            renderInput={(params) => <TextField {...params} variant="standard"  label="From" />}
            onChange={(event, value) => {
                setDebitAccountSelected(true)
                const [number] = value.split("-"); 
                setDebitAccountNumber(number);
                getFunds(number);
              }}
          />
        }
        {
          debitAccountSelected && 
          <><br/><label style={labelStyle}>Available funds: {funds} {currencySelectedDebit} </label><br/></>
        }
        {
          operation && JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" &&
            <Autocomplete
            freeSolo
            id="combo-box-demo"
            options={friends.map((option) => {return option.username})}
            sx={{m: 1, width: '40%'}}
            renderInput={(params) => <TextField {...params} variant="standard" label="To" />}
            onChange={(event, value) => {setFriend(value)}}
          />
        }
        {
          JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN" &&
          <Autocomplete
            freeSolo
            id="combo-box-demo"
            options={creditAccounts.map((option) => {return option.number + " - " + option.owner.username})}
            sx={{m: 1, width: '40%'}}
            renderInput={(params) => <TextField {...params} variant="standard" label="To" />}
            onChange={(event, value) => {const [number] = value.split("-"); setCreditAccountNumber(number)}}
          />
        }
        {  JSON.parse(localStorage.getItem("user")).data.role === "ROLE_CLIENT" && <><br/><br/><br/></> }
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Amount" variant="standard"  fullWidth 
              value={amount}
              onChange={(e)=>setAmount(e.target.value)}>
        </TextField>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="Currency" variant="standard"  fullWidth 
              value={currency}
              select
              onChange={(e)=>setCurrency(e.target.value)}>
                {currencies.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
                ))}
        </TextField><br/>
                  
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
