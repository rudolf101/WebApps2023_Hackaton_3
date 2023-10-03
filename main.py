# coding=UTF-8

import cherrypy
import codecs
import os, os.path

from Cheetah.Template import Template

server_host = '127.0.0.1'
server_port = 22080


class Root(object):
    @cherrypy.expose
    def index(self):
        try:
            main_page = os.path.join('html', 'index.html')
            f = codecs.open(main_page, encoding='utf-8')
            temp = f.read()
            rend = Template(temp)
            return str(rend)
        except Exception as e:
            cherrypy.log("Index page. Template Render Failure!", traceback=True)
            return repr(e)

if __name__ == '__main__':
    cherrypy.config.update({'server.socket_host': server_host, 'server.socket_port': server_port,})
    cherrypy.quickstart(Root(), '/', "app.conf")
