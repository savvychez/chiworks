from init import app
from database.models import db, Employer, Job, Skill, Resource
from sqlalchemy import desc, cast, Integer, func, or_, Float, case
from sqlalchemy.orm import aliased, contains_eager, joinedload, subqueryload
from sqlalchemy.sql import literal_column
from flask_cors import cross_origin
from flask import Response, request

import json
import re

app.debug = True


@app.route("/")
@app.route("/test")
@cross_origin()
def test_app():
    # get number of instances
    num_employers = Employer.query.count()
    num_jobs = Job.query.count()
    num_resources = Resource.query.count()
    return "<div style='font-family: sans-serif; margin: 0 auto; padding: 20px 40px;'><h1>chiworks api is running!</h1>" + "<h2>" + str(num_employers) + " employers</h2><h2>" + str(num_jobs) + " jobs</h2><h2>" + str(num_resources) + " resources<h2/></div>"
    


@app.route("/employers", methods=["GET"])
@app.route("/employers/", methods=["GET"])
@cross_origin()
def employers():

    # Get url parameters
    employer_names = request.args.getlist('employerName')
    hq_locations = request.args.getlist('hqLocation')
    industries = request.args.getlist('industry')
    min_size = request.args.get('sizeMin', default=None, type=int)
    max_size = request.args.get('sizeMax', default=None, type=int)
    employer_types = request.args.getlist('type')
    sort_type = request.args.get('sortBy', default='', type=str)
    is_descending = request.args.get('isDesc', default='false', type=str)

    # Apply filters
    query = Employer.query

    if employer_names:
        name_filters = [Employer.name.ilike(f"{name}") for name in employer_names]
        query = query.filter(or_(*name_filters))
    if hq_locations:
        location_filters = [Employer.hq_location.ilike(f"{location}") for location in hq_locations]
        query = query.filter(or_(*location_filters))
    if industries:
        industry_filters = [Employer.industry.ilike(f"{industry}") for industry in industries]
        query = query.filter(or_(*industry_filters))
    if min_size:
        size_expression = cast(func.replace(func.substring_index(Employer.size, '-', 1), ',', ''), Integer)
        query = query.filter(size_expression >= min_size)
    if max_size:
        size_expression = cast(func.replace(func.substring_index(Employer.size, '-', 2), ',', ''), Integer)
        query = query.filter(size_expression <= max_size)
    if employer_types:
        type_filters = [Employer.company_type.ilike(f"{type}") for type in employer_types]
        query = query.filter(or_(*type_filters))

    # Apply sorting options
    if sort_type:
        if sort_type == 'size':
            sort_expression = func.cast(func.replace(func.substring_index(Employer.size, '-', 1), ',', ''), Integer)
        else:
            sort_expression = getattr(Employer, sort_type, None)
        query = query.order_by(desc(sort_expression)) if is_descending == 'true' else query.order_by(sort_expression)

    employers = query.all()

    res = []

    for employer in employers:
        res.append(
            {
                "id": employer.id,
                "name": employer.name,
                "industry": employer.industry,
                "size": employer.size,
                "hq_location": employer.hq_location,
                "company_type": employer.company_type,
                "description": employer.description,
                "website_url": employer.website_url,
                "image_url": employer.image_url,
                "map_url": employer.map_url,
            }
        )

    return Response(json.dumps(res, indent=4), mimetype="application/json")


