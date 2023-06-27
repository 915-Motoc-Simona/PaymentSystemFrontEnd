import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

function PersonalInfo() {
  const paperStyle={padding: '2rem', width:'79%', marginLeft:"18%", marginRight: "3%"}
  const paperStyleAddress={padding: '2rem', width:'98%'}
  const user = JSON.parse(localStorage.getItem("user")).data

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
        <h1>Personal information</h1>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic-name" label="Username" variant="standard" fullWidth
            value={user.username}
            readonly={true}/>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="Full name" variant="standard" fullWidth 
              value={user.fullname}
              readonly={true}/>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Email" variant="standard" fullWidth 
              value={user.email}
              readonly={true}/>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="Phone number" variant="standard" fullWidth 
              value={user.phoneNumber}
              readonly={true}/>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Role" variant="standard" fullWidth 
              value={user.role}
              readonly={true}/>
        <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '30ch', flexGrow: 2,},
            }}
            noValidate
            autoComplete="off"

        >
        <Paper elevation = {5} style={paperStyleAddress}>
        <h2>Address</h2>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Country" variant="standard" fullWidth 
              value={user.address.country}
              readonly={true}/>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="City" variant="standard" fullWidth 
              value={user.address.city}
              readonly={true}/>
        <TextField sx={{m: 1, width: '40%'}} id="outlined-basic" label="Street and number" variant="standard" fullWidth 
              value={user.address.streetPlusNumber}
              readonly={true}/>
        <TextField sx={{m: 1, width: '40%', ml: 15}} id="outlined-basic" label="Zipcode" variant="standard" fullWidth 
              value={user.address.zipcode}
              readonly={true}/>      
        </Paper>
        </Box>
      </Paper>
      </Box>
    </>
  );
}

export default PersonalInfo;