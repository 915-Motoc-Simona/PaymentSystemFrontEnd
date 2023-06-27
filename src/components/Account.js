import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button, Modal, Typography } from '@mui/material';
import authHeader from './auth-header';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
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
import UpdateAccountForm from './UpdateAccountForm';
import {useNavigate} from "react-router-dom"
import TextField from '@mui/material/TextField';
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
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Account() {
  const navigate = useNavigate();

  const [accounts, setAccounts]=useState([])

  const [openSeeDetails, setOpenSeeDetails] = React.useState(false);
  const [accountToSeeDetailsFor, setAccountToSeeDetailsFor] = React.useState(0);
  const [accountToSeeBalanceFor, setAccountToSeeBalanceFor] = React.useState(0);
  const [balance, setBalance] = React.useState({id: '', bankAccount: '', dateTime: '', 
                availableAmountCredit: '', availableCountCredit: '', availableAmountDebit: '', availableCountDebit: '',
                pendingAmountCredit: '', pendingCountCredit: '', pendingAmountDebit: '', pendingCountDebit: ''
              });

  const [openSeeDetailsAudit, setOpenSeeDetailsAudit] = React.useState(false);
  const [accountToSeeDetailsAuditFor, setAccountToSeeDetailsAuditFor] = React.useState(0);

  const[user, setUser]=React.useState('')
  const[role, setRole]=React.useState('')

            
  const handleOpenSeeDetailsAudit = (account) => {
      setAccountToSeeDetailsAuditFor(account.id)
      setOpenSeeDetailsAudit(!openSeeDetailsAudit)
  };

  const handleOpenSeeDetails = (account) => {
    setAccountToSeeDetailsFor(account.id)
    setOpenSeeDetails(!openSeeDetails)
    setAccountToSeeBalanceFor(account.id)
    fetch(`http://localhost:8080/balances/bankAccount/${account.id}`, {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setBalance(result);
          console.log(balance);
        }
        )

  };

  const [openSeeAudit, setOpenSeeAudit] = React.useState(false);
  const [accountToSeeAuditFor, setAccountToSeeAuditFor] = React.useState(0);
  const [audit, setAudit]=useState([]);

  const handleOpenAudit = async (account) => {
      setOpenSeeAudit(!openSeeAudit)
      setAccountToSeeAuditFor(account.id)
      const accountId = account.id
      console.log(accountId)
      fetch(`http://localhost:8080/accounts/audit/${accountId}`, {
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

  const [openSeeBalanceAudit, setOpenSeeBalanceAudit] = React.useState(false);
  const [accountToSeeBalanceAuditFor, setAccountToSeeBalanceAuditFor] = React.useState(0);
  const [balanceAudit, setBalanceAudit]=useState([]);

  const handleOpenBalanceAudit = async (account) => {
    setOpenSeeBalanceAudit(!openSeeBalanceAudit)
    setAccountToSeeBalanceAuditFor(account.id)
    const accountId = account.id
    console.log(accountId)
    fetch(`http://localhost:8080/balances/audit/${accountId}`, {
      method: 'GET',
      headers:  new Headers({
        "Content-Type":"application/json",
        ...authHeader()
      })})
      .then(res=>res.json())
      .then((result)=>{
        setBalanceAudit(result);
        console.log(balanceAudit);
      }
      )
}

  const [openSetBalance, setOpenSetBalance] = React.useState(false);
  const [amount, setAmount]=useState([])
  const [accountToSetBalanceFor, setAccountToSetBalanceFor]=useState(0);
  const handleOpenSet = (account) => {
    setAccountToSetBalanceFor(account.id)
    setOpenSetBalance(true)
  };
  const handleCloseSet = () => setOpenSetBalance(false);
  const handleSetBalance = async (account) => {
    console.log(account)
    console.log(amount);
    fetch(`http://localhost:8080/payments/set/${account}`, {
      method:"PUT",
      headers: new Headers({
        "Content-Type":"application/json",
        ...authHeader()
      }),
      body: amount
    }).then(() => {
      fetch(`http://localhost:8080/balances/bankAccount/${account}`, {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setBalance(result);
          console.log(balance);
          setOpenSetBalance(false);
        }
        )
    })
  };

  const [open, setOpen] = React.useState(false);
  const [updateAccount, setUpdateAccount] = useState({ id: '', number: '', name: '', address: {country: '', city: '', streetPlusNumber: '', zipcode: 0}, currency: '', accountStatus: '', status: '' });
  const handleOpen = (account) => {
    setUpdateAccount(account)
    setOpen(true)
  };
  const handleClose = () => setOpen(false);
  const handleSubmit = async (account) => {
    console.log(account)
    fetch(`http://localhost:8080/accounts/${account.id}`, {
      method:"PUT",
      headers: new Headers({
        "Content-Type":"application/json",
        ...authHeader()
      }),
      body:JSON.stringify(account)
    }).then(()=>{
      console.log("Account update request")
      fetch("http://localhost:8080/accounts", {
            method: 'GET',
            headers:  new Headers({
                "Content-Type":"application/json",
                ...authHeader()
      })})
       .then(res=>res.json())
       .then((result)=>{
      setAccounts(result);
      setOpen(false);
    }
    )
    })
  }
  const remove = async (id) => {
    console.log(id)
    await fetch(`http://localhost:8080/accounts/delete/${id}`, {
        method: 'PUT',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...authHeader()
        })
    }).then(() => {
      console.log("Delete request for account")
      if(role === "ROLE_ADMIN"){
        fetch("http://localhost:8080/accounts", {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setAccounts(result);
        }
        )
      } else if (role === "ROLE_CLIENT") {
        console.log(user)
        fetch(`http://localhost:8080/accounts/client/${user}`, {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setAccounts(result);
        }
        )
      }
    });
}

  const [users, setUsers] = useState([])
  const [usernameFilter, setUsernameFilter] = useState('')
  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("user"))){
      setUser(JSON.parse(localStorage.getItem("user")).data.username)
      setRole(JSON.parse(localStorage.getItem("user")).data.role)
      if(role === "ROLE_ADMIN"){
        fetch("http://localhost:8080/accounts", {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setAccounts(result);
        }
        )
        fetch("http://localhost:8080/users/clients", {
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
      } else if (role === "ROLE_CLIENT") {
        console.log(user)
        fetch(`http://localhost:8080/accounts/client/${user}`, {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setAccounts(result);
        }
        )
      }
  }
  else{
    navigate('/authentication/signin');
  }
}, [navigate, user, role])

