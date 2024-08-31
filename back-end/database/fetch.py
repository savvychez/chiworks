import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

# JOOBLE API (jobs)
jooble_api_base_url = "https://jooble.org/api/"
jooble_api_key = os.environ.get("JOOBLE_API_KEY")

# UDEMY API (resources)
udemy_root = "https://www.udemy.com/api-2.0/"
udemy_courses_endpoint = "courses/"
udemy_auth = os.environ.get("UDEMY_AUTH")

# CORESIGNAL API (employers) ***CAREFUL***
cs_company_root = "https://api.coresignal.com/cdapi/v1/linkedin/company/collect/"
cs_api_key = os.environ.get("CORESIGNAL_API_KEY")

# GOOGLE SEARCH API (images)
google_api_base_url = "https://www.googleapis.com/customsearch/v1"
google_search_engine_id = os.environ.get("GOOGLE_SE_ID")
google_api_key = os.environ.get("GOOGLE_SEARCH_API_KEY")

# OPENAI API KEY
openai_api_key = os.environ.get("OPEN_AI_API_KEY")

# MAP API KEY
map_api_key = os.environ.get("MAP_API_KEY")



# Finding jobs in Chicago that show a salary. 
def get_jobs(page_num):
    payload = {
        "page": page_num,
        "page_size": 20,
        "salary": 1,
        "location": "Chicago"
    }
    headers = {
        "Authorization": jooble_api_key
    }
    response = requests.post(jooble_api_base_url + jooble_api_key, headers=headers, json=payload)
    data = response.json()
    return data["jobs"]

def get_resources(page_num):
    headers = {
        "Authorization": udemy_auth
    }
    params = {
        "page_size": 20, 
        "page": page_num
    }
    response = requests.get(udemy_root + udemy_courses_endpoint, headers=headers, params=params)
    data = response.json()
    return data["results"]

# DO NOT CALL UNTIL READY FOR DATABASE ENTRY
def get_employer(company_endpoint):
    headers = {
        "Authorization": f"Bearer {cs_api_key}"
    }
    response = requests.get(cs_company_root + company_endpoint, headers=headers)
    data = response.json()
    return data

def get_image(search):
    params = {
        'q': search,
        'key': google_api_key,
        'cx': google_search_engine_id,
        'searchType': 'image',
        'num': 1
    }
    response = requests.get(google_api_base_url, params=params)
    if "items" not in response.json() or len(response.json()['items']) == 0:
        return "https://chiworks.me/public/404c.png"
    return response.json()['items'][0]['link']

def get_map_url(search):
    search = search.replace(" ", "+")
    search += "+Chicago"
    return f"https://www.google.com/maps/embed/v1/place?key={map_api_key}&q={search}"

