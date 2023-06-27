import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button, Typography } from '@mui/material';
import authHeader from './auth-header';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton, { getIconButtonUtilityClass } from '@mui/material/IconButton';
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
import * as FaIcons from 'react-icons/fa';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import TextField from '@mui/material/TextField';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#7B113A",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 17,
  },
}));

function getIcon(payment) {
  console.log(JSON.parse(localStorage.getItem("user")).data.username)
  if (payment.creditBankAccount.owner != null && payment.creditBankAccount.owner.username === JSON.parse(localStorage.getItem("user")).data.username) {
      if(payment.debitBankAccount.owner != null && payment.debitBankAccount.owner.username === JSON.parse(localStorage.getItem("user")).data.username) {
        return <FaIcons.FaArrowsAltH/>
      } else {
        return <FaIcons.FaArrowRight/>
      }
  } else if (payment.debitBankAccount.owner != null && payment.debitBankAccount.owner.username === JSON.parse(localStorage.getItem("user")).data.username) {
      return <FaIcons.FaArrowLeft/>
  } else 
  return <FaIcons.FaPeopleArrows/>
}

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

export default function Payment() {
  const [payments, setPayments]=useState([])
  const navigate = useNavigate();
  const [error, setError] = useState();


  const [openSeeDetails, setOpenSeeDetails] = React.useState(false);
  const [paymentToSeeDetailsFor, setPaymentToSeeDetailsFor] = React.useState(0);

  const handleOpenSeeDetails = (payment) => {
    setPaymentToSeeDetailsFor(payment.id)
    setOpenSeeDetails(!openSeeDetails)
  };

  const [openSeeDetailsAudit, setOpenSeeDetailsAudit] = React.useState(false);
  const [paymentToSeeDetailsAuditFor, setPaymentToSeeDetailsAuditFor] = React.useState(0);

  const handleOpenSeeDetailsAudit = (payment) => {
    setPaymentToSeeDetailsAuditFor(payment.id)
    setOpenSeeDetailsAudit(!openSeeDetailsAudit)
  };

  const [openSeeAudit, setOpenSeeAudit] = React.useState(false);
  const [paymentToSeeAuditFor, setPaymentToSeeAuditFor] = React.useState(0);
  const [audit, setAudit]=useState([]);

  const handleOpenAudit = async (payment) => {
      setOpenSeeAudit(!openSeeAudit)
      setPaymentToSeeAuditFor(payment.id)
      const paymentId = payment.id
      console.log(paymentId)
      fetch(`http://localhost:8080/payments/audit/${paymentId}`, {
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

  const handleCancel = async (event) => {
    console.log(event)
        await fetch(`http://localhost:8080/payments/cancelOngoing/${event.id}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...authHeader()
            })
        }).then(() => {
        console.log("Cancel payment")
        fetch("http://localhost:8080/payments", {
                method: 'GET',
                headers:  new Headers({
                    "Content-Type":"application/json",
                    ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
        setPayments(result);
        }
        )
        })
}

  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("user"))){
      if(JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN"){
        fetch("http://localhost:8080/payments", {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          console.log(result);
          setPayments(result);
        }
        )
      } else {
        fetch("http://localhost:8080/payments/client", {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
          console.log(result);
          setPayments(result);
        }
        )
      }
  }
  else{
    navigate('/authentication/signin');
  }
}, [navigate, ])

const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(10);

// Avoid a layout jump when reaching the last page with empty rows.
const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const handleApplyFilter = (data) => {
  console.log(date);
  console.log(creditAccountFilter)
  if(date !== null || creditAccountFilter !== "" || debitAccountFilter !== "") {
    let localDateTime = null
    if(date !== null) {
     localDateTime = date.format() 
    }
    console.log(localDateTime)
    const url = new URL('http://localhost:8080/payments/filter');
    const params = new URLSearchParams();
    params.append('date', localDateTime);
    params.append('creditAccount', creditAccountFilter);
    params.append('debitAccount', debitAccountFilter);
    url.search = params.toString();

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...authHeader()
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        setPayments(result);
      });
      } else {
    if(JSON.parse(localStorage.getItem("user")).data.role === "ROLE_ADMIN"){
      fetch("http://localhost:8080/payments", {
      method: 'GET',
      headers:  new Headers({
        "Content-Type":"application/json",
        ...authHeader()
      })})
      .then(res=>res.json())
      .then((result)=>{
        console.log(result);
        setPayments(result);
      }
      )
    } else {
      fetch("http://localhost:8080/payments/client", {
      method: 'GET',
      headers:  new Headers({
        "Content-Type":"application/json",
        ...authHeader()
      })})
      .then(res=>res.json())
      .then((result)=>{
        console.log(result);
        setPayments(result);
      }
      )
    }
  }
}

  const [date, setDate] = React.useState(null);
  const [creditAccountFilter, setCreditAccountFilter] = useState("")
  const [debitAccountFilter, setDebitAccountFilter] = useState("")

  return (
    <>
    <Box sx={{ '& > :not(style)': { m: 4, width: '30ch', flexGrow: 2, mb: 2,},}}>
    <Paper elevation={10} style={{width:'81%', marginLeft:"17%", marginRight: "2%"}} >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateField variant='filled' label="Date of payment" sx={{ml: '2%', mb: '2%', mt: '2%', width: '20%'}} 
          value={date}
          onChange={(newValue) => setDate(newValue)}
        />
      </LocalizationProvider>
      <TextField sx={{ml: '10%', mb: '2%', mt: '2%', width: '20%'}} id="outlined-basic" label="Debit account" variant="standard" fullWidth 
          value={debitAccountFilter}
          onChange={(e)=>setDebitAccountFilter(e.target.value)}/>
      <TextField sx={{ml: '10%', mb: '2%', mt: '2%', width: '20%'}}  id="outlined-basic" label="Credit account" variant="standard" fullWidth 
          value={creditAccountFilter}
          onChange={(e)=>setCreditAccountFilter(e.target.value)}/>
      <br/>
      <Button sx={{ml: '2%', mb: '2%'}} variant="outlined" onClick={() => handleApplyFilter()}> Apply filter</Button>
    </Paper>
    </Box>
    <Box sx={{ '& > :not(style)': {width: '30ch', flexGrow: 2},}}>
    <Paper elevation={20} style={{width:'81%', marginLeft:"17%", marginTop: "1%", marginBottom: "1%"}}>
    <TableContainer component={Paper}>
      <Table aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <StyledTableCell><b></b></StyledTableCell>
            <StyledTableCell><b>Payment reference</b></StyledTableCell>
            <StyledTableCell> </StyledTableCell>
            <StyledTableCell><b>Status</b></StyledTableCell>
            <StyledTableCell><b>Actions</b></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : payments
          ).map((row) => (
            <>
            <TableRow key={row.reference}>
              <TableCell>
                  {getIcon(row)}
              </TableCell>
              <TableCell sx = {{ width: 200 }} component="th" scope="row" >
                <b>{row.reference}</b>
              </TableCell>
              <TableCell sx = {{ width: 500 }}>
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
                <Button sx={{m: 1}} variant="outlined" color="error" disabled={row.status === "COMPLETED" || row.status === "CANCELLED"} onClick={() => handleCancel(row)}> Cancel </Button>
                <Button sx={{m: 1}} variant="outlined" onClick={() => handleOpenAudit(row)}> See audit</Button>
              </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeDetails && paymentToSeeDetailsFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, paddingLeft: 3 }}>
                  <Typography gutterBottom component="div">
                    <b>Payment details</b>
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Debit account</TableCell>
                        <TableCell>Credit account</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell>Date time</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell> {row.debitBankAccount.number} </TableCell>
                        <TableCell> {row.creditBankAccount.number} </TableCell>
                        <TableCell> {row.amount} </TableCell>
                        <TableCell> {row.currency} </TableCell>
                        <TableCell> {row.dateTime} </TableCell>
                        <TableCell> {row.status} </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
              </TableCell>
          </TableRow>

          <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeAudit && paymentToSeeAuditFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, paddingLeft: 3  }}>
                  <Typography gutterBottom component="div">
                    <b>Payment audit</b>
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Reference</TableCell>
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
                            {row.reference}
                          </TableCell>
                          <TableCell>{row.modifiedByUserWithUsername}</TableCell>
                          <TableCell>{row.dateTime}</TableCell>
                          <TableCell>{row.operation}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={openSeeDetailsAudit && paymentToSeeDetailsAuditFor === row.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography style={{fontSize: 13}} gutterBottom component="div">
                              Reference: {row.reference} <br/>
                              Type: {row.type} <br/>
                              Debit account: {row.debitBankAccount.number} <br/>
                              Credit account: {row.creditBankAccount.number} <br/>
                              Amount: {row.amount} <br/>
                              Currency: {row.currency} <br/>
                              Date time: {row.dateTime} <br/>
                              Status: {row.status} <br/>
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
              count={payments.length}
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
