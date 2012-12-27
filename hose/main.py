import paramiko #ssh library
import socket
import json
import struct

class LawnConnection:
    def __init__(self, hostname):
        self.hostname = hostname

    def sendPacket(self, packet):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((self.hostname, 4321))
        cmd = json.dumps(packet)
        s.send(struct.pack("I", len(cmd)))
        s.send(cmd)

        # Recieve the return value
        l = struct.unpack("I", s.recv(4))[0]
        ret = s.recv(l)
        print ret
        return ret

l = LawnConnection("127.0.0.1")
l.sendPacket({"cmd": "uptime"})
