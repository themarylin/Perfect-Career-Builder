import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import desc

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
# db = SQLAlchemy(app)

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(db.engine, reflect=True)

# # Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/index.html")
def home():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/phase1.html")
def phase1():
    """Return choropleth map"""
    return render_template("phase1.html")


@app.route("/phase2.html")
def phase2():
    """Return the homepage."""
    return render_template("phase2.html")


@app.route("/phase3.html")
def phase3():
    """Return the homepage."""
    return render_template("phase3.html")


@app.route("/phase4.html")
def phase4():
    """Return the homepage."""
    return render_template("phase4.html")

# @TODO: fix this part of the code!!!!!!!~~~~~~~
# this is where I gather data and slice it into my json file


@app.route("/api/states")
def api_sightings_geo_json():
    sql = text("""SELECT state, COUNT(*) as cnt 
FROM sightings
WHERE country='US'
GROUP BY state
ORDER BY cnt DESC""")

    result = engine.execute(sql)
    states = {}
    for row in result:
        states[row[0]] = row[1]

    with open('static/js/states.json') as data_file:
        us_states_data = json.load(data_file)
        # Append our state data to the US states geo JSON
        for i, feature in enumerate(us_states_data['features']):
            state = feature['id']
            us_states_data['features'][i]['properties']['mean_annual_wage'] = states[state]
            us_states_data['features'][i]['properties']['mean_hourly_wage'] = states[state]
            us_states_data['features'][i]['properties']['jobs_in_1000'] = states[state]
            us_states_data['features'][i]['properties']['mean_annual_wage'] = states[state]

    return jsonify(us_states_data)


if __name__ == "__main__":
    app.run()
