from flask import Flask
from flask import jsonify
from flask import request
from flask import make_response
from flask import url_for
from flask import render_template

from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import text

import pymysql
import json

from sqlalchemy.ext.declarative import declarative_base


class State(Base):
    __tablename__ = 'states'
    id = Column(Integer, primary_key=True)
    name = Column(String(40))
    abbr = Column(String(2))
    geometry = Column(String(40))


    @property
    def serialize(self):
        """
        Return object data in easily serializeable format (JSON API)
        See https://stackoverflow.com/questions/7102754/jsonify-a-sqlalchemy-result-set-in-flask
        """
        return {
            'type': 'Feature',
            'id': self.id,
            'properties': {
                    'name': self.name,
                    'abbr': self.abbr,
                    'duration': self.duration
            },
            'geometry': {
                'type': self.geometry,
                'coordinates': []
            }
            'links': {
                'self': url_for('get_one_sighting', id=self.id, _external=True)
            }
        }
