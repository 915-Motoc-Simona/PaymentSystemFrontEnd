import React from 'react'
import {useState, useEffect} from 'react';
import { TextField } from '@material-ui/core';
import MenuItem from '@mui/material/MenuItem';
import authHeader from './auth-header';
import Login from './Login';

export default function UpdateAccountForm({ props, setUpdateAccount }) {
    const [accountStatus, setAccountStatus] = useState('')
    const [city, setCity]=useState("")  
    const [country, setCountry]=useState("")  
    const [zipcode, setZipcode]=useState(props.address.zipcode)  
    const [streetPlusNumber, setStreetPlusNumber]=useState("")  
    const [name, setName] = useState('')

    const [currencies, setCurrencies]=useState([])
    const [accountStatuses, setAccountStatuses]=useState([])

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
      }
      else{
        console.log("Redirect to login");
        <Login/>
      }
    }, [])


    const handleName = (event) => {
        setName(event.target.value)
    }
    
    useEffect(() => {
        if( accountStatus === "")
            setAccountStatus(props.accountStatus)
        if( name === "")
            setName(props.name)
        if( country === "")
            setCountry(props.address.country)
        if( city === "")
            setCity(props.address.city)
        if( streetPlusNumber === "")
            setStreetPlusNumber(props.address.streetPlusNumber)
        if( zipcode === props.address.zipcode)
            setZipcode(props.address.zipcode)
        const updatedAccount = {id: props.id, number: props.number, name: name, currency: props.currency, address: {id: props.address.id, country, city, streetPlusNumber, zipcode}, accountStatus: accountStatus, owner: props.owner}
        console.log("account form " + updatedAccount)
        setUpdateAccount(updatedAccount)
    }, [accountStatus, name, country, city, streetPlusNumber, zipcode])


    return (
        <>
            <TextField
                variant="standard"
                label="Number"
                margin="normal"
                fullWidth
                defaultValue={props.number}
                inputProps={
                    { readOnly: true, }
                }
                color='secondary'
                
            />
            <br />

            <TextField
                variant="standard"
                defaultValue={props.name}
                label="Name"
                margin="normal"
                fullWidth
                onChange={handleName}
                
            />
            <br />
            <TextField
                variant="standard"
                label="Currency"
                margin="normal"
                fullWidth
                defaultValue={props.currency}
                inputProps={
                    { readOnly: true, }
                }
                color='secondary'
                
            />
            <br />
            <TextField id="outlined-basic-account-status" label="Account status" margin="normal" fullWidth 
              value={props.accountStatus}
              select
              onChange={(e)=>setAccountStatus(e.target.value)}>
                {accountStatuses.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
                ))}
            </TextField>    
            
        </>

    )
}