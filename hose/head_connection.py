import threading
import time
import zmq

class Connector:
    def __init__(self):
        self.context = zmq.Context()
        self.pull_sock = self.context.socket(zmq.PULL)
        self.pull_sock.bind("tcp://127.0.0.1:5556")
        self.push_sock = self.context.socket(zmq.PUSH)
        self.push_sock.bind("tcp://127.0.0.1:5557")
        self.poller = zmq.Poller()
        self.poller.register(self.pull_sock, zmq.POLLIN)
        #self.thread_rep = threading.Thread(target=self.recieve)

    def recieve(self):
        #self.thread_rep.start()
        if self.poller.poll(1):
            return self.pull_sock.recv()
        else:
            return None
            
    def send(self, msg):
        self.push_sock.send(msg, zmq.NOBLOCK)
