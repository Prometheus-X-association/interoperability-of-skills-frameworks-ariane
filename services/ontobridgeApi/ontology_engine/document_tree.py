from collections import deque
from typing import List

from ontology_engine.rule import Rule

def PathArray(path : str) -> List[str]: 
    if not '.' in path: 
        return [ path ]
    return path.split(".") 
    
def Depth(path : str) -> int:
    return len(PathArray(path))

def preorder_traversal(root):
    res = []
    if not root:
        return res
 
    stack = [(root, 0)] 
    while stack:
        curr_node, depth = stack.pop()
        if curr_node.depth != 0:
            depth = curr_node.depth-1
            if depth == 0:
                res.append(curr_node.name)
            else:
                res.append('\t'*(curr_node.depth-1) + ' ' + curr_node.name)
        for key in reversed(curr_node.children):
            stack.append((curr_node.children[key], depth + 1))
    return res


class DocumentTree():
    name : str = ''
    parent = None
    depth = 0
    children = {} 
    rules : List[Rule] = []
    
    relativePaths : List[str] = []
    absolutePaths : List[str] = []
    
    def AddRule(self, path : str) -> None:
        depth = Depth(path)
        if depth == 1:
             if path in self.children:
                child = self.children[path]
             else: 
                child = DocumentTree()
                child.parent = self
                child.depth = self.depth + 1
                child.name = path
                child.children = {}
                self.children[path] = child
                
        else: 
            path_array = PathArray(path)
            path = path_array[0]
            depth = Depth(path)
            if path in self.children:
                child = self.children[path]
            else: 
                child = DocumentTree()
                child.parent = self
                child.depth = self.depth + 1
                child.name = path
                child.children = {}
                self.children[path] = child
            
            path_array.remove(path)
            if not len(path_array) == 0:
                currentPath = '.'.join([path for path in path_array])
                child.AddRule(currentPath)
    
    def __str__(self) -> str:
        res = preorder_traversal(self)
        return '\n'.join([r for r in res])

    
class DocumentTreeFactory():
    @classmethod
    def GenerateDocumentTree(cls, provider_rules : List[Rule]) -> DocumentTree:
        rulesByDepth : dict[int, List[Rule]]= {}
        for rule in provider_rules:
            depth = Depth(rule.sourcePath)
            if not depth in rulesByDepth:
                rulesByDepth[depth] = []
            rulesByDepth[depth].append(rule)
        
        orderedDepth = sorted(rulesByDepth)
        documentTree = DocumentTree()
        for depth in orderedDepth:
            for rule in rulesByDepth[depth]:
                documentTree.AddRule(rule.sourcePath)
        return documentTree
