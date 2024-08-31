from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)



# Association tables
employer_skills = db.Table('employer_skills',
    db.Column('employer_id', db.Integer, db.ForeignKey('employer.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skill.id'), primary_key=True)
)

job_skills = db.Table('job_skills',
    db.Column('job_id', db.Integer, db.ForeignKey('job.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skill.id'), primary_key=True)
)

resource_skills = db.Table('resource_skills',
    db.Column('resource_id', db.Integer, db.ForeignKey('resource.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skill.id'), primary_key=True)
)

class Employer(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # sortable fields
    name = db.Column(db.String(120), unique=True, nullable=False)
    industry = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    size = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    hq_location = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    company_type = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    description = db.Column(db.String(400), unique=False, nullable=False, default="Unknown")
    website_url = db.Column(db.String(240), unique=False, nullable=False, default="https://chiworks.me/404")
    
    # media
    image_url = db.Column(db.String(240), unique=False, nullable=True)
    map_url = db.Column(db.String(240), unique=False, nullable=False)
    
    # relationships
    jobs = db.relationship('Job', backref='employer', lazy=True)
    skills = db.relationship('Skill', secondary=employer_skills, backref=db.backref('employers', lazy=True))


    def __repr__(self):
        return '<Employer %r>' % self.name
    
class Job(db.Model):  
    id = db.Column(db.Integer, primary_key=True)  
    
    # sortable fields
    title = db.Column(db.String(120), unique=False, nullable=False)
    job_type = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    last_updated = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    salary = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")

    # media (stuff that shows up on instance page)
    description = db.Column(db.String(400), unique=False, nullable=True)
    image_url = db.Column(db.String(240), unique=False, nullable=False)
    posting_url = db.Column(db.String(240), unique=False, nullable=False, default="https://chiworks.me/404")

    # relationships
    employer_id = db.Column(db.Integer, db.ForeignKey('employer.id'), nullable=False)
    skills = db.relationship('Skill', secondary=job_skills, backref=db.backref('jobs', lazy=True))

    def __repr__(self):
        return '<Job %r>' % self.title

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return '<Skill %r>' % self.name

class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)  
    
    # sortable fields
    name = db.Column(db.String(120), unique=False, nullable=False)
    price = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    instructor = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    locale = db.Column(db.String(60), unique=False, nullable=False, default="Unknown")
    
    # media
    headline = db.Column(db.String(400), unique=False, nullable=True)
    image_url = db.Column(db.String(240), unique=False, nullable=False, default="https://chiworks.me/404")
    course_url = db.Column(db.String(240), unique=False, nullable=False, default="https://chiworks.me/404")

    # relationships
    skills_taught = db.relationship('Skill', secondary=resource_skills, backref=db.backref('resources', lazy=True))

    def __repr__(self):
        return '<Resource %r>' % self.name