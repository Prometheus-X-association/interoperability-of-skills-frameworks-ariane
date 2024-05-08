# Ontology Engine

- [Ontology Engine](#ontology-engine)
  - [Follow up](#follow-up)
  - [Description](#description)
  - [Environment](#environment)
    - [Libraries](#libraries)
      - [Test framework](#test-framework)
      - [Yaml](#yaml)
      - [RDFS](#rdfs)
        - [Online Course : Cambridge Semantics](#online-course--cambridge-semantics)
        - [Other Sources](#other-sources)
  - [Mindmatcher sources](#mindmatcher-sources)
  - [References](#references)

## Follow up

Date | description | author
--- | --- | ---
08/05/2007 | create the present document and the directory ontology_engine | Y. Le Razer

## Description

The primary function of this software engine is to generate a [RDF](#rdfs) file following the model.yaml (an simplified description of an ontology), the rules of transformation and a json file with the data to be included.
This conversion involves interpreting the YAML data according to predefined transformation rules that dictate how to map YAML structures to RDF triples.

## Environment

We use [poetry](https://python-poetry.org/) as dependency management and packaging in Python. This is a [cheat sheet](https://www.yippeecode.com/topics/python-poetry-cheat-sheet/) for basic usage.

### Libraries

#### Test framework

We use the [pytest](https://pypi.org/project/pytest/) library : ```pip install pytest```. This is [article that explain python testing with PyTest](https://realpython.com/pytest-python-testing/).

#### Yaml

We use the [pyyaml](https://pypi.org/project/PyYAML/) library : ```pip install pyyaml```. This is [an example of CRUD operations on yaml](https://python.land/data-processing/python-yaml).

#### RDFS

##### Online Course : Cambridge Semantics

[Cambridge Semantics](https://cambridgesemantics.com/blog/semantic-university/learn-rdf/) presents a RDF 101 Course.

- RDF is a graph data model.
- RDF data are directed, labeled graphs.
- A single edge in an RDF graph is a 3-tuple that is called either a statement or triple.
- Triples are organized into named graphs, forming 4-tuples, or quads.
- RDF resources (nodes), predicates (edges), and named graphs are labeled by URIs.
- Although preferable to reuse URIs when possible, Semantic Web technologies, including OWL and SPARQL, make it easy to resolve URI conflicts, as we’ll see in future lessons.

##### Other Sources

- [https://www.easyrdf.org/docs/rdf-formats-json](https://www.easyrdf.org/docs/rdf-formats-json)

## Mindmatcher sources

07/05/2024 18h44 - Florent provide in [Slack](https://mindmatcher.slack.com/archives/C06NPBLUYGY/p1715100242830229) a [Definition files in RDFS](https://gitlab.com/mmorg/bupm/ariane/-/blob/main/data-model/soo/onto-soo-1.0.0.jsonld).

## References

- [Python Naming Convention](https://github.com/naming-convention/naming-convention-guides/tree/master/python)
