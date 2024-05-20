import sys
import os

# Add the directory containing the ontobridgeApi to sys.path
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
print(base_dir)
if base_dir not in sys.path:
    sys.path.append(base_dir)


from ontobridgeApi.ontology_engine.models.testclass import HelloWorldClass


class HelloWorld_service:

    name = "helloworld"

    def say_hello(self, name: str):
        #onto_engine_helloworld = HelloWorldClass()
        return ""# onto_engine_helloworld.say_hello(name)
