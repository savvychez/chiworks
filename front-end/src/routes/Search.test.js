import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Search from './Search.jsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as api from '../lib/api';

// Mock the API calls
jest.mock('../lib/api', () => ({
  getJobs: jest.fn(),
  getEmployers: jest.fn(),
  getResources: jest.fn(),
}));

// Mock 'useLoaderData' hook from 'react-router-dom'
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useLoaderData: jest.fn(),
  };
});

describe('Search Component Tests', () => {
  beforeEach(() => {
    // Setup initial data and mocks
    api.getJobs.mockResolvedValue([
      {
      id: 1,
      title: 'Test Title',
      image: 'test-image.jpg',
      subheading: 'hidden_check',
      details: ['Detail 1', 'Detail 2'],
    },
    {
      id: 2,
      title: 'Should not be there',
      image: 'test-image.jpg',
      subheading: 'visible_check',
      details: ['Detail 1', 'Detail 2'],
    }
  ]);
    api.getEmployers.mockResolvedValue([]);
    api.getResources.mockResolvedValue([]);

    // Mock useLoaderData
    const { useLoaderData } = require('react-router-dom');
    useLoaderData.mockReturnValue({ query: 'test' });
  });

  test('should render search component and load jobs data by default', async () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<Search />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert that the component renders correctly
    expect(screen.getByText('Search')).toBeInTheDocument();

    // Wait for only queried data to be in document
    await waitFor(() => {
      expect(screen.getByText('hidden_check')).toBeInTheDocument();
      expect(screen.queryByText('Job 2')).not.toBeInTheDocument();
    });
  });

  test('check fuzzy searching', async () => {
    const { useLoaderData } = require('react-router-dom');
    useLoaderData.mockReturnValue({ query: 'tast' });


    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<Search />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert that the component renders correctly
    expect(screen.getByText('Search')).toBeInTheDocument();

    // Wait for only queried data to be in document
    await waitFor(() => {
      expect(screen.getByText('hidden_check')).toBeInTheDocument();
      expect(screen.queryByText('Job 2')).not.toBeInTheDocument();
    });

  });
});