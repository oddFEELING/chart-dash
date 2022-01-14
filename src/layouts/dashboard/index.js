// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
// import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// import axios
import axios from "axios";
import { useState, useEffect } from "react";

function Dashboard() {
  // const { sales, tasks } = reportsLineChartData;
  const [StatCard, setStatCard] = useState(false);
  const [BarData, setBarData] = useState(false);
  const [LineData, setLineData] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await axios
          .post("http://localhost:4001/", { id: "61dfdfd42efe1198a74edbcc" })
          .then((res) => {
            const response = res.data.data;

            response.bar_chart.chart[6] = response.dash_query[0].Count;
            response.line_chart[0].chart[6] = response.dash_query[1].Count;
            response.line_chart[1].chart[4] = response.dash_query[3].Count;

            setBarData({
              labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
              datasets: { label: "Sales", data: response.bar_chart.chart },
            });
            setLineData({
              staff: {
                labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
                datasets: { label: "Staffs", data: response.line_chart[0].chart },
              },
              budget: {
                labels: ["2018", "2019", "2020", "2021", "2022"],
                datasets: { label: "budget", data: response.line_chart[1].chart },
              },
            });
            if (StatCard !== response) {
              setStatCard(response);
            }
            sessionStorage.setItem("data", JSON.stringify(response));
          });
      } catch (err) {
        throw new Error(err);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* ----- map start ----- */}
          {StatCard.dash_query
            ? StatCard.dash_query.map((data) => (
                <Grid item xs={12} md={6} lg={3} key={data.title}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      color={data.color}
                      icon="leaderboard"
                      title={data.title}
                      count={data.Count}
                      percentage={{
                        color:
                          Number((data.Count / data.prev_count) * 100 - 100).toFixed(2) > 0
                            ? "success"
                            : "error",
                        amount:
                          data.Count !== 6
                            ? `${Number((data.Count / data.prev_count) * 100 - 100).toFixed(2)}%`
                            : 8,
                        label: data.percentage.label,
                      }}
                    />
                  </MDBox>
                </Grid>
              ))
            : ""}

          {/* ----- map end ----- */}
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {StatCard && (
                  <ReportsBarChart
                    color="info"
                    title={StatCard.bar_chart.title}
                    description={StatCard.bar_chart.Desc}
                    date={`Sent ${StatCard.bar_chart.date} days ago`}
                    chart={BarData}
                  />
                )}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {StatCard && (
                  <ReportsLineChart
                    color="success"
                    title={StatCard.line_chart[0].title}
                    description={
                      <>
                        (<strong>-10.9%</strong>) decrease in this session.
                      </>
                    }
                    date="updated 4 min ago"
                    chart={LineData.staff}
                  />
                )}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {StatCard && (
                  <ReportsLineChart
                    color="dark"
                    title={StatCard.line_chart[1].title}
                    description="Last Expense update Performance"
                    date="just updated"
                    chart={LineData.budget}
                  />
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              {StatCard ? <Projects /> : <h1>Loading...</h1>}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              {StatCard && <OrdersOverview />}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      {StatCard && <Footer />}
    </DashboardLayout>
  );
}

export default Dashboard;
