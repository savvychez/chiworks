from .fetch import *
from .models import db, Employer, Job, Resource, Skill

def update_job_images():

    bad_jobs = Job.query.filter(Job.id > 99).all()
    
    for job in bad_jobs:
        print(f"JOB ID {job.id}")
        print(f"JOB TITLE: {job.title}")
        job.image_url = get_image(job.title)
        print(f"NEW JOB URL: {job.image_url}")

    db.session.commit()