@app.route("/employers/<employer_id>", methods=["GET"])
@cross_origin()
def employer(employer_id):
    employer = (
        Employer.query.options(joinedload(Employer.skills))
        .filter_by(id=employer_id)
        .first()
    )

    if not employer:
        return Response(
            json.dumps({"error": "Employer not found"}),
            status=404,
            mimetype="application/json",
        )
    skill_names = [skill.name for skill in employer.skills]

    # Use single query for jobs
    jobs = [
        {
            "id": job.id,
            "route": "jobs",
            "title": job.title,
            "image": job.image_url,
            "subheading": job.job_type,
            "details": [
                ["Salary", job.salary],
                ["Last Updated", job.last_updated.split("T")[0]],
            ],
        }
        for job in employer.jobs
    ]

    # Use single query for resources
    resources = []
    if skill_names:
        skills_resources = (
            Resource.query.options(joinedload(Resource.skills_taught))
            .filter(Resource.skills_taught.any(Skill.name.in_(skill_names)))
            .all()
        )
        for resource in skills_resources:
            res_skills = [
                resource_skill.name for resource_skill in resource.skills_taught
            ]
            res_skills_str = ", ".join(res_skills)
            if len(res_skills_str) > 100:
                truncated_str = res_skills_str[:100]
                last_comma = truncated_str.rfind(",")
                res_skills_str = truncated_str[:last_comma] + " ..."
            resources.append(
                {
                    "id": resource.id,
                    "route": "resources",
                    "title": resource.name,
                    "image": resource.image_url,
                    "subheading": resource.instructor,
                    "details": [
                        ["Price", resource.price],
                        ["Locale", resource.locale],
                        ["Skills Taught", res_skills_str],
                    ],
                }
            )

        r = {
            "id": employer.id,
            "name": employer.name,
            "hq_location": employer.hq_location,
            "industry": employer.industry,
            "size": employer.size,
            "company_type": employer.company_type,
            "description": employer.description,
            "website_url": employer.website_url,
            "image_url": employer.image_url,
            "map_url": employer.map_url,
            "jobs": jobs,
            "resources": resources,
        }

        return Response(json.dumps(r, indent=4), mimetype="application/json")


@app.route("/jobs", methods=["GET"])
@app.route("/jobs/", methods=["GET"])
@cross_origin()
def jobs():
    EmployerAlias = aliased(Employer)
    query = db.session.query(Job, EmployerAlias).join(EmployerAlias, EmployerAlias.id == Job.employer_id).options(contains_eager(Job.employer.of_type(EmployerAlias)), joinedload(Job.skills))
    
    # Get url parameters
    titles = request.args.getlist('title')
    job_types = request.args.getlist('jobType')
    last_updated = request.args.get('lastUpdated', default='', type=str)
    min_salary = request.args.get('minSalary', default=None, type=int)
    employer_names = request.args.getlist('employerName')
    skills = request.args.getlist('skill')
    sort_type = request.args.get('sortBy', default='title', type=str)
    is_descending = request.args.get('isDesc', default='false', type=str)

    # Apply filters
    if titles:
        title_filters = [Job.title.ilike(f"{title}") for title in titles]
        query = query.filter(or_(*title_filters))
    if job_types:
        type_filters = [Job.job_type.ilike(f"{type}") for type in job_types]
        query = query.filter(or_(*type_filters))
    if last_updated:
        query = query.filter(Job.last_updated >= last_updated)
    # if min_salary:
    #     salary_case = case(
    #         [
    #             # Handles hourly wage format
    #             (Job.salary.like('% per hour'),
    #             ((cast(func.regexp_replace(func.substring(Job.salary, 1, func.position(' - ' in Job.salary) - 1), '[^\d.]', '', 'g'), Numeric) +
    #             cast(func.regexp_replace(func.substring(Job.salary, func.position(' - ' in Job.salary) + 3, func.position(' per hour' in Job.salary) - func.position(' - ' in Job.salary) - 3), '[^\d.]', '', 'g'), Numeric)) / 2) * 8 * 260),

    #             # Handles annual salary format
    #             (Job.salary.like('%k-%k'),
    #             ((cast(func.regexp_replace(func.substring(Job.salary, 1, func.position(' - ' in Job.salary) - 1), '[^\d.]', '', 'g'), Integer) * 1000 +
    #             cast(func.regexp_replace(func.substring(Job.salary, func.position(' - ' in Job.salary) + 3, func.position('k' in Job.salary, func.position(' - ' in Job.salary) + 3) - func.position(' - ' in Job.salary) - 3), '[^\d.]', '', 'g'), Integer) * 1000) / 2))
    #         ],
    #         else_=0
    #     ).label('salary_case')
    #     query = query.having(salary_case >= min_salary)
    if employer_names:
        name_filters = [EmployerAlias.name.ilike(f"%{name}%") for name in employer_names]
        query = query.filter(or_(*name_filters))
    if skills:
        skills_filter = [Job.skills.any(Skill.name.ilike(skill)) for skill in skills]
        query = query.filter(or_(*skills_filter))
    
    # Apply sorting
    if sort_type:
        if sort_type == 'salary':
            pass
        elif sort_type == 'employer_name':
            sort_expression = getattr(EmployerAlias, 'name', None)
        else:
            sort_expression = getattr(Job, sort_type, None)
        query = query.order_by(desc(sort_expression)) if is_descending == 'true' else query.order_by(sort_expression)

    jobs = query.all()

    res = []

    for job, employer in jobs:
        # get employer for job
        # employer = Employer.query.filter_by(id=job.employer_id).first()
        # employer_name = employer.name

        # get skills for job
        skills = []
        for skill in job.skills:
            skills.append(skill.name)

        res.append(
            {
                "id": job.id,
                "title": job.title,
                "job_type": job.job_type,
                "last_updated": job.last_updated,
                "salary": job.salary,
                "description": job.description,
                "image_url": job.image_url,
                "posting_url": job.posting_url,
                "employer_id": employer.id,
                "employer_name": employer.name,
                "skills": skills,
            }
        )

    return Response(json.dumps(res, indent=4), mimetype="application/json")


