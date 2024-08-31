import React, { useState, useEffect } from "react";
import axios from "axios";
import BarChart from "../components/BarChart1";
import PieChart from "../components/PieChart1";
import ScatterChart from "../components/ScatterChart";

function Visualizations() {
  const [minesData, setMinesData] = useState({ labels: [], datasets: [] });

  const [countyProviderMineData, setCountyProviderMineData] = useState({
    labels: [],
    datasets: [],
  });
  const [topRatioData, setTopRatioData] = useState({
    labels: [],
    datasets: [],
    tooltipData: [],
  });

  // State abbreviations mapping
  const stateAbbreviations = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://www.api.coal-reality.me/api/counties"
      );
      const responseData = response.data;

      // Mines data by state
      const minesDataArray = responseData.reduce((acc, curr) => {
        const stateAbbr = stateAbbreviations[curr.state] || curr.state;
        acc[stateAbbr] = (acc[stateAbbr] || 0) + curr.close_coal_mines.length;
        return acc;
      }, {});

      const sortedMinesDataArray = Object.entries(minesDataArray)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      setMinesData({
        labels: Object.keys(sortedMinesDataArray),
        datasets: [
          {
            label: "Number of Mines",
            data: Object.values(sortedMinesDataArray),
            backgroundColor: [
              // Define a color for each state, or use a function to generate colors
              "#4e79a7",
              "#f28e2b",
              "#e15759",
              "#76b7b2",
              "#59a14f",
              "#edc948",
              "#b07aa1",
              "#ff9da7",
              "#9c755f",
              "#bab0ab",
              "#e9c46a",
              "#f4a261",
              "#2a9d8f",
              "#264653",
            ],
            hoverOffset: 4,
          },
        ],
      });

      // Process the data for the scatter chart
      const countyProviderMineDataPoints = responseData.map((county) => ({
        x: county.close_coal_mines.length,
        y: county.close_healthcare_providers.length,
        // We will use this object to store info for tooltip
        customInfo: {
          countyName: `${county.county}, ${
            stateAbbreviations[county.state] || county.state
          }`,
          mines: county.close_coal_mines.length,
          providers: county.close_healthcare_providers.length,
        },
      }));

      setCountyProviderMineData({
        datasets: [
          {
            label: "County Data",
            data: countyProviderMineDataPoints,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });

      // Calculate mines per thousand people for each county and sort them
      const ratioData = responseData
        .map((county) => ({
          ...county,
          minesPerThousand:
            (county.close_coal_mines.length / county.population) * 1000,
        }))
        .sort((a, b) => b.minesPerThousand - a.minesPerThousand)
        .slice(0, 10);

      // Set data for the mines per thousand people bar chart
      setTopRatioData({
        labels: ratioData.map(
          (item) =>
            `${item.county}, ${stateAbbreviations[item.state] || item.state}`
        ),
        datasets: [
          {
            label: "Mines per Thousand People",
            data: ratioData.map((item) => item.minesPerThousand.toFixed(2)),
            backgroundColor: "rgba(153, 102, 255, 0.5)",
          },
        ],
        tooltipData: ratioData.map((item) => ({
          county: item.county,
          state: item.state,
          mines: item.close_coal_mines.length,
          population: item.population,
          ratio: item.minesPerThousand.toFixed(2),
        })),
      });
    };

    fetchData();
  }, []);

  // Define chart options, including tooltips for the scatter chart
  const scatterChartOptions = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Number of Mines",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Healthcare Providers",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // This will hide the legend
      },
      title: {
        display: true,
        text: "Mines vs. Healthcare Providers per County", // ScatterChart title
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            // Access the customInfo property for detailed tooltips
            const dataPoint = context.raw.customInfo;
            return [
              `County: ${dataPoint.countyName}`,
              `Mines: ${dataPoint.mines}`,
              `Healthcare Providers: ${dataPoint.providers}`,
            ];
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  const barChartOptions = {
    plugins: {
      legend: {
        display: false, // This will hide the legend
      },
      title: {
        display: true,
        text: "Mines per Thousand People per County", // BarChart title
      },
    },
  };

  const pieChartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Distribution of Mines by State", // PieChart title
      },
    },
  };

  // Define chart options, including tooltips for the topRatioData chart
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          beforeTitle: function (context) {
            const index = context[0].dataIndex;
            const tooltipData = topRatioData.tooltipData[index];
            return `County: ${tooltipData.county}, State: ${tooltipData.state}`;
          },
          label: function (context) {
            const index = context.dataIndex;
            const tooltipData = topRatioData.tooltipData[index];
            return [
              `Number of Mines: ${tooltipData.mines}`,
              `Population: ${tooltipData.population}`,
              `Mines per Thousand: ${tooltipData.ratio}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Mines per Thousand People",
        },
      },
      x: {
        title: {
          display: true,
          text: "County, State",
        },
      },
    },
  };

  return (
    <div className="px-28 py-16 min-h-screen bg-slate-50">
      <h1 className="text-5xl py-10 font-serif font-bold text-[#3b4354]">
        Provider Visualizations
      </h1>
      <div className="flex flex-col items-center">
        <div className="w-full md:w-3/4 lg:w-1/2 px-2 mb-4">
          <PieChart chartData={minesData} options={pieChartOptions} />
        </div>
        <div className="w-full md:w-3/4 lg:w-1/2 px-2 mb-4">
          <ScatterChart
            chartData={countyProviderMineData}
            options={scatterChartOptions}
          />
        </div>
        <div className="w-full md:w-3/4 lg:w-1/2 px-2 mb-4">
          <BarChart chartData={topRatioData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Visualizations;
