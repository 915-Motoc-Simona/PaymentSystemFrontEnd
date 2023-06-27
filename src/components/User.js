import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button, Modal, Typography } from '@mui/material';
import UpdateUserForm from './UpdateUserForm';
import authHeader from './auth-header';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import {useNavigate} from "react-router-dom"
import PersonalInfo from './PersonalInfo';
import Autocomplete from '@mui/material/Autocomplete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#7B113A",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 17,
  },
}));


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const style = {
  position: 'absolute', 
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height:'90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  margin: 10,
  paddingLeft: 10,
};

export default function User() {
  const [users, setUsers]=useState([])
  const navigate = useNavigate();
  const [user, setUser]=useState('')
  const [role, setRole]=useState('')
  const [usernameFilter, setUsernameFilter] = useState('')

  const [open, setOpen] = React.useState(false);
  const [updateUser, setUpdateUser] = useState({ id: '', username: '', password: '', fullname: '', address: '', email: '', status: '' });
  const handleOpen = (user) => {
    setUpdateUser(user)
    setOpen(true)
  };

  const [openSeeDetails, setOpenSeeDetails] = React.useState(false);
  const [userToSeeDetailsFor, setUserToSeeDetailsFor] = React.useState(0);

  const handleOpenSeeDetails = (user) => {
    setUserToSeeDetailsFor(user.id)
    setOpenSeeDetails(!openSeeDetails)
  };

  const [openSeeDetailsAudit, setOpenSeeDetailsAudit] = React.useState(false);
  const [userToSeeDetailsAuditFor, setUserToSeeDetailsAuditFor] = React.useState(0);

  const handleOpenSeeDetailsAudit = (user) => {
    setUserToSeeDetailsAuditFor(user.id)
    setOpenSeeDetailsAudit(!openSeeDetailsAudit)
  };

  const [openSeeAudit, setOpenSeeAudit] = React.useState(false);
  const [userToSeeAuditFor, setUserToSeeAuditFor] = React.useState(0);
  const [audit, setAudit]=useState([]);

  const handleOpenAudit = async (user) => {
      setOpenSeeAudit(!openSeeAudit)
      setUserToSeeAuditFor(user.id)
      const userId = user.id
      console.log(userId)
      fetch(`http://localhost:8080/users/audit/${userId}`, {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setAudit(result);
          console.log(audit);
        }
        )
  }
  
  const handleClose = () => setOpen(false);

  const handleSubmit = async (user) => {
    fetch(`http://localhost:8080/users/${user.id}`, {
      method:"PUT",
      headers: new Headers({
        "Content-Type":"application/json",
        ...authHeader()
      }),
      body:JSON.stringify(user)
    }).then(()=>{
      console.log("User updated")
      fetch("http://localhost:8080/users", {
            method: 'GET',
            headers:  new Headers({
                "Content-Type":"application/json",
                ...authHeader()
      })})
       .then(res=>res.json())
       .then((result)=>{
      setUsers(result);
      setOpen(false);
    }
    )
    })
  }


  const remove = async (id) => {
    console.log(id)
    await fetch(`http://localhost:8080/users/delete/${id}`, {
        method: 'PUT',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...authHeader()
        })
    }).then(() => {
      console.log("User deleted")
      fetch("http://localhost:8080/users", {
            method: 'GET',
            headers:  new Headers({
                "Content-Type":"application/json",
                ...authHeader()
    })})
       .then(res=>res.json())
       .then((result)=>{
      setUsers(result);
    }
    )
    });
}

  const [usersFilter, setUsersFilter] = useState([])
  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("user"))){
      setUser(JSON.parse(localStorage.getItem("user")).data)
      setRole(JSON.parse(localStorage.getItem("user")).data.role)
      if(role === "ROLE_ADMIN"){
        fetch("http://localhost:8080/users", {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          console.log(result);
          setUsersFilter(result);
          setUsers(result);
        }
        )
    }
  }
  else{
    navigate('/authentication/signin');
  }
}, [navigate, role])

const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(10);

