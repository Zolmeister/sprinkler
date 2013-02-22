import miniboa

class Connector:
    def __init__(self):
        self.server = miniboa.TelnetServer()
        self.server.on_connect = self.onConnect
        self.clients = []
        print "Starting telnet server on port %d"%self.server.port
        pass

    def onConnect(self, client):
        client.send("Hello, and Welcome to the testing interface!")
        self.clients.append(client)

    def recieve(self):
        self.server.poll()
        for c in self.clients:
            if c.cmd_ready:
                return c.get_command()
        return None
