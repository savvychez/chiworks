const SalaryRange = ({ salary}) => {
    let minSalary;
    let maxSalary;
    if(salary.includes("per hour")) {
        const hourlyRate = parseFloat(salary.replace(/[^0-9.]/g, ""));
        minSalary = Math.round(hourlyRate * 35 * 52);
        maxSalary = Math.round(hourlyRate * 50 * 52);
    } else {
        [minSalary, maxSalary] = salary.replace(/[^0-9.-]/g, "").split("-").map(x => parseFloat(x) * 1000);
    }
    const industryAvg = Math.round((minSalary + maxSalary) / 2);
    const indAvgSimpl = Math.round((industryAvg / 1000) * 10) / 10;
    const avgString = indAvgSimpl + "k";
    const maxPercentage = ((maxSalary - minSalary) / (maxSalary - minSalary)) * 100;
    const avgPercentage = ((industryAvg - minSalary) / (maxSalary - minSalary)) * 100;

    return (
        <div>
          <hr className='mt-3 mb-5'/>
          <h2 className="text-2xl text-gray-500 mb-6">Salary Estimate</h2>
          <div className="relative flex items-center space-x-4">
            <span className="text-md w-24 font-bold">$ {minSalary}</span>
            <div className="relative w-full h-4 bg-gray-300 rounded-md">
              <div className="absolute left-0 h-4 bg-slate-400 rounded-md" style={{ width: `${maxPercentage}%` }}></div>
              <div className="absolute left-0 h-4 bg-blue-700 rounded-md rounded-r-none" style={{ width: `${avgPercentage}%` }}></div>
              <div className="absolute -bottom-1  h-6 w-[2px] -right-4 bg-slate-700" style={{ left: `calc(${avgPercentage}% - 0.5px)` }}></div>
              <span className="absolute top-7 font-bold  text-slate-700 text-xs bottom-full" style={{ left: `calc(${avgPercentage}% - 12px)`}}>$ {avgString} average</span>
            </div>
            <span className="text-md w-24 font-bold">$ {maxSalary}</span>
          </div>
          <div className="mb-12"></div>
        </div>
      );
    };
    
export default SalaryRange;