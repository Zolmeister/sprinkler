import pika
from collections import deque
class Connector:
	def __init__(self):
		pass

	def recieve(self):
	    connection = pika.BlockingConnection(pika.ConnectionParameters(
		        host='localhost'))
	    channel = connection.channel()
	    channel.queue_declare(queue='request_queue')
	    method_frame, header_frame, body = channel.basic_get(queue = 'request_queue')        
	    if not method_frame or method_frame.NAME == 'Basic.GetEmpty':
	        connection.close()
	        return ''
	    else:            
	        channel.basic_ack(delivery_tag=method_frame.delivery_tag)
	        connection.close() 
	        return body
	
