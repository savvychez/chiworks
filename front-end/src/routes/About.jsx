import React, { useState, useEffect } from "react";
import axios from "axios";
import akram from "../assets/about_pictures/akram_pic.png";
import caiden from "../assets/about_pictures/caiden_pic.png";
import kaiden from "../assets/about_pictures/kaiden_pic.png";
import sarvesh from "../assets/about_pictures/sarvesh_pic.png";
import MemberCard from "../components/MemberCard";


const membersData = {
  Akram: {
    name: "Akram",
    image: akram,
    responsibility: "Front-end, GitLab API",
    gitLabMemberName: "Akram Bettayeb",
    gitContributorName: "Akram Bettayeb",
    unitTests: 25,
    bio: "Hi, I'm Akram. I'm a senior, and I'm excited to be working on this full-stack development project with the rest of the team!",
  },
  Caiden: {
    name: "Caiden",
    image: caiden,
    responsibility: "API, Documentation, Back-end",
    gitLabMemberName: "Caiden Borrego",
    gitContributorName: "borregocaiden",
    unitTests: 11,
    bio: "Hey, I'm Caiden! I am on the UT Men's Club Volleyball team, I like staying active, and I like hanging out with friends.",
  },
  Kaiden: {
    name: "Kaiden",
    image: kaiden,
    responsibility: "Back-end, AWS Web Hosting",
    gitLabMemberName: "Kaiden C Zapanta",
    gitContributorName: ["kaiden-z", "Kaiden-z"],
    unitTests: 9,
    bio: "Hey! I'm Kaiden, I'm a junior from San Antonio, and I'm excited to be gaining some experience in web dev!",
  },
  Sarvesh: {
    name: "Sarvesh",
    image: sarvesh,
    responsibility: "Front-end, UI/UX Design",
    gitLabMemberName: "Sarvesh Chezhian",
    gitContributorName: "Sarvesh Chezhian",
    unitTests: 9,
    bio: "Hey, I'm Savvy! I have some experience in web development. I'm really excited to work on a product as cool as chiworks! 🤩",
  },
};

export const GitLabService = {
  getClosedIssuesByUserId: async (userId) => {
    const response = await axios.get(`${API_URL}/issues`, {
      headers: HEADERS,
      params: { per_page: 100, closed_by: { id: userId }, state: "closed" },
    });
    const filtered = response.data.filter(
      (issue) => issue.closed_by.id === userId
    );
    return filtered;
  },

  fetchAllCommits: async () => {
    const branchesResponse = await axios.get(`${API_URL}/repository/branches`, {
      headers: HEADERS,
    });
    const branches = branchesResponse.data;

    const allCommits = [];
    for (const branch of branches) {
      const commitsResponse = await axios.get(`${API_URL}/repository/commits`, {
        headers: HEADERS,
        params: { ref_name: branch.name, per_page: 100 },
      });
      allCommits.push(...commitsResponse.data);
    }
    return allCommits;
  },

  fetchMetricsForMember: async (memberData, memberName) => {
    const { gitLabMemberName, duplicatedCommits } = memberData;

    const membersResponse = await axios.get(`${API_URL}/members`, {
      headers: HEADERS,
    });

    const gitLabMember = membersResponse.data.find(
      (member) => member.name === gitLabMemberName
    );

    if (!gitLabMember) return {};

    const allCommits = await GitLabService.fetchAllCommits();

    let gitLabContributors = [];

    if (Array.isArray(memberData.gitContributorName)) {
      for (const gitName of memberData.gitContributorName) {
        const commitsByContributor = allCommits.filter(
          (commit) => commit.author_name === gitName
        );
        gitLabContributors.push(...commitsByContributor);
      }
    } else {
      gitLabContributors = allCommits.filter(
        (commit) => commit.author_name === memberData.gitContributorName
      );
    }

    const uniqueCommits = {};
    gitLabContributors.forEach((commit) => {
      uniqueCommits[commit.id] = commit;
    });

    const totalCommits = Object.keys(uniqueCommits).length;

    const closedIssues = await GitLabService.getClosedIssuesByUserId(
      gitLabMember.id
    );
    return {
      name: memberName,
      image: memberData.image,
      responsibility: memberData.responsibility,
      commitCount: totalCommits,
      closedIssues: closedIssues.length,
      unitTests: memberData.unitTests || 0,
      bio: memberData.bio,
    };
  },
};

function About({ gitLabService = GitLabService }) {
  const [metrics, setMetrics] = useState([
    membersData["Akram"],
    membersData["Caiden"],
    membersData["Kaiden"],
    membersData["Sarvesh"],
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all(
      Object.entries(membersData).map(([name, data]) =>
        gitLabService.fetchMetricsForMember(data, name)
      )
    )
      .then(setMetrics)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [gitLabService]);

  return (
    <div className="px-28 py-16 min-h-screen bg-slate-50">
      <h1 className="text-5xl py-10 font-serif font-bold text-[#3b4354]">
        About
      </h1>
      <p className="text-lg">
        Chiworks is a platform designed to address the deep-rooted unemployment
        challenges faced by the predominantly African-American community in
        Southside Chicago. Drawing upon the historical and systemic challenges
        this community has encountered, our website offers comprehensive
        resources to aid job seekers in not only discovering employment
        opportunities but also acquiring the essential skills to secure them.
        Recognizing the profound effects of past events and current phenomena
        such as White flight, deindustrialization, and systemic racism, chiworks
        serves as a source of hope and assistance for the community. Our primary
        users are the dedicated people of Southside Chicago, eager to connect
        with opportunities and enrich their lives.
      </p>
      <p className="py-5 text-lg">
        Chiworks is powered by a robust tech stack anchored by Node.JS. The
        website's functionality benefits from a combination of tools including
        Axios for HTTP requests, TailwindCSS for styling, the shadcn/ui
        component library for UI elements, React as the primary framework, React
        Router for seamless navigation, and Vite for efficient development and
        live reloading. Our data is sourced through APIs from leading job
        portals like Glassdoor and LinkedIn, as well as specialized resources
        like Coresignal and CareerOneStop. Comprehensive documentation for our
        REST API, which bridges the frontend and backend, is available via
        Postman, detailing its six primary endpoints and their capabilities.
      </p>
      <p className="pb-5 text-lg">
        The result of integrating the three data points of jobs, employers, and
        resources is a comprehensive platform that provides the user with a
        step-by-step guide to finding a job. One of the greatest challenges a
        user might face when looking for a job is not knowing where to start.
        Chiworks solves this problem by providing the user with a list of
        resources that apply to many jobs. The user can then find the resources
        that work best for them. Once the user has the necessary skills, they
        can immediately see the jobs their new skills apply to. Furthermore, the
        user can see the employers that are hiring for those jobs. This
        simplifies the complexities of a job search into an easy to follow
        process.
      </p>
      <p className="pb-5 text-lg">
        You can find our repo on GitLab&nbsp;
        <a
          href="https://gitlab.com/cs-373-group-2/chi-works"
          style={{ textDecoration: "underline", fontWeight: "bold" }}
        >
          here
        </a>
        .
      </p>

      <ul className="flex justify-between flex-wrap">
        {metrics.map((member, index) => (
          <MemberCard data={member} loading={loading} key={index} />
        ))}
      </ul>
    </div>
  );
}

export default About;
