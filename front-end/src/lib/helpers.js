export const formatJobData = (job) => {
    const skillsString = job.skills.join(', ');

    return {
      id: job.id,
      route: "jobs",
      subheading: job.employer_name,
      title: job.title,
      image: job.image_url == "https://chiworks.me/public/404c.png" ? "./404c.png" : job.image_url,
      details: [
        ["Last Updated", job.last_updated.split("T")[0]],
        ["Job Type", job.job_type],
        ["Salary", job.salary],
        ["Skills", skillsString],
      ]
    };
  }

export const formatEmployerData = (employer) => {
    return {
        id: employer.id,
        route: "employers",
        title: employer.name,
        subheading: employer.hq_location,
        image: employer.image_url,
        details: [
            ["Company Type", employer.company_type],
            ["Size", employer.size],
            ["Industry", employer.industry],
        ]
    };
}

export const formatResourceData = (resource) => {
    return {
        id: resource.id,
        route: "resources",
        title: resource.name,
        subheading: resource.instructor,
        image: resource.image_url,
        details: [
            ["Skillsets Taught", resource.skills_taught],
            ["Price", resource.price],
            ["Dialect", resource.locale],
        ]
    };
}