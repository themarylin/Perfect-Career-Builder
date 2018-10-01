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
app.config['JSON_SORT_KEYS'] = False


#################################################
# Database Setup
#################################################

Base = automap_base()
engine = create_engine('sqlite:///data\\database.db')
Base.prepare(engine, reflect=True)
conn = engine.connect()
session = Session(bind=engine)

DataScience = Base.classes.data_science_companies
OccupationStats = Base.classes.occupation_stats
ToolsPreference = Base.classes.tools_preference
CommonTools = Base.classes.common_tools
numByState = Base.classes.numByState
numByCompany = Base.classes.numByCompany

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
    """Display phase1"""
    return render_template("phase1.html")

@app.route("/phase2.html")
def phase2():
    """Display phase2."""
    return render_template("phase2.html")

@app.route("/phase3.html")
def phase3():
    """Display phase3."""
    return render_template("phase3.html")

@app.route("/phase4.html")
def phase4():
    """Display the homepage."""
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

    elif table=="commontools":
        results = session.query(CommonTools)
        data = [{
            'index': result.index,
            'type': 'CommonTools',
            'attributes': {
                'index': result.index,
                'word': result.word,
                'frequency': result.frequency,
                }
            } for result in results]

    elif table=="toolspreference":
        results = session.query(ToolsPreference)
        data = [{
            'index': result.index,
            'type': 'ToolsPreference',
            'attributes': {
                'index': result.index,
                'toolName': result.tool_name,
                'year2017':result.year_2017,
                'year2016':result.year_2016,
                'year2015':result.year_2015
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
    elif table=="numbystate":
        data = [
            {
                'state': s.state,
                'attributes':
                {
                    'totalPositions': s.position,
                    'totalCompanies': s.company,
                    'companies': [
                        {
                            'name': c.company,
                            'pos': c.position,
                        } for c in session.query(numByCompany.company,numByCompany.position).filter_by(state=s.state).order_by(desc(numByCompany.position))
                    ],
                },
            } for s in session.query(numByState).order_by(desc(numByState.position))
        ]
    else:
        return "Cannot find data table", 404
    return jsonify(data)

#################################################
# End
#################################################
if __name__ == "__main__":
    app.run(debug=True)
