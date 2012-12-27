import paramiko #ssh library
import socket
import json
import struct

class LawnConnection:
    def __init__(self, hostname):
        self.hostname = hostname
        self.isWaitingOnReply = False

    def sendPacket(self, packet):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((self.hostname, 4321))
        cmd = json.dumps(packet)
        s.send(struct.pack("I", len(cmd)))
        s.send(cmd)
        self.sock = s
        self.poll = poll.poll()
        self.poll.register(self.sock, poll.POLLIN)
        self.isWaitingOnReply = True

    def recieveReply(self):
        # Poll the socket
        readable = self.poll.poll(0)
        if len(readable) == 0:
            return None # Nothing was readable

        # Recieve the return value
        l = struct.unpack("I", self.sock.recv(4))[0]
        ret = self.sock.recv(l)
        self.isWaitingOnReply = False
        print ret
        return ret

class Client:
    def __init__(self, hostname):
        self.jobs = [] # List of job sequences
        self.conn = LawnConnection(hostname)
        self.finished_jobs = []

    def update(self):
        if not self.conn.isWaitingOnReply and len(self.jobs) > 0:
            # Assign a new job!
            pass

        if self.conn.isWaitingOnReply:
            # Check to see if they've replied yet.
            ret = self.conn.recieveReply()
            if ret is not None:
                # Do something with the return value
                jobs[0].setReturnValue(ret)
                self.finished_jobs.append(jobs[0])
                del jobs[0]
                pass
        pass

#l = LawnConnection("127.0.0.1")
#l.sendPacket({"cmd": "uptime"})

clients = []

# Yay for event loops!
while 1:
    # Update the clients
    for c in clients:
        c.update()

    # Go check for the head
    pass
