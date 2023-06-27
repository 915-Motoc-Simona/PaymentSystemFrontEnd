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


export default function UserRequests() {
  const [requests, setRequests]=useState([])
  const navigate = useNavigate();

  const [openSeeDetails, setOpenSeeDetails] = React.useState(false);
  const [userToSeeDetailsFor, setUserToSeeDetailsFor] = React.useState(0);

  const handleOpenSeeDetails = (user) => {
    setUserToSeeDetailsFor(user.id)
    setOpenSeeDetails(!openSeeDetails)
  };

  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("user"))){
        fetch(`http://localhost:8080/users/approve`, {
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

const handleApprove = async (event) => {
    console.log(event)
    if(event.operation === "CREATE_REQUEST"){
      await fetch(`http://localhost:8080/users/approve/register/${event.id}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...authHeader()
            })
        }).then(() => {
        console.log("User approved delete")
        fetch("http://localhost:8080/users/approve", {
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
      console.log("EVENT ", event)
      const userAccount={
        "username": event.username,
        "password": '',
        "email": event.email,
        "role": event.role.name,
        "fullname": event.fullname,
        "address": event.address
      }
      console.log("USER ACCOUNT ", userAccount)
      fetch(`http://localhost:8080/api/authenticate/signup/${event.id}`, {
        method:"POST",
        headers:new Headers({
          "Content-Type":"application/json",
          ...authHeader()
        })
      }).then(()=>{
        console.log("New user account created")
      });
    }
    else if(event.operation === "DELETE_REQUEST"){
        await fetch(`http://localhost:8080/users/approve/delete/${event.id}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...authHeader()
            })
        }).then(() => {
        console.log("User approved delete")
        fetch("http://localhost:8080/users/approve", {
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
    else {
        await fetch(`http://localhost:8080/users/approve/update/${event.id}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...authHeader()
            })
        }).then(() => {
        console.log("User approved update")
        fetch("http://localhost:8080/users/approve", {
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

const handleReject = async (event) => {
    console.log(event)
    if(event.operation === "CREATE_REQUEST"){
      await fetch(`http://localhost:8080/users/reject/register/${event.id}`, {
          method: 'PUT',
          headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              ...authHeader()
          })
      }).then(() => {
      console.log("User rejected register")
      fetch("http://localhost:8080/users/approve", {
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
    else if(event.operation === "DELETE_REQUEST"){
        await fetch(`http://localhost:8080/users/reject/delete/${event.id}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...authHeader()
            })
        }).then(() => {
        console.log("User rejected delete")
        fetch("http://localhost:8080/users/approve", {
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
    else {
        await fetch(`http://localhost:8080/users/reject/update/${event.id}`, {
            method: 'PUT',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...authHeader()
            })
        }).then(() => {
        console.log("User rejected update")
        fetch("http://localhost:8080/users/approve", {
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

  return (
    <>
    <Box sx={{ '& > :not(style)': {width: '30ch', flexGrow: 2, height: '60ch'},}}>
    <Paper elevation={10} style={{width:'81%', marginLeft:"17%", marginTop: "2%", marginBottom: "2%"}}>
    <TableContainer>
      <Table aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <StyledTableCell>User</StyledTableCell>
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
            <TableRow key={row.username}>
              <TableCell component="th" scope="row" >
                {row.username}
              </TableCell>
              <TableCell sx = {{ width: 400 }}>
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
                {row.dateTime}
              </TableCell>
              <TableCell>
                {row.operation}
              </TableCell>
              <TableCell>
                <Button variant="outlined" color='success' onClick={() => handleApprove(row)}> approve</Button> 
                <Button variant="contained" color="error" onClick={() => handleReject(row)}> Reject </Button>

              </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={openSeeDetails && userToSeeDetailsFor === row.id} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    User details
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
