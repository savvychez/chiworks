import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import About, { GitLabService } from '../routes/About';

jest.mock('axios');

jest.mock('../components/MemberCard', () => {
  return jest.fn(({ data }) => <div data-testid={`member-card-${data.name}`} />);
});

describe('GitLabService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getClosedIssuesByUserId: fetches closed issues by user ID and returns the filtered response', async () => {
    const mockResponse = {
      data: [
        { closed_by: { id: 1 } },
        { closed_by: { id: 2 } },
        { closed_by: { id: 1 } },
      ],
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    const result = await GitLabService.getClosedIssuesByUserId(1);

    expect(axios.get).toHaveBeenCalled();
    expect(result.length).toEqual(2);
  });

 it('fetchMetricsForMember: fetches metrics for a member and returns the computed metrics', async () => {
  axios.get
  .mockResolvedValueOnce({ data: [{ name: 'Akram Bettayeb', id: 1 }] })
  .mockResolvedValueOnce({ data: [{ name: "master" }] })  
  .mockResolvedValueOnce({ data: [{ author_name: 'Akram Bettayeb' }] })
  .mockResolvedValueOnce({ data: [                                      
    { closed_by: { id: 1 } },
  ] });

  const memberData = {
    gitLabMemberName: "Akram Bettayeb",
    gitContributorName: "Akram Bettayeb",
  };

  const result = await GitLabService.fetchMetricsForMember(memberData, 'Akram');

  expect(axios.get).toHaveBeenCalledTimes(4);
  expect(result.commitCount).toEqual(1);
});


});

describe('About', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<About />);
    expect(getByText('About')).toBeInTheDocument();
  });

  it('renders four MemberCards, one for each member', async () => {
    const { getAllByTestId } = render(<About />);
    
    await waitFor(() => {
      const memberCards = getAllByTestId((value, element) => value.startsWith('member-card-'));
      expect(memberCards.length).toBe(4);
    });
  });
});
