import MySQLdb
import time
import random
import datetime
from datetime import datetime
from datetime import timedelta
from random import randrange

def strTimeProp(start, end, format1, format2, prop):
    stime = time.mktime(time.strptime(start, format1))
    etime = time.mktime(time.strptime(end, format1))

    ptime = stime + prop * (etime - stime)

    return time.strftime(format2, time.localtime(ptime))


def randomDate(start, end, prop):
    return strTimeProp(start, end, '%m/%d/%Y %I:%M %p','%Y-%m-%d %H:%M:%S', prop)
'''
def random_date(start, end):
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)
'''
db = MySQLdb.connect("localhost","root","vishnu1","imdb")
x = db.cursor()
#users = "insert into Users (username,password) values (%s, %s)"
#usersdata = [('yash','pwd1'),('shalin','pwd2'),('sahil','pwd3'),('sable','pwd4'),('sheng','pwd5')]
#super_users = "insert into Super_Users (uid) values (%s)"
#super_usersdata = [(1),(2),(3)]
actor_ratings = "insert into Actor_Ratings (aid,uid,rating,comments,timestamp) values(%s, %s, %s, %s, %s)"
#director_ratings = "insert into Director_Ratings (did,uid,rating,comments,timestamp) values(%s, %s, %s, %s, %s)"
#movie_ratings = "insert into Movie_Ratings (mid,uid,rating,comments,timestamp) values(%s, %s, %s, %s, %s)"
actor_data = []
#director_data = []
#movie_data = []
#comments = ["I really like this movie","My son really enjoyed this movie","A family movie indeed","Bravo!","Impeccable character progression","Ingenious movie direction",
#        "Not appropriate for the whole family","Too Romanticized","Kids didn't enjoy the movie","The director should go back to director school"]
comments = ['Wow!','Great!','Cool!','Terrible!']
#for j in range(1,6256)
for j in range(1,5):
	for i in range(1,random.randint(1,10)):
                tup = (j,random.randint(1,5),random.randint(1,5),random.choice(comments),randomDate("1/1/2008 1:30 PM","10/31/2016 4:50 AM", random.random()))
                actor_data.append(tup)
#print actor_data
#for i in range(1,2399):
#       director
#for i in range(1,5043):
#       movie

try:
        #x.executemany(users,usersdata)
        #x.executemany(super_users,super_usersdata)
        x.executemany(actor_ratings,actor_data)
        db.commit()
except:
        #x.execute("SELECT * FROM Actor_Ratings")
        print("Cheese")
        db.rollback()
db.close()
