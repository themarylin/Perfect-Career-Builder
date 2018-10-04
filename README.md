# Perfect Career Builder
## Introduction: 
What is data science, and what do data scientists do? More importantly, how do I get a job in data science? 
  
One of the hottest words in technology today is data science, and because it's so new, the industry has yet to give it a solid definition of what it is, and who can do it. So we decided to take on that problem, and attempt to find an answer.
  
The goal of this project is to build a dashboard app that helps our clients build a perfect career profile. We analyze a position and its industry in four phases: 1) understanding the industry, 2) finding the right fit, 3) acquiring the right skillset, and 4) building the perfect LinkedIn profile.
  
### Requirements:
This application requires Python 3.6 to run, and MySQL instance 5.7 or greater. 

### Installation:
1. Clone the repository onto your desktop
2. Open Bash or terminal in that directory/repository
3. Run python app.py
4. Copy the local link to your browser (note: this app is not compatible with IE 9)
5. Explore!

_NOTE:_ for Mac users, please change line 27 of app.py to `engine = create_engine('sqlite:////data/database.db')`

## Data Collection:
In our search, we came across two key data sets. The first is from the Bureau of Labor, which gives us a pretty comprehensive data set of data scientist jobs available, the average annual salary by state, and job saturation statistics. The second data set is a LinkedIn analysis of people's profile pictures, which uses a machine learning algorithm to score a profile's picture based on attractiveness and emotional expression. It also includes other attributes as well, such as age, number of followers, and we decided to explore this data as well. 

The data was then taken from the csv and stored into a MySQL database tables.

## Back End:
We run a Python Flask web framework as a server for this project. 
