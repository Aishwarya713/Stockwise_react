import React, { useEffect, useState } from "react";
import {
  Grid,
  LinearProgress,
  Button
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

// styles
import useStyles from "./styles";

// components
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Table from "./components/Table/Table";
import {useSelector} from 'react-redux';
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Dashboard(props) {
  var classes = useStyles();
  const state = useSelector(reducer => reducer.dashboardReducer);
  var theme = useTheme();
  const {stockData} = state;
  const history = useHistory();

  const [sectorPerformanceData, setSectorPerformance] = useState([])
  const [gainersData, setGainersData] = useState([])
  const [losersData, setLosersData] = useState([])
  const [activeData, setActiveData] = useState([])

  const handleClick = (item) => {
    console.log(item)
    history.push({
      pathname: "/app/stock-details",
      state: {
        stockData: item
      }
    })
  }

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
          <Grid item xs={4} key={index.toString()} onClick={() => history.push({
            pathname: "/app/stock-details",
            state: {
              stockData: item
            }
          })}>
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
            sectorPerformanceData.map((item, index) => (
            <div className={classes.progressSection} onClick={()=>handleClick(item)}>
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