@app.route("/jobs/<job_id>", methods=["GET"])
@cross_origin()
def job(job_id):
    job = Job.query.options(joinedload(Job.skills)).filter_by(id=job_id).first()

    if not job:
        return Response(
            json.dumps({"error": "Job not found"}),
            status=404,
            mimetype="application/json",
        )

    skill_names = [skill.name for skill in job.skills]
    skills_string = ", ".join(skill_names)

    # Information for employer card
    employer = (
        Employer.query.options(joinedload(Employer.skills))
        .filter_by(id=job.employer_id)
        .first()
    )
    job_employer = {
        "id": employer.id,
        "route": "employers",
        "title": employer.name,
        "image": employer.image_url,
        "subheading": employer.hq_location,
        "details": [
            ["Company Type", employer.company_type],
            ["Size", employer.size],
            ["Industry", employer.industry],
        ],
    }

    # Use single query for resources
    resources = []
    if skill_names:
        skills_resources = (
            Resource.query.options(joinedload(Resource.skills_taught))
            .filter(Resource.skills_taught.any(Skill.name.in_(skill_names)))
            .all()
        )
        for resource in skills_resources:
            res_skills = [
                resource_skill.name for resource_skill in resource.skills_taught
            ]
            res_skills_str = ", ".join(res_skills)
            if len(res_skills_str) > 100:
                truncated_str = res_skills_str[:100]
                last_comma = truncated_str.rfind(",")
                res_skills_str = truncated_str[:last_comma] + " ..."
            resources.append(
                {
                    "id": resource.id,
                    "route": "resources",
                    "title": resource.name,
                    "image": resource.image_url,
                    "subheading": resource.instructor,
                    "details": [
                        ["Price", resource.price],
                        ["Locale", resource.locale],
                        ["Skills Taught", res_skills_str],
                    ],
                }
            )

    r = {
        "id": job.id,
        "title": job.title,
        "job_type": job.job_type,
        "last_updated": job.last_updated.split("T")[0],
        "salary": job.salary,
        "skillset": skills_string,
        "description": job.description,
        "posting_url": job.posting_url,
        "image_url": job.image_url,
        "employer": job_employer,
        "resources": resources,
    }

    return Response(json.dumps(r, indent=4), mimetype="application/json")


