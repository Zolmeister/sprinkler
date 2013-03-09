import threading
import time
import zmq

class Connector:
    def __init__(self):
        self.context = zmq.Context()
        #self.thread_rep = threading.Thread(target=self.recieve)
        

    def recieve(self):
        #self.thread_rep.start()
        rep_sock = self.context.socket(zmq.REP)
        rep_sock.connect("tcp://127.0.0.1:5556")
        message = rep_sock.recv()
        while message:
            print "received request '" + message + "'"
            rep_sock.send("Polo!")
            message = rep_sock.recv()


connector = Connector()
while True:
    connector.recieve()
