 ## Team Members:
* Group Number: 52985_02

* Caiden Borrego
  * GitLab ID: borregocaiden (some commits will show ElBorrego52)
  * GitLab email: borregocaiden@gmail.com

* Kaiden Zapanta 
  * GitLab ID: schez
  * GitLab email: schezhian@utexas.edu

* Sarvesh Chezhian
  * GitLab ID: kaidenzapanta
  * GitLab email: kaidenzapanta@utexas.edu

* Akram Bettayeb
  * GitLab ID: akrambettayeb
  * GitLab email: bettayeb.akram@gmail.com

## Project Info: 

* Website Link: www.chiworks.me

* API Link: https://api.chiworks.me
  * /resources , /resource/<resource_id>
  * /employers, /employer/<employer_id>
  * /jobs, /job/<job_id>

* API Documentation: https://documenter.getpostman.com/view/29722655/2s9YJXakN2

## PHASE 1

* Git SHA Phase 1: d68a296cbf9199f3b501fb1e3f691f0aaf5fd1b6

* Phase 1 Leader: Sarvesh Chezhian

* Estimated Completion Time Phase 1: 30 hours

* Actual Completion Time Phase 1: 40 hours

* Comments: We encountered a bug with differing Git usernames which led to duplicate commits. This is why our commit number is so high in GitLab. This has been accounted for on our About page. 

## PHASE 2

* Git SHA Phase 2: 727aac1558d1f409eb680d4109e1b40054a18c67 

* Phase 2 Leader: Kaiden Zapanta
  * Responsibilites: Ensure everyone stays on task and delegate tasks based on skills. Give help when and where needed. Keep team on schedule and ensure project completed at a high level and on time. 

* Estimated Completion Time Phase 2 (Sarvesh): 15 hours
* Actual Completion Time Phase 2 (Sarvesh): 20 hours

* Estimated Completion Time Phase 2 (Akram): 15 hours
* Actual Completion Time Phase 2 (Akram): 20 hours

* Estimated Completion Time Phase 2 (Kaiden): 15 hours
* Actual Completion Time Phase 2 (Kaiden): 20 hours

* Estimated Completion Time Phase 2 (Caiden): 15 hours
* Actual Completion Time Phase 2 (Caiden): 20 hours

* Comments: 

## PHASE 3

* Git SHA Phase 3: b7bbc697d4ec5dc861b3fb36aa86b3b716d8744c

* Phase 3 Leader: Akram Bettayeb
  * Responsibilites: Ensure everyone stays on task and delegate tasks based on skills. Give help when and where needed. Keep team on schedule and ensure project completed at a high level and on time. Ensure sorting, filtering, and searching working 
  correctly 

* Estimated Completion Time Phase 3 (Sarvesh): 10 hours
* Actual Completion Time Phase 3 (Sarvesh): 15 hours

* Estimated Completion Time Phase 3 (Akram): 10 hours
* Actual Completion Time Phase 3 (Akram): 15 hours

* Estimated Completion Time Phase 3 (Kaiden): 10 hours
* Actual Completion Time Phase 3 (Kaiden): 15 hours

* Estimated Completion Time Phase 3 (Caiden): 10 hours
* Actual Completion Time Phase 3 (Caiden): 15 hours

* Comments: 

## PHASE 4

* Git SHA Phase 4: b7bbc697d4ec5dc861b3fb36aa86b3b716d8744c

* Phase 4 Leader: Caiden Borrego
  * Responsibilites: Ensure everyone stays on task and delegate tasks based on skills. Give help when and where needed. Keep team on schedule and ensure project completed at a high level and on time. Ensure visualizations 
  implemented correctly. 

* Estimated Completion Time Phase 4 (Sarvesh): 5 hours
* Actual Completion Time Phase 4 (Sarvesh): 5 hours

* Estimated Completion Time Phase 4 (Akram): 5 hours
* Actual Completion Time Phase 4 (Akram): 5 hours

* Estimated Completion Time Phase 4 (Kaiden): 5 hours
* Actual Completion Time Phase 4 (Kaiden): 5 hours

* Estimated Completion Time Phase 4 (Caiden): 5 hours
* Actual Completion Time Phase 4 (Caiden): 5 hours

* Comments: 
--------------------------------------------------------------------------------

Name of the project: ChiWorks 

The proposed project: A project to help the unemployed community within 
Southside Chicago that is looking for work. The unemployment problem within 
this community, which is predominantly African-American, has deep and complex 
historical roots which began back in mid-20th century during the "White Flight" 
era. This was when White residents began leaving South Side Chicago which led 
to a large African-American population, relatively. Deindustrialization during the 
latter half of the 20th century also led to many factories in the region
to shut down and factory workers to lose their jobs. These problems, along
with a lack of quality education and systemic racism, has led to a deep-rooted
issue of unemployment within this underserved community. Additionally, these 
issues have led to a lack of resources to find and gain employment within the 
area. Our website is aimed to aid this community with the necessary resources 
to not only find a job, but also gain skills to land a job.  
 

URLs of at least three data sources that you will programmatically 
scrape using a RESTful API (be very sure about this):

1) https://coresignal.com/solutions/jobs-data-api/
2) https://coresignal.com/solutions/company-data-api/
3) https://coresignal.com/solutions/historical-headcount-api/
4) https://coresignal.com/solutions/company-scraping-api/
5) https://coresignal.com/solutions/jobs-scraping-api/
6) https://learn.microsoft.com/en-us/linkedin/?context=linkedin%2Fcontext
7) https://courses.edx.org/api-docs/
8) https://www.glassdoor.com/developer/index.htm 
9) https://www.careeronestop.org/Developers/WebAPI/technical-information.aspx

At least three models:

1) Companies in South Side Chicago
2) Career Centers/Courses in South Side Chicago (both online & in-person)
3) Job Titles in South Side Chicago

An estimate of the number of instances of each model:

Companies: 500+ 
Career Centers/Course: 200+
Job Titles: 150+ 

Each model must have many attributes
Describe five of those attributes for each model that you can filter or sort:

Companies in South Side Chicago:
1) Name 
2) Location
3) Industry
4) Size
5) Review / Score 

Career Centers/Course in South Side Chicago:
1) Name
2) Location 
3) Skillsets taught
4) Modality
5) Cost

Job Titles in South Side Chicago:
1) Name
2) Skillset
3) Level of Education
4) Years of experience
5) Average Salary


Instances of each model must connect to instances of at least two other models:

* Each job title will have skills that connect to relevant courses and it also
  connects to the employer/company that posted it.
* Each company will have job titles and skills that it is asking for, which
  connects it to courses.
* Each course will have skills taught which go with job titles and companies.

Instances of each model must be rich with different media (e.g., feeds, images, maps, text, videos, etc.) (be very sure about this)
Describe two types of media for instances of each model:

Companies: Photos, Reviews, Map
Career Centers/Course: Photo, Map, Link
Job Titles: Photo, Graph Salary Info

Describe three questions that your site will answer:

1) What employers/companies are within the South Side Chicago area? 
2) What courses can I take to gain the skills for a particular job/employer?
3) What types of job are companies within South Side Chicago looking for? 
