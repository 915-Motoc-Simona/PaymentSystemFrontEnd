import React from 'react'
import {useState, useEffect} from 'react';
import { TextField, Paper, Box } from '@material-ui/core';
import { grey } from '@mui/material/colors';
import { Switch, FormControlLabel } from '@mui/material';

export default function UpdateUserForm({ props, setUpdateUser }) {
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity]=useState("")  
    const [country, setCountry]=useState("")  
    const [zipcode, setZipcode]=useState(props.address.zipcode)  
    const [streetPlusNumber, setStreetPlusNumber]=useState("")  
    const [phoneNumber, setPhoneNumber]=useState("")
    const [twoFAEnabled, setTwoFAEnabled]=useState(false)
    const paperStyle={ width:'98%'}
    const paperStyleAddress={padding: '1rem', width:'98%'}

    const handleFullname = (event) => {
        setFullname(event.target.value)
    }

    const handleEmail = (event) => {
        setEmail(event.target.value)
    }
    
    useEffect(() => {
        if( fullname === "")
            setFullname(props.fullname)
        if( country === "")
            setCountry(props.address.country)
        if( city === "")
            setCity(props.address.city)
        if( streetPlusNumber === "")
            setStreetPlusNumber(props.address.streetPlusNumber)
        if( zipcode === props.address.zipcode)
            setZipcode(props.address.zipcode)
        if( email === "")
            setEmail(props.email)
        if( phoneNumber === "" )
            setPhoneNumber(props.phoneNumber)
        const updatedUser = {id: props.id, username: props.username, password: props.password, fullname: fullname, address: {id: props.address.id, country, city, streetPlusNumber, zipcode}, email: email, phoneNumber: phoneNumber, twoFAEnabled: twoFAEnabled}
        console.log("user form " + updatedUser)
        setUpdateUser(updatedUser)
    }, [fullname, country, city, streetPlusNumber, zipcode, email, phoneNumber, twoFAEnabled])


    return (
        <>
        <Box component="form" sx={{ m: 10, display: 'flex'}}>
            <Paper style={paperStyle}>
                <h1>Update user</h1>
                <TextField
                    sx={{m: 1}}
                    label="Username"
                    margin="normal"
                    defaultValue={props.username}
                    inputProps={
                        { readOnly: true, }
                    }
                    color='secondary'
                    
                /><br/>
                <TextField
                    sx={{m: 1,  ml: 15}}   
                    defaultValue={props.fullname}
                    label="Full name"
                    margin="normal"
                    onChange={handleFullname}
                /><br/>
                <TextField
                    defaultValue={props.email}
                    label="Email"
                    margin="normal"
                    onChange={handleEmail}
                /><br/>
                <TextField margin="normal" id="outlined-basic" label="Phone number" variant="standard" 
                value={props.phoneNumber}
                onChange={(e)=>setPhoneNumber(e.target.value)}/>  <br/>
                <FormControlLabel control={<Switch checked={twoFAEnabled} onChange={(e)=>setTwoFAEnabled(e.target.checked)} />} label="Two Factor Authentication" sx={{ color: grey[600] }} />        
                <Box
                        component="form"
                        sx={{
                        '& > :not(style)': { m: 2, width: '30ch', flexGrow: 2, justifyContent: 'space-evenly'},
                        }}
                        noValidate
                        autoComplete="off"
                    >
                    <Paper elevation = {3} style={paperStyleAddress}>
                        <h2>Address</h2>
                        <TextField margin="normal" sx={{m: 1, width: '40%'}} id="outlined-basic" label="Country" variant="standard"
                            value={props.address.country}
                            onChange={(e)=>setCountry(e.target.value)}/>
                        <TextField margin="normal" sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="City" variant="standard" 
                            value={props.address.city}
                            onChange={(e)=>setCity(e.target.value)}/><br/>
                        <TextField margin="normal" sx={{m: 1, width: '40%'}} id="outlined-basic" label="Street and number" variant="standard" 
                            value={props.address.streetPlusNumber}
                            onChange={(e)=>setStreetPlusNumber(e.target.value)}/>
                        <TextField margin="normal" sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="Zipcode" variant="standard"
                            value={props.address.zipcode}
                            onChange={(e)=>setZipcode(e.target.value)}/>      
                    </Paper>
                </Box>     
            </Paper>
        </Box>
        </>

    )
}