import React, { useEffect, useState } from "react";
import {
  Grid,
  LinearProgress,
  Select,
  OutlinedInput,
  MenuItem,
  Button
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
} from "recharts";

// styles
import useStyles from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import Table from "./components/Table/Table";
import BigStat from "./components/BigStat/BigStat";
import {useSelector} from 'react-redux';
import axios from "axios";

const mainChartData = getMainChartData();
const PieChartData = [
  { name: "Group A", value: 400, color: "primary" },
  { name: "Group B", value: 300, color: "secondary" },
  { name: "Group C", value: 300, color: "warning" },
  { name: "Group D", value: 200, color: "success" },
];

export default function Dashboard(props) {
  var classes = useStyles();
  const state = useSelector(reducer => reducer.dashboardReducer);
  var theme = useTheme();
  const {stockData} = state;

  const [sectorPerformanceData, setSectorPerformance] = useState([])
  const [gainersData, setGainersData] = useState([])
  const [losersData, setLosersData] = useState([])
  const [activeData, setActiveData] = useState([])

  // const [stockData, setStockData] = useState([])

  // local
  var [mainChartState, setMainChartState] = useState("monthly");

  useEffect(() => {
    const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
    axios.get(`http://localhost:5000/api/v1/dashboard/getDashboard`,  {headers: { Authorization: AuthStr }})
    .then(function (response) {
      console.log(response.data.data)
      if(response.status === 200){
        console.log(response)
        setSectorPerformance(response?.data?.data?.sectorPerformance)
        setGainersData(response?.data?.data?.gainers)
        setLosersData(response?.data?.data?.losers)
        setActiveData(response?.data?.data?.active)
      }
    })
    .catch(function (error) {
      console.log(error);
      setSectorPerformance([])
        setGainersData([])
        setLosersData([])
        setActiveData([])
    });
}, [])

  return (
    <>
    <Grid container spacing={3}>
      {
        stockData?.map((item, index) =>(
          <Grid item xs={4} key={index.toString()}>
            <div className={classes.cardContainer}>
              <Typography variant="body1" color="text" className={classes.nameText} noWrap>
                {item['2. name']}{`(${item['1. symbol']})`}
              </Typography>
              <Typography color="text" colorBrightness="secondary">
                  {item['4. region']}{`(${item['8. currency']})`}
                </Typography>
                <Typography color="text" colorBrightness="secondary">
                  {item['3. type']}
                </Typography>
                <div className={classes.bottomContainer}>
                <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
                noWrap
              >
                {`Time: ${item['5. marketOpen']} to ${item['6. marketClose']}`}
              </Typography>
              <Typography
                color="text"
                colorBrightness="secondary"
                className={classes.serverOverviewElementText}
                noWrap
              >
                {`Score: ${item['9. matchScore']}`}
              </Typography>
                </div>
                
            </div>
          </Grid>
        ))
      }
    </Grid>
    <PageTitle title="Dashboard" button={<Button
      variant="contained"
      size="medium"
      color="secondary"
    >
        Latest Reports
    </Button>} />
      <Grid container spacing={4}>
        {sectorPerformanceData &&
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Widget
            title="Sector Performance"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >  
          {
            sectorPerformanceData.map((item, index) => (<div className={classes.progressSection}>
              <Typography
                size="md"
                color="text"
                colorBrightness="secondary"
                className={classes.progressSectionTitle}
              >
                {`${item.sector}(${item.changesPercentage})`}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={((parseInt(item.changesPercentage)/100) * 100)}
                classes={{ barColorPrimary: classes.progressBarPrimary }}
                className={classes.progress}
              />

            </div>))
          }            
          </Widget>
        </Grid>
}
{activeData && <Grid item xs={12}>
          <Widget
            title="Active"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableWidget}
          >
            <Table data={activeData} />
          </Widget>
        </Grid>}
        {/* {mock.bigStat.map(stat => (
          <Grid item md={4} sm={6} xs={12} key={stat.product}>
            <BigStat {...stat} />
          </Grid>
        ))} */}
        {gainersData && <Grid item xs={12}>
          <Widget
            title="Gainers"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableWidget}
          >
            <Table data={gainersData} />
          </Widget>
        </Grid>}

        {losersData && <Grid item xs={12}>
          <Widget
            title="Losers"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableWidget}
          >
            <Table data={losersData} />
          </Widget>
        </Grid>}
        
      </Grid>  
    </>
  );
}

// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((item, index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}

function getMainChartData() {
  var resultArray = [];
  var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
  var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
  var mobile = getRandomData(31, 1500, 7500, 7500, 1500);

  for (let i = 0; i < tablet.length; i++) {
    resultArray.push({
      tablet: tablet[i].value,
      desktop: desktop[i].value,
      mobile: mobile[i].value,
    });
  }

  return resultArray;
}
