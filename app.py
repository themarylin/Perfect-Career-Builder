import os

import pandas as pd
import numpy as np


from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey, create_engine, desc, inspect, func, text

import pymysql
import json

from flask import Flask, jsonify, request, make_response, url_for, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

Base = automap_base()
engine = create_engine('sqlite:///data\\database.db')
Base.prepare(engine, reflect=True)
conn = engine.connect()
session = Session(bind=engine)
# data_science_companies
DataScience = Base.classes.data_science_companies
# job_common_words
CommonWords = Base.classes.job_common_words
# occupation-stats
OccupationStats = Base.classes.occupation_stats

#################################################
# Main routes
#################################################

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
    """Return the Map.html."""
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

#################################################
# API endpoints
#################################################
@app.route("/api/<table>", methods=['GET'])
def get_json(table):
    if table=='datascience':
        results = session.query(DataScience)
        data = [{
            'index': result.index,
            'type': 'data_science_companies',
            'attributes': {
                'index': result.index,
                'position': result.position,
                'company': result.company,
                'key_words': result.key_words,
                'city': result.city,
                'state': result.state
                }
            } for result in results]

    elif table=="commonwords":
        results = session.query(CommonWords)
        data = [{
            'index': result.index,
            'type': 'CommonWords',
            'attributes': {
                'index': result.index,
                'word': result.word,
                'frequency': result.frequency,
                }
            } for result in results]

    elif table=="occupationstats":
        results = session.query(OccupationStats)
        data = [{
            'index': result.index,
            'type': 'OccupationStats',
            'attributes': {
                'index': result.index,
                'ST': result.ST,
                'STATE': result.STATE,
                'TOT_EMP': result.TOT_EMP,
                'JOBS_1000': result.JOBS_1000,
                'LOC_Q': result.LOC_Q,
                'H_MEAN': result.H_MEAN,
                'A_MEAN': result.A_MEAN,
                'H_PCT10': result.H_PCT10,
                'H_PCT25': result.H_PCT25,
                'H_MEDIAN': result.H_MEDIAN,
                'H_PCT75': result.H_PCT75,
                'H_PCT90': result.H_PCT90,
                'A_PCT10': result.A_PCT10,
                'A_PCT25': result.A_PCT25,
                'A_MEDIAN': result.A_MEDIAN,
                'A_PCT75': result.A_PCT75,
                'A_PCT90': result.A_PCT90
                }
            } for result in results]
    else:
        return "Cannot find data table", 404
    return jsonify(data)

#################################################
# End
#################################################
if __name__ == "__main__":
    app.run(debug=True)