import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))

channel = connection.channel()

channel.queue_declare(queue='request_queue')

def on_request(ch, method, props, body):
    

    print "request came in %s"  % (body)
    #n = int(body)
    response = "response"
    channel.queue_declare(queue='reply_queue')

    channel.basic_publish(exchange='',
                          routing_key='reply_queue',
                          body='Hello World!')

    ch.basic_ack(delivery_tag = method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(on_request, queue='request_queue')

print " [x] Awaiting RPC requests"
channel.start_consuming()