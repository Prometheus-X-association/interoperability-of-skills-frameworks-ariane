from collections import deque
from typing import List

from ontology_engine.rule import Rule


def get_path_array(path: str) -> List[str]:
    if not "." in path:
        return [path]
    return path.split(".")


def get_path_depth(path: str) -> int:
    return len(get_path_array(path))


class RulesTree:
    name: str = ""
    parent = None
    depth = 0
    children = {}
    rules: List[Rule] = []
    matches = []
    parameters = []

    def add_rule(self, rule: Rule, subPath="") -> None:
        if subPath == "":
            path = rule.sourcePath
        else:
            path = subPath
        depth = get_path_depth(path)
        if depth == 1:
            if path in self.children:
                child = self.children[path]
            else:
                child = RulesTree()
                child.parent = self
                child.depth = self.depth + 1
                child.name = path
                child.children = {}
                self.children[path] = child
                child.rules = []
            child.rules.append(rule)
        else:
            path_array = get_path_array(path)
            path = path_array[0]
            depth = get_path_depth(path)
            if path in self.children:
                child = self.children[path]
            else:
                child = RulesTree()
                child.parent = self
                child.depth = self.depth + 1
                child.name = path
                child.children = {}
                self.children[path] = child
                child.rules = []
            if child.name == path_array[len(path_array) - 1]:
                child.rules.append(rule)
            path_array.remove(path)
            if not len(path_array) == 0:
                currentPath = ".".join([path for path in path_array])
                child.add_rule(rule, currentPath)

    def display(self):
        return "\t" * (self.depth - 1) + self.name


def browse_rules_tree(root) -> List[RulesTree]:
    res = []
    if not root:
        return res

    stack = [(root, 0)]
    while stack:
        curr_node, depth = stack.pop()
        res.append(curr_node)
        for key in reversed(curr_node.children):
            stack.append((curr_node.children[key], depth + 1))
    return res


class DocumentTreeFactory:
    @staticmethod
    def generate_rules_tree(provider_rules: List[Rule]) -> RulesTree:
        rulesByDepth: dict[int, List[Rule]] = {}
        for rule in provider_rules:
            depth = get_path_depth(rule.sourcePath)
            if not depth in rulesByDepth:
                rulesByDepth[depth] = []
            rulesByDepth[depth].append(rule)

        orderedDepth = sorted(rulesByDepth)
        documentTree = RulesTree()
        for depth in orderedDepth:
            for rule in rulesByDepth[depth]:
                documentTree.add_rule(rule)
        return documentTree

    @staticmethod
    def display_rules_tree(rules_tree: RulesTree) -> str:
        rules = browse_rules_tree(rules_tree)
        return "\n".join([rule.display() for rule in rules if rule.depth != 0])