const handleApplyFilter = () => {
  console.log(usernameFilter)
  if(usernameFilter !== null) {
    fetch(`http://localhost:8080/accounts/filter/${usernameFilter}`, {
          method: 'GET',
          headers:  new Headers({
            "Content-Type":"application/json",
            ...authHeader()
          })})
          .then(res=>res.json())
          .then((result)=>{
            console.log(result);
            setAccounts(result);
          }
          )
    } else {
      fetch("http://localhost:8080/accounts", {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          setAccounts(result);
        }
        )
    } 
}

const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(10);

// Avoid a layout jump when reaching the last page with empty rows.
const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - accounts.length) : 0;

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

  return (
    <>
    { role === "ROLE_ADMIN" &&
    <Box sx={{ '& > :not(style)': { m: 4, width: '30ch', flexGrow: 2, mb: 2,},}}>
    <Paper elevation={10} style={{width:'81%', marginLeft:"17%", marginRight: "2%"}} >
      <Autocomplete
            options={users.map((option) => {return option})}
            sx={{ml: '2%', mb: '2%', mt: '2%', width: '40%'}}
            renderInput={(params) => <TextField {...params} variant="standard" label="Username" />}
            onChange={(event, value) => {setUsernameFilter(value)}}
      /><br/>
      <Button sx={{ml: '2%', mb: '2%'}} variant="outlined" onClick={() => handleApplyFilter()}> Apply filter</Button>
    </Paper>
    </Box> 
    }
    <Box sx={{ '& > :not(style)': {width: '30ch', flexGrow: 2},}}>
    <Paper elevation={8} style={{width:'81%', marginLeft:"17%", marginTop: "2%", marginBottom: "2%"}}>
    <TableContainer>
      <Table aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <StyledTableCell> <b> Account </b> </StyledTableCell>
            {role === "ROLE_ADMIN" && <StyledTableCell> <b> Owner </b> </StyledTableCell>}
            <StyledTableCell> </StyledTableCell>
            <StyledTableCell> <b> Status </b> </StyledTableCell>
            <StyledTableCell> <b> Actions </b></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? accounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : accounts
          ).map((row) => (
            <>
            <TableRow key={row.number}>
              <TableCell component="th" scope="row" >
                <b>{row.number}</b>
              </TableCell>
              {role === "ROLE_ADMIN" && 
                <TableCell component="th" scope="row" >
                  <b>{row.owner.username}</b>
                </TableCell>
              }
              <TableCell sx = {{ width: 560 }}>
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
                {JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN" && 
                <Button sx={{m: 1}} variant="outlined" color='success' disabled={row.status === "DELETED" || row.status === "APPROVE" } onClick={() => handleOpen(row)}> Update</Button> 
                }
                <Button sx={{m: 1}} variant="outlined" color="error" disabled={row.status === "DELETED" || row.status === "APPROVE" } onClick={() => remove(row.id)}> Delete </Button>
                <Button sx={{m: 1}} variant="outlined" onClick={() => handleOpenAudit(row)}> See audit </Button><br/>
                {JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN" && 
                <Button sx={{m: 1}} variant="outlined" color="success" disabled={row.status === "DELETED" || row.status === "APPROVE" } onClick={() => handleOpenSet(row)}> Set balance </Button>
                }
                <Button sx={{m: 1}} variant="outlined" onClick={() => handleOpenBalanceAudit(row)}> See balance audit </Button><br/>
                <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Update account
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <UpdateAccountForm props={updateAccount} setUpdateAccount={setUpdateAccount}></UpdateAccountForm>
                        </Typography>
                        <Button variant="outlined" color='success' onClick={() => handleSubmit(updateAccount)}> Submit</Button> 
                        <Button variant="contained" color="error" onClick={handleClose}> Cancel </Button>
                      </Box>
                </Modal>
                <Modal
                      open={openSetBalance}
                      onClose={handleCloseSet}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography sx={{mb: 3}} id="modal-modal-title" variant="h6" component="h2">
                          Please enter the desired available amount
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, m: 1 }}>
                        <TextField variant="standard" required id="standard-required" label="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
                        </Typography>
                        <Button sx={{m: 1}} variant="outlined" color='success' onClick={() => handleSetBalance(accountToSetBalanceFor)}> Submit</Button> 
                        <Button sx={{m: 2}} variant="outlined" color="error" onClick={handleCloseSet}> Cancel </Button>
                      </Box>
                </Modal>

              </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeDetails && accountToSeeDetailsFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, paddingLeft: 3 }}>
                  <Typography gutterBottom component="div">
                    <b>Account details</b>
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Number</b></TableCell>
                        <TableCell><b>Name</b></TableCell>
                        <TableCell><b>Currency</b></TableCell>
                        <TableCell><b>Account status</b></TableCell>
                        <TableCell><b>Country</b></TableCell>
                        <TableCell><b>City</b></TableCell>
                        <TableCell><b>Street and number</b></TableCell>
                        <TableCell><b>Zipcode</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell> {row.number} </TableCell>
                        <TableCell> {row.name} </TableCell>
                        <TableCell> {row.currency} </TableCell>
                        <TableCell> {row.accountStatus} </TableCell>
                        <TableCell> {row.address.country} </TableCell>
                        <TableCell> {row.address.city} </TableCell>
                        <TableCell> {row.address.streetPlusNumber} </TableCell>
                        <TableCell> {row.address.zipcode} </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
              </TableCell>
          </TableRow>

          <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeDetails && accountToSeeBalanceFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, paddingLeft: 3 }}>
                  <Typography gutterBottom component="div">
                    <b>Balance details</b>
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell> </TableCell>
                        <TableCell><b>Amount Credit</b></TableCell>
                        <TableCell><b>Count Credit</b></TableCell>
                        <TableCell><b>Amount Debit</b></TableCell>
                        <TableCell><b>Count Debit</b></TableCell>
                        <TableCell><b>Total</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><b>Available</b> </TableCell>
                        <TableCell>{balance.availableAmountCredit}</TableCell>
                        <TableCell>{balance.availableCountCredit}</TableCell>
                        <TableCell>{balance.availableAmountDebit}</TableCell>
                        <TableCell>{balance.availableCountDebit}</TableCell>
                        <TableCell>{(balance.availableAmountCredit - balance.availableAmountDebit).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><b>Pending</b> </TableCell>
                        <TableCell>{balance.pendingAmountCredit}</TableCell>
                        <TableCell>{balance.pendingCountCredit}</TableCell>
                        <TableCell>{balance.pendingAmountDebit}</TableCell>
                        <TableCell>{balance.pendingCountDebit}</TableCell>
                        <TableCell>{(balance.pendingAmountCredit - balance.pendingAmountDebit).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell><b>Projected balance: </b></TableCell>
                        <TableCell>{(balance.availableAmountCredit - balance.availableAmountDebit + balance.pendingAmountCredit - balance.pendingAmountDebit).toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
              </TableCell>
          </TableRow>

          <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeAudit && accountToSeeAuditFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, paddingLeft: 3  }}>
                  <Typography gutterBottom component="div">
                    <b>Account audit</b>
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Account Number</b></TableCell>
                        <TableCell><b>User who modified</b></TableCell>
                        <TableCell><b>Timestamp</b></TableCell>
                        <TableCell><b>Operation</b></TableCell>
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
                            {row.number}
                          </TableCell>
                          <TableCell>{row.modifiedByUserWithUsername}</TableCell>
                          <TableCell>{row.dateTime}</TableCell>
                          <TableCell>{row.operation}</TableCell>
                        </TableRow>

                        <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={openSeeDetailsAudit && accountToSeeDetailsAuditFor === row.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography style={{fontSize: 13}} gutterBottom component="div">
                            Number: {row.number} <br/>
                            Name: {row.name} <br/>
                            Owner: {row.owner.username} <br/>
                            Country: {row.address.country} <br/>
                            City: {row.address.city} <br/>
                            Street and number: {row.address.streetPlusNumber} <br/>
                            Zipcode: {row.address.zipcode} <br/>
                            Currency: {row.currency} <br/>
                            Account status: {row.accountStatus} <br/>
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

          <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                <Collapse in={openSeeBalanceAudit && accountToSeeBalanceAuditFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, paddingLeft: 3  }}>
                  <Typography gutterBottom component="div">
                    <b>Balance audit</b>
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Timestamp</b></TableCell>
                        <TableCell><b>Available </b></TableCell>
                        <TableCell/>
                        <TableCell/>
                        <TableCell/>
                        <TableCell><b>Pending </b></TableCell>
                        <TableCell/>
                        <TableCell/>
                        <TableCell/>
                      </TableRow>
                      <TableRow>
                        <TableCell><b> </b></TableCell>
                        <TableCell><b>Amount Credit</b></TableCell>
                        <TableCell><b>Count Credit</b></TableCell>
                        <TableCell><b>Amount Debit</b></TableCell>
                        <TableCell><b>Count Debit</b></TableCell>
                        <TableCell><b>Amount Credit</b></TableCell>
                        <TableCell><b>Count Credit</b></TableCell>
                        <TableCell><b>Amount Debit</b></TableCell>
                        <TableCell><b>Count Debit</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {balanceAudit.map((balance) => (
                        <TableRow
                          key={balance.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell>{balance.dateTimeOfOperation}</TableCell>
                        <TableCell>{balance.availableAmountCredit}</TableCell>
                        <TableCell>{balance.availableCountCredit}</TableCell>
                        <TableCell>{balance.availableAmountDebit}</TableCell>
                        <TableCell>{balance.availableCountDebit}</TableCell>
                        <TableCell>{balance.pendingAmountCredit}</TableCell>
                        <TableCell>{balance.pendingCountCredit}</TableCell>
                        <TableCell>{balance.pendingAmountDebit}</TableCell>
                        <TableCell>{balance.pendingCountDebit}</TableCell>
                        </TableRow>
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
              count={accounts.length}
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

  );
}