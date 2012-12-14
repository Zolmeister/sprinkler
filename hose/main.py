import paramiko #ssh library
import time
from head_connection import Connector
con = Connector()

while 1:
	time.sleep(2)
	print con.recieve()
	
#while con.has_request():
#	print con.next_request()