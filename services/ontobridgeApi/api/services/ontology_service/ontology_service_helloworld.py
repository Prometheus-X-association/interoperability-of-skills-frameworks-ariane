from ontology_engine.models.testclass import HelloWorldClass


class HelloWorld_service:

    name = "helloworld"

    def say_hello(self, name: str):
        onto_engine_helloworld = HelloWorldClass()
        print(f"payload:{name}")
        return onto_engine_helloworld.say_hello(name)
