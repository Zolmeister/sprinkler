print "I am the client, my job is to connect to the hose"

#import paramiko
import socket
import threading
import json
import struct

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(("", 4321))
s.listen(10)

while True:
    s2, addr = s.accept()

    # First four bytes are the packet length
    l = struct.unpack("I", s2.recv(4))[0]
    cmd = json.loads(s2.recv(l))
    print cmd

    import subprocess

    args = cmd.get("args", [])
    proc = subprocess.Popen([cmd["cmd"]]+args, stdout=subprocess.PIPE)
    ret = proc.communicate()[0]

    ret_s = json.dumps({"retval": ret})
    s2.send(struct.pack("I", len(ret_s)))
    s2.send(ret_s)
    s2.close()
