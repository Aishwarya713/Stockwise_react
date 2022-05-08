import { Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useStyles from "./styles";
export default function StockDetails() {

  // const {location} = useHistory()
  // const {state} = location
  // const {stockData} = state
  // console.log(stockData)
  var classes = useStyles();
  const [options, setOptions] = useState(null)
  const [series, setSeries] = useState(null)
  const [info, setInfo] = useState(null)
  const history = useHistory();
  useEffect(() => {
    console.log(history.location.state.stockData['1. symbol'])
    const AuthStr = 'Bearer '.concat(localStorage.getItem("id_token"));
    axios.post(`http://localhost:5000/api/v1/dashboard/getStockInformation`, {
      "stockName": history.location.state.stockData['1. symbol']
    }, { headers: { Authorization: AuthStr } })
      .then((res) => {
        console.log(res)
        if (res) {
          if (res.data) {
            setInfo(res.data.data["Meta Data"])
            const categories = []
            Object.keys(res.data.data["Technical Analysis: SMA"]).forEach((item, index) => { index < 10 && categories.push(item) })
            const data = categories.map((item, index) => { return index < 10 && item && parseInt(res.data.data["Technical Analysis: SMA"][item]["SMA"]) })
            setOptions({
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: categories
              }
            })
            setSeries([
              {
                name: "series-1",
                data: data
              }
            ])

          }
        }
      })
      .catch((err) => {

      })
  }, [])

  return (
    <div className="app">
      {info && <Grid container><Grid item xs={12}>
        <div className={classes.cardContainer}>
          <Typography variant="body1" color="text" className={classes.nameText} noWrap>
            {`${info["1: Symbol"]}`}
          </Typography>
          <Typography color="text" colorBrightness="secondary">
            {info['2: Indicator']}
          </Typography>
          <Typography color="text" colorBrightness="secondary">
            {`${info["4: Interval"]} - ${info["6: Series Type"]}`}
          </Typography>
          <div className={classes.bottomContainer}>
            <Typography
              color="text"
              colorBrightness="secondary"
              className={classes.serverOverviewElementText}
              noWrap
            >
              {`Last Refreshed: ${info["3: Last Refreshed"]}`}
            </Typography>
            <Typography
              color="text"
              colorBrightness="secondary"
              className={classes.serverOverviewElementText}
              noWrap
            >
              {`Score: ${info["7: Time Zone"]}`}
            </Typography>
          </div>

        </div>
      </Grid></Grid>}
      <Grid container>
        <Grid item xs={12}>
          <div className="row">
            <div className={`mixed-chart ${classes.graphContainer}`}>
              {series && <Chart
                options={options}
                series={series}
                type="line"
                width="80%"
              />}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}