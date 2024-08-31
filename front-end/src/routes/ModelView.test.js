import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModelView from './ModelView.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

const mockFetchData = jest.fn().mockResolvedValue([
  {
    id: 1,
    title: 'Test Title',
    image: 'test-image.jpg',
    subheading: 'Test Subheading',
    details: ['Detail 1', 'Detail 2'],
  },
]);

jest.mock('../components/SortDropdown', () => () => <div>Sort By:</div>);
jest.mock('../components/InstanceCard', () => () => <div>Instance Card</div>);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({ pathname: '/test' }),
}));

describe('<ModelView />', () => {
  let mockTitle, mockRenderCard;

  beforeEach(() => {
    mockTitle = 'Jobs';
    mockRenderCard = jest.fn();
  });

  it('fetches and displays data when location changes', async () => {
    render(
      <Router>
        <ModelView title={mockTitle} renderCard={mockRenderCard} fetchData={mockFetchData} />
      </Router>
    );
    
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    
    await waitFor(() => screen.queryByText('1 jobs found'));
  });

  it('displays the correct placeholder text in the Input', () => {
    render(
      <Router>
        <ModelView title={mockTitle} renderCard={mockRenderCard} fetchData={mockFetchData} />
      </Router>
    );
    
    expect(screen.getByPlaceholderText(`Search ${mockTitle.toLowerCase()}`)).toBeInTheDocument();
  });

  it('renders the SortByDropdown component', () => {
    render(
      <Router>
        <ModelView title={mockTitle} renderCard={mockRenderCard} fetchData={mockFetchData} />
      </Router>
    );

    const sortByDropdown = screen.getByText('Sort By:');
    expect(sortByDropdown).toBeInTheDocument();
  });

  it('renders an InstanceCard for each item in data', async () => {
    render(
      <Router>
        <ModelView title={mockTitle} renderCard={mockRenderCard} fetchData={mockFetchData} />
      </Router>
    );

    await waitFor(() => {
      const instanceCards = screen.getAllByText('Instance Card');
      expect(instanceCards.length).toBe(1);
    });
  });
});
