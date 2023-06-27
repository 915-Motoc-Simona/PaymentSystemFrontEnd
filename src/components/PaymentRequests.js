import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Button, Typography, Modal } from '@mui/material';
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
import Sidebar from '../navigation/Sidebar';
import {useNavigate} from "react-router-dom"
import TextField from '@mui/material/TextField';

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

export default function PaymentRequests() {
  const navigate = useNavigate();
  const [requests, setRequests]=useState([])
  const [amount, setAmount]=useState(0);

  const [openSeeDetails, setOpenSeeDetails] = React.useState(false);
  const [paymentToSeeDetailsFor, setPaymentToSeeDetailsFor] = React.useState(0);

  const handleOpenSeeDetails = (payment) => {
    setPaymentToSeeDetailsFor(payment.id)
    setOpenSeeDetails(!openSeeDetails)
  };

  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("user"))){
        fetch(`http://localhost:8080/payments/requests`, {
        method: 'GET',
        headers:  new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
        setRequests(result);
        }
        )
  }
  else{
    navigate('/authentication/signin');
  }
}, [navigate, ])

const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(5);

// Avoid a layout jump when reaching the last page with empty rows.
const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - requests.length) : 0;

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const [open, setOpen] = React.useState(false);

const handleClose = () => setOpen(false);

const handleOpen = () => setOpen(true);

const handleStatus = (event, button) => {
  if(button === "VERIFY" && event.type !== "EXTERNAL"){
    handleOpen()
  }
  else{
    handleOK(event, button)
  }
}

const handleOK = async (event, button) => {
    console.log(event)
    console.log(button)
    if(button === "VERIFY"){
        setOpen(false)
        const approveLink = JSON.parse(localStorage.getItem("approveLink"))
        console.log(approveLink)
        console.log(event.type)
        if(event.type === "EXTERNAL" && approveLink) {
            window.location.href = approveLink.href;
        }

        await fetch(`http://localhost:8080/payments/verify/${event.id}`, {
          method:"PUT",
          headers:new Headers({
            "Content-Type":"application/json",
            ...authHeader()
          }),
          body: amount
        }).then(() => {
        fetch("http://localhost:8080/payments/requests", {
                method: 'GET',
                headers:  new Headers({
                    "Content-Type":"application/json",
                    ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
        setRequests(result);
        }
        )
        })
  }
  else if(button === "APPROVE"){
    if(event.type === "EXTERNAL") {
      const paypalToken = JSON.parse(localStorage.getItem("paypalToken"))
      const paymentId = JSON.parse(localStorage.getItem("paymentId"))
      const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${paymentId}/capture`, {
        method:"POST", 
        headers: {
          Authorization: paypalToken,
          'Content-Type': 'application/json',
        },
      }).then(() => {
        localStorage.removeItem("paypalToken");
        localStorage.removeItem("paymentId");
        localStorage.removeItem("approveLink");
      })


    }
    await fetch(`http://localhost:8080/payments/approve/${event.id}`, {
          method:"PUT",
          headers:new Headers({
            "Content-Type":"application/json",
            ...authHeader()
          })
        }).then(() => {
        fetch("http://localhost:8080/payments/requests", {
                method: 'GET',
                headers:  new Headers({
                    "Content-Type":"application/json",
                    ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
        setRequests(result);
        }
        )
        })
  }else if(button === "AUTHORIZE"){
    await fetch(`http://localhost:8080/payments/authorize/${event.id}`, {
          method:"PUT",
          headers:new Headers({
            "Content-Type":"application/json",
            ...authHeader()
          })
        }).then(() => {
        fetch("http://localhost:8080/payments/requests", {
                method: 'GET',
                headers:  new Headers({
                    "Content-Type":"application/json",
                    ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
        setRequests(result);
        }
        )
        })
  }
}

const handleCancel = async (event) => {
    console.log(event)
        await fetch(`http://localhost:8080/payments/cancel/${event.id}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...authHeader()
            })
        }).then(() => {
        console.log("Cancel payment")
        fetch("http://localhost:8080/payments/requests", {
                method: 'GET',
                headers:  new Headers({
                    "Content-Type":"application/json",
                    ...authHeader()
        })})
        .then(res=>res.json())
        .then((result)=>{
        setRequests(result);
        }
        )
        })
}

  return (
    <>
    <Box sx={{ '& > :not(style)': {width: '30ch', flexGrow: 2, height: '60ch'},}}>
    <Paper elevation={10} style={{width:'81%', marginLeft:"17%", marginTop: "2%", marginBottom: "2%"}}>
    <TableContainer>
      <Table aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <StyledTableCell>Payment</StyledTableCell>
            <StyledTableCell> </StyledTableCell>
            <StyledTableCell>User who modified</StyledTableCell>
            <StyledTableCell>Timestamp</StyledTableCell>
            <StyledTableCell>Operation</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : requests
          ).map((row) => (
            <>
            <TableRow key={row.reference}>
              <TableCell component="th" scope="row" >
                {row.reference}
              </TableCell>
              <TableCell sx = {{ width: 300 }}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => handleOpenSeeDetails(row)}
                >
                  {openSeeDetails ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell>
                {row.modifiedByUserWithUsername}
              </TableCell>
              <TableCell>
                {row.dateTimeOfOperation}
              </TableCell>
              <TableCell>
                {row.operation}
              </TableCell>
              <TableCell>
                <Button variant="outlined" color='success' onClick={() => {handleStatus(row, row.status)}}> {row.status} </Button> 
                <Button variant="outlined" color="error" onClick={() => handleCancel(row)}> Cancel </Button>
                
                <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography sx={{mb: 3}} id="modal-modal-title" variant="h6" component="h2">
                          Please reenter the amount
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, m: 1 }}>
                        <TextField variant="standard" required id="standard-required" label="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
                        </Typography>
                        <Button sx={{m: 1}} variant="outlined" color='success' onClick={() => handleOK(row, row.status)}> Submit</Button> 
                        <Button sx={{m: 2}} variant="outlined" color="error" onClick={handleClose}> Cancel </Button>
                      </Box>
                </Modal>

              </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeDetails && paymentToSeeDetailsFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Payment details
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                      <TableCell>Reference</TableCell>
                        <TableCell>Debit account</TableCell>
                        <TableCell>Credit account</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell> {row.reference} </TableCell>
                        <TableCell> {row.debitBankAccount.number} </TableCell>
                        <TableCell> {row.creditBankAccount.number} </TableCell>
                        <TableCell> {row.type} </TableCell>
                        <TableCell> {row.amount} </TableCell>
                        <TableCell> {row.currency} </TableCell>
                        <TableCell> {row.status} </TableCell>
                      </TableRow>
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
              count={requests.length}
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