// Avoid a layout jump when reaching the last page with empty rows.
const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const handleApplyFilter = () => {
  if(usernameFilter !==  null) {
    fetch(`http://localhost:8080/users/filter/${usernameFilter}`, {
          method: 'GET',
          headers:  new Headers({
            "Content-Type":"application/json",
            ...authHeader()
          })})
          .then(res=>res.json())
          .then((result)=>{
            console.log(result);
            setUsers(result);
          }
          )
  } else {
    fetch("http://localhost:8080/users", {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          console.log(result);
          setUsers(result);
        }
        )
  }
}

  return (
    <>
    { role === "ROLE_ADMIN" &&
    <>
    <Box sx={{ '& > :not(style)': { m: 4, width: '30ch', flexGrow: 2, mb: 2,},}}>
    <Paper elevation={16} style={{width:'82%', marginLeft:"16%", marginRight: "2%"}} >
      <Autocomplete
            options={usersFilter.map((option) => {return option.username})}
            sx={{ml: '2%', mb: '2%', mt: '2%', width: '40%'}}
            renderInput={(params) => <TextField {...params} variant="standard" label="Username" />}
            onChange={(event, value) => {setUsernameFilter(value)}}
      /><br/>
      <Button sx={{ml: '2%', mb: '2%'}} variant="outlined" onClick={() => handleApplyFilter()}> Apply filter</Button>
    </Paper>
    </Box>
    <Box sx={{ '& > :not(style)': {width: '30ch', flexGrow: 2}, height: '90ch'}}>
    <Paper elevation={16} style={{width:'82%', marginLeft:"16%"}} >
    <TableContainer>
      <Table aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <StyledTableCell><b>User</b></StyledTableCell>
            <StyledTableCell> </StyledTableCell>
            <StyledTableCell><b>Status</b></StyledTableCell>
            <StyledTableCell><b>Actions</b></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : users
          ).map((row) => (
            <>
            <TableRow key={row.username}>
              <TableCell component="th" scope="row" >
                <b>{row.username}</b>
              </TableCell>
              <TableCell sx = {{ width: 700 }}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => handleOpenSeeDetails(row)}
                >
                  {openSeeDetails ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell>
                {row.status}
              </TableCell>
              <TableCell>
                <Button sx={{m: 1}} variant="outlined" color='success' disabled={row.status === "DELETED" || row.status === "PENDING" } onClick={() => handleOpen(row)}> Update</Button> 
                <Button sx={{m: 1}} variant="outlined" color="error" disabled={row.status === "DELETED" || row.status === "PENDING" } onClick={() => remove(row.id)}> Delete </Button>
                <Button sx={{m: 1}} variant="outlined" onClick={() => handleOpenAudit(row)}> See audit</Button>

                <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography id="modal-modal-description" sx={{ m: 1 }}>
                        <UpdateUserForm props={updateUser} setUpdateUser={setUpdateUser}></UpdateUserForm>
                        </Typography>
                        <Button variant="outlined" color='success' onClick={() => handleSubmit(updateUser)}> Submit</Button> 
                        <Button variant="outlined" color="error" onClick={handleClose}> Cancel </Button>
                      </Box>
                </Modal>

              </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeDetails && userToSeeDetailsFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, paddingLeft: 3 }}>
                  <Typography gutterBottom component="div">
                    <b>User details</b>
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Fullname</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Street and number</TableCell>
                        <TableCell>Zipcode</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone number</TableCell>
                        <TableCell>Two FA</TableCell>
                        <TableCell>Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell> {row.username} </TableCell>
                        <TableCell> {row.fullname} </TableCell>
                        <TableCell> {row.address.country} </TableCell>
                        <TableCell> {row.address.city} </TableCell>
                        <TableCell> {row.address.streetPlusNumber} </TableCell>
                        <TableCell> {row.address.zipcode} </TableCell>
                        <TableCell> {row.email} </TableCell>
                        <TableCell> {row.phoneNumber} </TableCell>
                        <TableCell> {row.twoFAEnabled ? 'yes' : 'no'} </TableCell>
                        <TableCell> {row.role.name} </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
              </TableCell>
          </TableRow>

          <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeAudit && userToSeeAuditFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, paddingLeft: 3  }}>
                  <Typography gutterBottom component="div">
                    <b>User audit</b>
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>User who modified</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Operation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {audit.map((row) => (
                        <>
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" onClick={() => handleOpenSeeDetailsAudit(row)}>
                            {row.username}
                          </TableCell>
                          <TableCell>{row.modifiedByUserWithUsername}</TableCell>
                          <TableCell>{row.dateTime}</TableCell>
                          <TableCell>{row.operation}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={openSeeDetailsAudit && userToSeeDetailsAuditFor === row.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography style={{fontSize: 13}} gutterBottom component="div">
                              Username: {row.username} <br/>
                              Full name: {row.fullname} <br/>
                              Country: {row.address.country} <br/>
                              City: {row.address.city} <br/>
                              Street and number: {row.address.streetPlusNumber} <br/>
                              Zipcode: {row.address.zipcode} <br/>
                              Email: {row.email} <br/>
                              Phone number: {row.phoneNumber} <br/>
                              Two FA: {row.twoFAEnabled ? 'yes' : 'no'} <br/>
                              Role: {row.role.name} <br/>
                            </Typography>
                          </Box>
                        </Collapse>
                        </TableCell>
                        </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
              </TableCell>
          </TableRow>

          </>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows}}>
              <TableCell colSpan={6} />
            </TableRow>
          )}

        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={6}
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    </Paper>
    </Box>
    </>
    }
    {
      role === "ROLE_CLIENT" && <PersonalInfo/>
    }
    </>

  );
}
