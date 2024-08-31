import os
import sys
import openai
import json
from dotenv import load_dotenv

skills = []
functions = [ 
        {
            "name": "log_skills",
            "description": "Logs 7 skills from the skills list for a given entry",
            "parameters": {
                "type": "object",
                "properties": {
                    "skill1": {
                        "type": "string",
                        "description": "The first skill associated with the entry",
                    },
                    "skill2": {
                        "type": "string",
                        "description": "The second skill associated with the entry"
                    },
                    "skill3": {
                        "type": "string",
                        "description": "The third skill associated with the entry"
                    },
                    "skill4": {
                        "type": "string",
                        "description": "The fourth skill associated with the entry"
                    },
                    "skill5": {
                        "type": "string",
                        "description": "The fifth skill associated with the entry"
                    },
                    "skill6": {
                        "type": "string",
                        "description": "The sixth skill associated with the entry"
                    },
                    "skill7": {
                        "type": "string",
                        "description": "The seventh skill associated with the entry"
                    }
                },
                "required": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7"],
            },
        }
    ]



def load_skills():
    with open('./database/skills_list.txt', 'r') as f:
        return [line.strip() for line in f.readlines()]


def determine_skills_from_title_description(skills, item_type, title, description):

    messages = [{"role": "user", "content": "Read this list of skills:"}]
    messages.append({
        "role": "user",
        "content": "".join(skills)
    })
    messages.append({
        "role": "user",
        "content": "Now, read this " + item_type + " name:"
    })
    messages.append({
        "role": "user",
        "content": title
    })

    if len(description) > 0:
        messages.append({
            "role": "user",
            "content": "Now, read this " +  item_type + " description:"
        })
        messages.append({
            "role": "user",
            "content": description
        })

    messages.append({
        "role": "user",
        "content": "Now, give me 7 skills from that list that this name " + "and description" if len(description) > 0 else "" + "require(s):"
    })
    
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        functions=functions,
        function_call={
            "name":"log_skills"
        }
    )

    message_res = completion.choices[0].message
    fn = message_res["function_call"]
    args = json.loads(fn["arguments"])

    required_skills = list(args.values())

    for skill in required_skills:
        if skill not in skills:
            required_skills.remove(skill)
    
    return required_skills
    


def __valid__(skills_for_input):
    return all(skill in skills for skill in skills_for_input)

def init():
    global skills
    skills = load_skills()

    load_dotenv()
    openai.organization = "org-exslwZojRIBZFKeavJZPwEyl"
    openai.api_key = os.getenv("OPENAI_API_KEY")


def get_skills_for_employers(employer_name, desc):
    global skills
    em_skills = determine_skills_from_title_description(skills, "employer", employer_name, desc)
    while len(em_skills) < 5 or not __valid__(em_skills):
        em_skills = determine_skills_from_title_description(skills, "employer", employer_name, desc)
    return em_skills


def get_skills_for_job(job_name, desc):
    global skills
    job_skills = determine_skills_from_title_description(skills, "job", job_name, desc)
    count = 0
    while (len(job_skills) < 5 or not __valid__(job_skills) ) and count < 5:
        job_skills = determine_skills_from_title_description(skills, "job", job_name, desc)
        count += 1

    if not __valid__(job_skills):
        print("Failed to find skills for job", job_name, "after 5 attempts")
        clean_skills = []
        for skill in job_skills:
            if skill in skills:
                clean_skills.append(skill)
        return clean_skills

    
    return job_skills


def get_skills_for_resources(resource_name, desc):
    global skills
    res_skills = determine_skills_from_title_description(skills, "resource", resource_name, desc)
    
    count = 0
    while (len(res_skills) < 5 or not __valid__(res_skills)) and count < 5:
        res_skills = determine_skills_from_title_description(skills, "resource", resource_name, desc)
        count+=1
        
    if not __valid__(res_skills):
        print("Failed to find skills for resource", resource_name, "after 5 attempts")
        clean_skills = []
        for skill in res_skills:
            if skill in skills:
                clean_skills.append(skill)
        return clean_skills
    
    return res_skills

def main():
    init()
    job_title = sys.argv[1]
    job_desc = sys.argv[2]

    skills_for_input = []
    while len(skills_for_input) < 5:
        skills_for_input = determine_skills_from_title_description(skills, "job", job_title, job_desc)
    print(skills_for_input)

    # validate
    print("Valid List: ", all(skill in skills for skill in skills_for_input))


if __name__ == "__main__":
    main()