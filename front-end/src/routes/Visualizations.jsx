import React, { useState, useEffect } from "react";
import axios from "axios";
import BarChart from "../components/BarChart1";
import ScatterChart from "../components/ScatterChart";
import PieChart from "../components/PieChart1";

function GetGraph1Data() {
  const [graph1Data, setGraph1Data] = useState({
    labels: [],
    datasets: [{
      label: "Number of Companies",
      data: []
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://chiworksapi.svv.sh/employers");
        const responseData = response.data;

        // Categorize companies based on their size thresholds
        const sizeCategories = {
          small: 0,
          medium: 0,
          large: 0,
          extralarge: 0
        };

        responseData.forEach((company) => {
          const sizeString = company.size; // Replace 'size' with the actual key in your API response
          const match = sizeString.match(/(\d+),?(\d*)/);

          if (match) {
            const cleanedSizeString = match[0].replace(/,/g, '');

            const employeeCount = parseInt(cleanedSizeString, 10);

            if (employeeCount <= 50) {
              sizeCategories.small += 1;
            } else if (employeeCount <= 1000) {
              sizeCategories.medium += 1;
            } else if (employeeCount <= 5000) {
              sizeCategories.large += 1;
            } else {
              sizeCategories.extralarge += 1;
            }
          }
        });

        // Update the graph data with the counts
        setGraph1Data({
          labels: ["Small (<= 50 employees)", "Medium (60-1k employees)", "Large (1k-5k employees)", "Extra Large (> 5k employees)"],
          datasets: [{
            label: "Number of Companies",
            data: [sizeCategories.small, sizeCategories.medium, sizeCategories.large, sizeCategories.extralarge],
          }],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs once after the initial render

  return graph1Data;
}

function getSizeAsInt(sizeString) {
  // Extract numbers from the string
  const numbers = sizeString.match(/\d+/g);

  if (numbers) {
    // Convert the extracted strings to integers
    const sizes = numbers.map(num => parseInt(num, 10));

    // Return the maximum size
    return Math.max(...sizes);
  }

  // Return 0 or null if no numbers found, adjust based on your needs
  return 0;
}

function GetGraph2Data() {
  const [graph2Data, setGraph2Data] = useState({
    labels: [],
    datasets: [{
      label: "Scatter Dataset",
      data: []
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empResponse = await axios.get("https://chiworksapi.svv.sh/employers");
        const eRD = empResponse.data;

        const sdata = [];

        for (const company of eRD) {
          const id = company.id;
          try {
            const empSpec = await axios.get(`https://chiworksapi.svv.sh/employers/${id}`);
            const jobs = empSpec.data.jobs;

            let numJobs = jobs.length;
            let totalPay = 0;
            jobs.forEach((job) => {
              const salaryDetails = job.details.find(detail => detail[0] === "Salary");
              if (salaryDetails) {
                const salaryRange = salaryDetails[1].split(' - ');
                const minSalary = parseFloat(salaryRange[0].replace(/[^0-9.]/g, ""));
                let averageSalary = minSalary;
                if (salaryRange.length >= 2) {
                  const maxSalary = parseFloat(salaryRange[1].replace(/[^0-9.]/g, ""));
                  averageSalary = (minSalary + maxSalary) / 2;
                  if (salaryDetails[1].includes("per hour")) {
                    totalPay += averageSalary * 40 * 52;
                  } else {
                    totalPay += averageSalary;
                  }
                } else {
                  if (salaryDetails[0].includes("per hour")) {
                    totalPay += averageSalary * 40 * 52;
                  } else {
                    totalPay += averageSalary;
                  }
                }


              }
            });

            sdata.push({ x: getSizeAsInt(company.size), y: (totalPay / numJobs) });
          } catch (error) {
            console.error("no specific company api, skipping.");
            continue;
          }
        }

        setGraph2Data({
          datasets: [
            {
              label: 'Scatter Dataset',
              data: sdata,
              backgroundColor: 'rgba(255, 99, 132, 1)',
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("GRAPH 2 DATA:", graph2Data);
  return graph2Data;
}


const getTopFive = (data) => {
  // Create an array from the object, sort it, and slice the top 5
  const topFive = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Convert the data to the format suitable for a pie chart
  const pieChartData = topFive.map(([key, value]) => ({
    label: key,
    data: value,
  }));

  return pieChartData;
};

function GetGraph3Data() {
  const [graph3Data, setGraph3Data] = useState({
    labels: [],
    datasets: [{
      label: "Company",
      data: []
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://chiworksapi.svv.sh/jobs");
        const responseData = response.data;
        let globalSkills = {};

        responseData.forEach((job) => {
          job.skills.forEach((skillName) => {
            globalSkills[skillName] = (globalSkills[skillName] || 0) + 1;
          });
        });

        const topFiveData = getTopFive(globalSkills);

        setGraph3Data({
          labels: topFiveData.map((data) => data.label),
          datasets: [{
            label: "Number of Companies",
            data: topFiveData.map((data) => data.data),
          }],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs once after the initial render

  console.log(graph3Data.labels);
  console.log(graph3Data.datasets);
  return graph3Data;
};

function Visualizations() {
  const graph1Data = GetGraph1Data();
  const graph2Data = GetGraph2Data();
  const graph3Data = GetGraph3Data();

  const graph1Options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Size of Company"
        }
      },
      y: {
        title: {
          display: true,
          text: "Number of Companies"
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Number of companies of a certain size",
      },
    },
  };

  const graph2Options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Company Size"
        }
      },
      y: {
        title: {
          display: true,
          text: "Salary (in USD)"
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Average Salary vs. Company Size",
      },
    },
  };

  const graph3Options = {
    plugins: {
      title: {
        display: true,
        text: "Top 5 Skills Jobs Look For",
      },
    },
  };

  return (
    <div className="px-28 py-16 min-h-screen bg-slate-50">
      <h1 className="text-5xl py-10 font-serif font-bold text-[#3b4354]">
        Visualizations
      </h1>
      <div className="flex flex-col items-center">
        {graph1Data &&
          <div className="w-full md:w-3/4 lg:w-1/2 px-2 mb-4">
            <BarChart chartData={graph1Data} options={graph1Options} />
          </div>
        }
        {graph2Data &&
          <div className="w-full md:w-3/4 lg:w-1/2 px-2 mb-4">
            <ScatterChart chartData={graph2Data} options={graph2Options} />
          </div>
        }
        <div className="w-full md:w-3/4 lg:w-1/2 px-2 mb-4">
          <PieChart chartData={graph3Data} options={graph3Options} />
        </div>
      </div>
    </div>
  );
}

export default Visualizations;
