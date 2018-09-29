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

@app.route('/api/<int:id>', methods=['GET'])
def get_one_sighting(id):
    sighting = session.query(Sighting).filter(Sighting.id == id).one()
    return render_template('single_sighting.html', sighting=sighting)


if __name__ == "__main__":
    app.run()
