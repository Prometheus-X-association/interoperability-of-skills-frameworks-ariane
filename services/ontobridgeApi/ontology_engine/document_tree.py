from collections import deque
from typing import List

from ontology_engine.rule import Rule


def get_path_array(path: str) -> List[str]:
    if not "." in path:
        return [path]
    return path.split(".")


def get_path_depth(path: str) -> int:
    return len(get_path_array(path))


def browse_rules_tree(root):
    res = []
    if not root:
        return res

    stack = [(root, 0)]
    while stack:
        curr_node, depth = stack.pop()
        if curr_node.depth != 0:
            depth = curr_node.depth - 1
            if depth == 0:
                res.append(curr_node.name)
            else:
                res.append("\t" * (curr_node.depth - 1) + " " + curr_node.name)
        for key in reversed(curr_node.children):
            stack.append((curr_node.children[key], depth + 1))
    return res


class RulesTree:
    name: str = ""
    parent = None
    depth = 0
    children = {}
    rules: List[Rule] = []

    relativePaths: List[str] = []
    absolutePaths: List[str] = []

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
            child.rules.append(rule)
            path_array.remove(path)
            if not len(path_array) == 0:
                currentPath = ".".join([path for path in path_array])
                child.add_rule(rule, currentPath)

    def __str__(self) -> str:
        res = browse_rules_tree(self)
        return "\n".join([r for r in res])


class DocumentTreeFactory:
    @classmethod
    def generate_rules_tree(cls, provider_rules: List[Rule]) -> RulesTree:
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
