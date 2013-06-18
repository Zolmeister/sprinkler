import struct
import socket
import json
import select

class LawnConnection:
    def __init__(self, hostname):
        self.hostname = hostname
        self.isWaitingOnReply = False

    def sendPacket(self, packet):
        print "sending packet"
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((self.hostname, 4321))
        cmd = json.dumps(packet)
        s.send(struct.pack("I", len(cmd)))
        s.send(cmd)
        self.sock = s
        self.poll = select.poll()
        self.poll.register(self.sock, select.POLLIN)
        self.isWaitingOnReply = True

    def recieveReply(self):
        # Poll the socket
        readable = self.poll.poll(0)
        if len(readable) == 0:
            return None # Nothing was readable
        # Recieve the return value
        recv = str(self.sock.recv(4))
        if len(recv)!=4:
            return None
        l = struct.unpack("I", recv)[0]
        ret = self.sock.recv(l)
        self.isWaitingOnReply = False
        print ret
        return json.loads(ret)