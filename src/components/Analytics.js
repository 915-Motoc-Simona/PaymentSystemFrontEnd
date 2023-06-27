import React,{useState, useEffect} from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {useNavigate} from "react-router-dom"
import authHeader from './auth-header';

function Analytics()
{
    const paperStyle={padding: '2rem', width:'80%', marginLeft:"18%", marginRight: "3%"}
    const labelStyle = {fontSize: 24, fontWeight: 600, marginBottom: 8, margin: 10}; 
    const titleStyle = {fontSize: 36, fontWeight: 600, marginBottom: "10px", margin: 10}; 
    const navigate = useNavigate();

    const [moneySpent, setMoneySpent] = useState("")
    const [moneySpentOverall, setMoneySpentOverall] = useState("")
    const [chartData, setChartData] = useState([]);
    const [chartOptions, setChartOptions] = useState({
        series: [],
        labels: [],
        chart: {
        type: 'donut',
        title: {
            text: "Who did you send money to"
          },
        },
    });

    useEffect(()=>{
        if(JSON.parse(localStorage.getItem("user"))){
            fetch(`http://localhost:8080/payments/moneySpent`, {
            method: 'GET',
            headers:  new Headers({
              "Content-Type":"application/json",
              ...authHeader()
            })})
            .then(res=>res.json())
            .then((result)=>{
              setMoneySpent(result);
            }
            )

            fetch(`http://localhost:8080/payments/moneySpentOverall`, {
                method: 'GET',
                headers:  new Headers({
                  "Content-Type":"application/json",
                  ...authHeader()
                })})
                .then(res=>res.json())
                .then((result)=>{
                  setMoneySpentOverall(result);
                }
                )

            fetch(`http://localhost:8080/payments/moneySpentByReceivingParty`, {
                    method: 'GET',
                    headers:  new Headers({
                      "Content-Type":"application/json",
                      ...authHeader()
                    })})
                    .then(res=>res.json())
                    .then((data)=>{
                        const newChartData = Object.entries(data).map(([name, value]) => ({
                            name,
                            value,
                          }));
                          setChartData(newChartData);
                          setChartOptions({
                            series: newChartData.map((data) => {parseFloat(data.value).toFixed(2)}),
                            labels: newChartData.map((data) => data.name),
                            chart: {
                              type: 'donut',
                            },        
                            title: {
                                text: "Who did you send money to"
                              },
                          });
                    }
                    )
      }
      else{
        navigate('/authentication/signin');
      }
    }, [navigate])

    const [product, setProduct] = useState("")
    useEffect(() => {
        if (moneySpent) {
          setProduct([
            {
                name:"Money spent",
                data: Object.entries(moneySpent).map(([date, value]) => {
                  console.log([date, value])
                  return [date, parseFloat(value).toFixed(2)];
                })
              }
          ]);
          console.log("Product: " + product)
        }
      }, [moneySpent]);

    const[option, setOption]= useState(
        {
            chart: {
                type: 'area',
                zoom: {
                  enabled: true
                }
              },
            xaxis: {
                type: 'datetime',
              },
            yaxis:{
                title:{text:"Amount"}               
            },
            stroke: {
                curve: 'straight'
              },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100]
                }
            }

        }

    );

    return(<React.Fragment>
        <div className='container-fluid mt-3 mb-3'>
            <Box
            component="form"
            sx={{
            '& > :not(style)': { m: 4, width: '30ch', flexGrow: 2, },
            }}
            noValidate
            autoComplete="off"
        
            >
            <Paper elevation = {18} style={paperStyle}>
                <label style={titleStyle}>Your analytics</label>  <br/> <br/> <br/>
                <label style={labelStyle}>Total spent: {parseFloat(moneySpentOverall).toFixed(2)} EUR</label> <br/> <br/>
                <div class="chart" style={{ marginBottom: '100px' }}>
                    <Chart 
                    type='area'
                    width={"1100"}
                    height={"500"}
                    series={product}
                    options={option}
                    />
                </div>
                <div class="chart" style={{ marginBottom: '50px'}}>
                    <Chart
                    options={chartOptions}
                    series={chartData.map(data => data.value)}
                    type="donut"
                    width="600"
                    />
                </div>
            </Paper>
            </Box>
            </div>
    </React.Fragment>);
}

export default Analytics