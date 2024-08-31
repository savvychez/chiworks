
from .fetch import *
from .models import db, Employer, Job, Resource, Skill
import json
from .skill_finder import *

checked_companies = set()

def populate():
    # populate_jobs_and_employers()
    # populate_skills()
    # populate_jobs_skills()
    # populate_resource_skills()
    # populate_skills_for_employers()
    pass

def populate_jobs_and_employers():
    for i in range(13, 20): 
        job_results = get_jobs(i)
        for job in job_results:
            if "title" not in job or "company" not in job or not job['title'] or not job['company']:
                print("skipping job with no title or company")
                continue

            print(i, ". processing job with title", job['title'], "from company", job['company'])
            company_name = job['company']
            company_endpoint = company_name.replace(" ", "").lower()
            if company_endpoint not in checked_companies: # Company has not been queried
                comp_data = get_employer(company_endpoint)
                print("\tadding", company_endpoint, "to checked_companies")
                checked_companies.add(company_endpoint)
                if 'name' in comp_data.keys() and comp_data['name'] != None: # Company has not been queried and exists in Coresignal DB
                    print("\tcompany " + comp_data['name'] + " found in API, so trying to add to DB!")
                    populate_employer(comp_data, known_name=company_name)
                else: # comp not in db, do nothing
                    continue 
            
            print("\tnow trying to add JOB " + job['title'] + " to database for company " + company_name)
            
            employer = Employer.query.filter_by(name=company_name).first()
            if employer: # in database
                print("\tcompany found in database, so adding JOB!")
                image_url = get_image(job['title'])

                jobs_with_title_and_company = Job.query.filter_by(title=job['title'], employer_id=employer.id).all()
                if jobs_with_title_and_company: # job already in db
                    print("skipping job with title", job['title'], "because it already exists in the database")
                    continue

                new_job = Job(
                    title=job['title'],
                    job_type=job['type'],
                    last_updated=job['updated'],
                    salary=job['salary'],
                    description=job['snippet'],
                    image_url=image_url, 
                    posting_url=job['source'],
                    employer_id=employer.id)
                db.session.add(new_job)
                db.session.commit()
            else: 
                print("\tcompany not found in database, so skipping job!")

def populate_employer(data, known_name=None):
    if known_name != data['name']:
        print("\t\tmismatch between names, c_api:", data['name'], "j_api:", known_name)

    # check if employer already in DB, 
    # if so, return
    employers_with_name = Employer.query.filter_by(name=known_name).all()
    if employers_with_name:
        print("\t\tcompany already in database, so skipping!")
        return

    print("\t\tpopulating data for company", data['name'] )
    if not data['name']:
        print("\t\tdata has no name?? logging data and returning")
        print("\t\t", data)
        return
    map_url = get_map_url(data['name'])
    new_employer = Employer(
        name=known_name,
        industry=data['industry'],
        size=data['size'],
        hq_location=data['headquarters_new_address'],
        company_type=data['type'],
        description=data['description'],
        website_url=data['website'],
        image_url=data['logo_url'],
        map_url=map_url)
    db.session.add(new_employer)
    db.session.commit()
    return

def populate_resources():
    for i in range(1,11):
        get_data = get_resources(i)
        for resource in get_data:
            if not get_data:
                print("no more data, breaking")
                break

            print("found resource with name", resource['title'])

            new_resource = Resource (
                name=resource['title'],
                price=resource['price'],
                instructor=resource['visible_instructors'][0]['display_name'],
                locale=resource['locale']['title'],
                headline=resource['headline'],
                image_url=resource['image_480x270'],
                course_url=resource['url']
            )

            print("adding resource!")
            db.session.add(new_resource)
            db.session.commit()
            print("added resource!")

def populate_jobs_skills():
    init()
    # get all jobs, for each job, set skills using get_skills_for_job, update db
    jobs = Job.query.all()
    for job in jobs:
        if len(job.skills) > 0:
            print("skipping job", job.title, "because it already has skills")
            continue
        print("getting skills for job", job.title)
        skills = get_skills_for_job(job.title, job.description)
        for skill in skills:
            print("\tadding skill", skill, "to job", job.title)

            skill = Skill.query.filter_by(name=skill).first()
            if skill:
                job.skills.append(skill)
            else:
                print("had to make skill :((", skill)
                new_skill = Skill(name=skill)
                db.session.add(new_skill)
                job.skills.append(new_skill)
        print("\t...committing job!")
        db.session.commit()


def populate_resource_skills():
    init()
    resources = Resource.query.all()
    for resource in resources:
        if len(resource.skills_taught) > 0:
            print("skipping resource", resource.name, "because it already has skills")
            continue
        print("getting skills for resource", resource.name)
        skills = get_skills_for_resources(resource.name, resource.headline)
        if( len(skills) == 0):
            print("no skills found for resource", resource.name, "skipping!")
            print("HEY DELETE THIS RESOURCE!! ", resource.id)
            continue
        for skill in skills:
            print("\tadding skill", skill, "to resource", resource.name)

            skill = Skill.query.filter_by(name=skill).first()
            if skill:
                resource.skills_taught.append(skill)
            else:
                print("had to make skill :((", skill)
                new_skill = Skill(name=skill)
                db.session.add(new_skill)
                resource.skills_taught.append(new_skill)
        print("\t...committing resource!")
        db.session.commit()

# def populate_skills_for_employers():
#     init()
#     employers = Employer.query.all()
#     for employer in employers:
#         if len(employer.skills) > 0:
#             print("skipping employer", employer.name, "because it already has skills")
#             continue
#         print("getting skills for employer", employer.name)
#         overall_skills = []
#         for job in employer.jobs:
#             job_skills = job.skills
#             for skill in job_skills:
#                 overall_skills.append(skill)
#                 print("\tgetting skill", skill.name, "for employer", employer.name)
#         overall_skills = list(set(overall_skills))
#         print("\t...total skills for employer", employer.name, "is", len(overall_skills))
#         for skill in overall_skills:
#             print("\tadding", skill, "to employer", employer.name)
#             # skill = Skill.query.filter_by(name=skill).first()
#             if skill:
#                 employer.skills.append(skill)
#             else:
#                 print("skill doesn't exist??", skill)
#                 print("really bad!")
#         print("\t...committing employer!")
#         db.session.commit()



def populate_skills():
    skills = load_skills()
    for skill in skills:
        new_skill = Skill(name=skill)
        db.session.add(new_skill)
        db.session.commit()

if __name__ == "__main__":
    populate()
