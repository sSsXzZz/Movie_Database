import httplib, urllib, base64
import json
import MySQLdb
import pandas as pd

def movie_color(str):
    if (str == 'Color'):
        return True;
    return False;

data = pd.read_csv('movie_metadata.csv')
colorlist = map(movie_color, data['color'])

db = MySQLdb.connect("localhost","root","vishnu1","imdb")
x = db.cursor()

sql_query = "SELECT movie_title FROM Movies"

try:
  x.execute(sql_query)
  result = x.fetchall()
  i = 0
  for row in result:
    i = i+1
    sql_insert = "UPDATE Movies SET color=%s WHERE mid=%s"
    sql_data = (colorlist[i-1],i)
    try:
      x.execute(sql_insert,sql_data)
      db.commit()
    except:
      print 'cheese'
      db.rollback()
except:
  print "Error: unable to fetch data"
db.close()
