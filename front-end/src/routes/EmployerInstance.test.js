import React from "react";
import { render, screen } from "@testing-library/react";
import EmployerInstance, { loader } from "./EmployerInstance";
import axios from 'axios';
import config from '../lib/config.json';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn()
}));

describe('EmployerInstance', () => {
  const mockData = {
    name: 'Test Company',
    hq_location: 'Test Location',
    image_url: 'test_image.jpg',
    company_type: 'Type A',
    industry: 'Industry A',
    size: '100-200',
    description: 'Test Description',
    map_url: 'test_map_url',
    jobs: [],
    resources: [],
    job_instance_scroller_data: {
      type: "Jobs",
      itemFor: "employer",
      items: []
    },
    resource_instance_scroller_data: {
      type: "Resources",
      itemFor: "employer",
      items: []
    }
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockData });
    require('react-router-dom').useLoaderData.mockReturnValue({ employer: mockData });
  });

  test('renders employer information', () => {
    render(<EmployerInstance />);
    
    const companyName = screen.getByText(/test company/i);
    const location = screen.getByText(/based in test location/i);
    const companyType = screen.getByText(/company type:/i);
    
    expect(companyName).toBeInTheDocument();
    expect(location).toBeInTheDocument();
    expect(companyType).toBeInTheDocument();
  });

  test('renders instance scroller for jobs and resources', () => {
    render(<EmployerInstance />);
    
    const jobScroller = screen.getByText(/jobs for this employer/i);
    const resourceScroller = screen.getByText(/resources for this employer/i);
    
    expect(jobScroller).toBeInTheDocument();
    expect(resourceScroller).toBeInTheDocument();
  });

  describe('loader function', () => {
    it('should fetch employer data and enhance it', async () => {
      const params = { id: 1 }; 
      const result = await loader({ params });

      expect(axios.get).toHaveBeenCalledWith(config.api_url + '/employers/1');
      expect(result).toEqual({ employer: mockData }); 
      expect(result.employer.job_instance_scroller_data).toEqual({
        type: "Jobs",
        itemFor: "employer",
        items: mockData.jobs
      });
      expect(result.employer.resource_instance_scroller_data).toEqual({
        type: "Resources",
        itemFor: "employer",
        items: mockData.resources
      });
    });
  });
});
