print "I am the client, my job is to connect to the hose"

#import paramiko
import socket
import threading
import json
import struct
import subprocess

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(("", 4321))
s.listen(10)

def reply(s, d):
    ret_s = json.dumps(d)
    s.send(struct.pack("I", len(ret_s)))
    s.send(ret_s)

while True:
    s2, addr = s.accept()

    # First four bytes are the packet length
    l = struct.unpack("I", s2.recv(4))[0]
    cmd = json.loads(s2.recv(l))
    print cmd

    if "cmd" in cmd:
        commandString = cmd["cmd"].split(" ",1)
        args = [commandString[1] if len(commandString)>0 else ""]
        command = commandString[0]
        proc = subprocess.Popen([command]+args, stdout=subprocess.PIPE)
        ret = proc.communicate()[0]
        ret_s = json.dumps({"retval": ret})
        s2.send(struct.pack("I", len(ret_s)))
        s2.send(ret_s)
    elif "action" in cmd:
        if cmd["action"] == "getState":
            reply(s2, {"status": "OK"})
            pass
    s2.close()
