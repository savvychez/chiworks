// data format
//     id: int
//     title: str
//     subheading: str
//     image: str
//     details: {[
//         label: str
//         value: str
//     ]}

import employers from '../../data/test_employers.json';
import jobs from '../../data/test_jobs.json';
import resources from '../../data/test_resources.json';
import { formatJobData, formatEmployerData, formatResourceData } from './helpers';
import axios from 'axios';
import config from './config.json'

export const getJobs = async (sortString, filterString) => {
    sortString = sortString ? sortString : '';
    filterString = filterString ? filterString : '';
    if (filterString) {
        if (!sortString) {
            filterString = "?" + filterString
        } else {
            filterString = "&" + filterString
        }
    }
    

    console.log (config.api_url + '/jobs' + sortString + filterString  )
    const response = await axios.get(config.api_url + '/jobs' + sortString + filterString);
    const jobs_result = response.data
    // console.log(jobs_result)
    // return response.data;
    const formatted_jobs = jobs_result.map(job => formatJobData(job));
    return formatted_jobs;
}

export const getEmployers = async (sortString, filterString) => {
    sortString = sortString ? sortString : '';
    filterString = filterString ? filterString : '';
    if (filterString) {
        if (!sortString) {
            filterString = "?" + filterString
        } else {
            filterString = "&" + filterString
        }
    }
    
    const response = await axios.get(config.api_url + '/employers' + sortString + filterString);
    const employers_result = response.data
    // console.log(employers_result)
    // return response.data;
    const formatted_employers = employers_result.map(employer => formatEmployerData(employer));
    return formatted_employers
}

export const getResources = async (sortString, filterString) => {
    sortString = sortString ? sortString : '';
    filterString = filterString ? filterString : '';
    if (filterString) {
        if (!sortString) {
            filterString = "?" + filterString
        } else {
            filterString = "&" + filterString
        }
    }
    console.log(config.api_url + '/resources' + sortString + filterString)
    const response = await axios.get(config.api_url + '/resources' + sortString + filterString);
    const resources_result = response.data
    // console.log(resources_result)

    const formatted_resources = resources_result.map(resource => formatResourceData(resource));
    return formatted_resources
}