@app.route("/resources", methods=["GET"])
@app.route("/resources/", methods=["GET"])
def resources():

    query = Resource.query.options(joinedload(Resource.skills_taught))

    # Get url parameters
    names = request.args.getlist('name')
    max_price = request.args.get('maxPrice', default='', type=str)
    instructors = request.args.getlist('instructor')
    locales = request.args.getlist('locale')
    skills = request.args.getlist('skill')
    sort_type = request.args.get('sortBy', default='', type=str)
    is_descending = request.args.get('isDesc', default='false', type=str)

    # Apply filters
    if names:
        name_filters = [Resource.name.ilike(f"{name}") for name in names]
        query = query.filter(or_(*name_filters))
    if max_price:
        if max_price.lower() == 'free':
            query = query.filter(Resource.price == 'Free')
        else:
            try:
                max_price_float = float(max_price)
                query = query.filter(cast(re.sub(r'[^0-9.]', '', Resource.price), Float) <= max_price_float)
            except ValueError:
                pass
    if instructors:
        instructor_filters = [Resource.instructor.ilike(f"{instructor}") for instructor in instructors]
        query = query.filter(or_(*instructor_filters))
    if locales:
        locale_filters = [Resource.locale.ilike(f"{locale}") for locale in locales]
        query = query.filter(or_(*locale_filters))
    if skills:
        skill_filters = [Resource.skills_taught.ilike(f"{skill}") for skill in skills]
        query = query.filter(or_(*skill_filters))


    # Apply sorting
    if sort_type:
        if sort_type == 'max_price':
            pass
        else:
            sort_expression = getattr(Resource, sort_type, None)
        query = query.order_by(desc(sort_expression)) if is_descending == 'true' else query.order_by(sort_expression)

    resources = query.all()

    res = []

    for resource in resources:
        skills = []
        for skill in resource.skills_taught:
            skills.append(skill.name)

        skills_string = ", ".join(skills)
        if len(skills_string) > 100:
            truncated_str = skills_string[:100]
            last_comma = truncated_str.rfind(",")
            skills_string = truncated_str[:last_comma] + " ..."
        res.append(
            {
                "id": resource.id,
                "name": resource.name,
                "price": resource.price,
                "instructor": resource.instructor,
                "locale": resource.locale,
                "image_url": resource.image_url,
                "skills_taught": skills_string,
            }
        )

    return Response(json.dumps(res, indent=4), mimetype="application/json")


@app.route("/resources/<resource_id>", methods=["GET"])
@cross_origin()
def resource(resource_id):
    resource = (
        Resource.query.options(joinedload(Resource.skills_taught))
        .filter_by(id=resource_id)
        .first()
    )

    if not resource:
        return Response(
            json.dumps({"error": "Resource not found"}),
            status=404,
            mimetype="application/json",
        )

    skill_names = [skill.name for skill in resource.skills_taught]
    skills_string = ", ".join(skill_names)

    # Jobs with their employers in a single query
    if skill_names:
        skills_jobs = (
            Job.query.options(joinedload(Job.skills), joinedload(Job.employer))
            .filter(Job.skills.any(Skill.name.in_(skill_names)))
            .all()
        )

        jobs = [
            {
                "id": job.id,
                "route": "jobs",
                "title": job.title,
                "image": job.image_url,
                "subheading": job.employer.name,  # Directly accessing employer from job object
                "details": [
                    ["Salary", job.salary],
                    ["Last Updated", job.last_updated.split("T")[0]],
                    [
                        "Skills Taught",
                        ", ".join(skill.name for skill in job.skills)[:97] + "...",
                    ],
                ],
            }
            for job in skills_jobs
        ]

        # Fetch employers with their skills
        skills_employers = (
            Employer.query.options(subqueryload(Employer.skills))
            .filter(Employer.skills.any(Skill.name.in_(skill_names)))
            .all()
        )

        employers = [
            {
                "id": employer.id,
                "route": "employers",
                "title": employer.name,
                "image": employer.image_url,
                "subheading": employer.hq_location,
                "details": [
                    ["Company Type", employer.company_type],
                    ["Size", employer.size],
                    ["Industry", employer.industry],
                ],
            }
            for employer in skills_employers
        ]

    r = {
        "id": resource.id,
        "name": resource.name,
        "price": resource.price,
        "instructor": resource.instructor,
        "locale": resource.locale,
        "headline": resource.headline,
        "course_url": resource.course_url,
        "image_url": resource.image_url,
        "skills_taught": skills_string,
        "related_employers": employers,
        "related_jobs": jobs,
    }

    return Response(json.dumps(r, indent=4), mimetype="application/json")