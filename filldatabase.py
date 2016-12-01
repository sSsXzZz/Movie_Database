import MySQLdb

db = MySQLdb.connect("localhost","root","vishnu1","imdb")
x = db.cursor()
users = "insert into Users (username,password) values (%s, %s)"
usersdata = [('yash','pwd1'),('shalin','pwd2'),('sahil','pwd3'),('sable','pwd4'),('sheng','pwd5')]
super_users = "insert into Super_Users (uid) values (%s)"
super_usersdata = [(1),(2),(3)]

try:
       	x.executemany(users,usersdata)
        x.executemany(super_users,super_usersdata)
        db.commit()
except:
        print("Error")
	db.rollback()
db.close()
