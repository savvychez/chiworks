import React from 'react';
import { render } from '@testing-library/react';
import ResourceInstance, { loader } from './ResourceInstance';
import axios from 'axios';

jest.mock('react-router-dom', () => ({
  useLoaderData: jest.fn()
}));

jest.mock('axios');
jest.mock('../lib/config', () => ({
  api_url: 'http://mocked-api-url'
}));

describe('<ResourceInstance />', () => {
  
  it('loader makes the correct API call', async () => {
    const mockResponse = {
      data: {
        related_jobs: [],
        related_employers: []
      }
    };
    axios.get.mockResolvedValueOnce(mockResponse);

    const data = await loader({ params: { id: 'test-id' } });

    expect(axios.get).toHaveBeenCalledWith('http://mocked-api-url/resources/test-id');
    expect(data.resource.related_jobs).toEqual([]);
    expect(data.resource.related_employers).toEqual([]);
  });

  it('constructs instance scroller data correctly', async () => {
    const mockResponse = {
      data: {
        related_jobs: ['Job1', 'Job2'],
        related_employers: ['Employer1', 'Employer2']
      }
    };
    axios.get.mockResolvedValueOnce(mockResponse);

    const data = await loader({ params: { id: 'test-id' } });

    expect(data.resource.job_instance_scroller_data).toEqual({
      type: "Jobs",
      itemFor: "resource",
      items: ['Job1', 'Job2']
    });
    expect(data.resource.employer_instance_scroller_data).toEqual({
      type: "Employers",
      itemFor: "resource",
      items: ['Employer1', 'Employer2']
    });
  });

});
