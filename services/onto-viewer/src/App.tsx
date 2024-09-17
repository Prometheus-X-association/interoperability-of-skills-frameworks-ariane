import type { OnConnect } from "reactflow";

import { useCallback } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";

import "reactflow/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const testValues = {
    "edges": [
      {
        "animated": true,
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:CoverageType",
        "label": "subClassOf",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyTopSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:CoverageType",
        "targetHandle": "propertyBottomTarget",
        "type": "step",
      },
      {
        "id": "hrrdf:EnrollmentType-hrrdf:AccountBasedCoverageType",
        "label": "accountBasedCoverage",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:EnrollmentType",
        "sourceHandle": "propertyTopSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:AccountBasedCoverageType",
        "targetHandle": "propertyBottomTarget",
        "type": "custom",
      },
      {
        "id": "hrrdf:effectivePeriod-hrrdf:Unknow-1",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:effectivePeriod",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:Unknow-1",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:effectivePeriod-hrrdf:EffectiveTimePeriodType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:effectivePeriod",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:EffectiveTimePeriodType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:electionType-hrrdf:OpenEndPeriodType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:electionType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:OpenEndPeriodType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:carrierOrganization-hrrdf:ElectionType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:carrierOrganization",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:ElectionType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:deductionInstructions-hrrdf:OrganizationReferenceType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:deductionInstructions",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:OrganizationReferenceType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:electedPlanId-hrrdf:RemunerationOrDeductionType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:electedPlanId",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:RemunerationOrDeductionType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:groupNumberId-hrrdf:IdentifierType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:groupNumberId",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:IdentifierType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:id-hrrdf:IdentifierType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:id",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:IdentifierType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:id-hrrdf:IdentifierType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:id",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:IdentifierType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:accountBasedProductCode",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:accountBasedProductCode",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:effectivePeriod",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:effectivePeriod",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:electionType",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:electionType",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:carrierOrganization",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:carrierOrganization",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:deductionInstructions",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:deductionInstructions",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:electedPlanId",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:electedPlanId",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:groupNumberId",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:groupNumberId",
        "targetHandle": "propertyLeftTarget",
      },
      {
        "id": "hrrdf:AccountBasedCoverageType-hrrdf:id",
        "label": "",
        "markerEnd": {
          "color": "#f00",
          "type": "arrowclosed",
        },
        "source": "hrrdf:AccountBasedCoverageType",
        "sourceHandle": "propertyRightSource",
        "style": {
          "stroke": "#f6ab6c",
        },
        "target": "hrrdf:id",
        "targetHandle": "propertyLeftTarget",
      },
    ],
    "nodes": [
      {
        "data": {
          "label": "AccountBasedCoverageType",
        },
        "id": "hrrdf:AccountBasedCoverageType",
        "position": {
          "x": 1000,
          "y": 0,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "CoverageType",
        },
        "id": "hrrdf:CoverageType",
        "position": {
          "x": 1000,
          "y": -100,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "EnrollmentType",
        },
        "id": "hrrdf:EnrollmentType",
        "position": {
          "x": 1000,
          "y": 100,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "Unknow-1",
        },
        "id": "hrrdf:Unknow-1",
        "position": {
          "x": 1800,
          "y": -400,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "EffectiveTimePeriodType",
        },
        "id": "hrrdf:EffectiveTimePeriodType",
        "position": {
          "x": 1800,
          "y": -300,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "OpenEndPeriodType",
        },
        "id": "hrrdf:OpenEndPeriodType",
        "position": {
          "x": 1800,
          "y": -200,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "ElectionType",
        },
        "id": "hrrdf:ElectionType",
        "position": {
          "x": 1800,
          "y": -100,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "OrganizationReferenceType",
        },
        "id": "hrrdf:OrganizationReferenceType",
        "position": {
          "x": 1800,
          "y": 0,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "RemunerationOrDeductionType",
        },
        "id": "hrrdf:RemunerationOrDeductionType",
        "position": {
          "x": 1800,
          "y": 100,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "IdentifierType",
        },
        "id": "hrrdf:IdentifierType",
        "position": {
          "x": 1800,
          "y": 200,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "EntityType",
        },
        "id": "hrrdf:EntityType",
        "position": {
          "x": 1800,
          "y": 300,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "accountBasedProductCode",
        },
        "id": "hrrdf:accountBasedProductCode",
        "position": {
          "x": 1400,
          "y": -400,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "effectivePeriod",
        },
        "id": "hrrdf:effectivePeriod",
        "position": {
          "x": 1400,
          "y": -300,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "electionType",
        },
        "id": "hrrdf:electionType",
        "position": {
          "x": 1400,
          "y": -200,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "carrierOrganization",
        },
        "id": "hrrdf:carrierOrganization",
        "position": {
          "x": 1400,
          "y": -100,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "deductionInstructions",
        },
        "id": "hrrdf:deductionInstructions",
        "position": {
          "x": 1400,
          "y": 0,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "electedPlanId",
        },
        "id": "hrrdf:electedPlanId",
        "position": {
          "x": 1400,
          "y": 100,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "groupNumberId",
        },
        "id": "hrrdf:groupNumberId",
        "position": {
          "x": 1400,
          "y": 200,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
      {
        "data": {
          "label": "id",
        },
        "id": "hrrdf:id",
        "position": {
          "x": 1400,
          "y": 300,
        },
        "style": {
          "border": "4px solid",
          "borderColor": "#9370DB",
          "padding": 10,
        },
        "type": "entityNode",
      },
    ],
  }

  return (
    <ReactFlow
      // nodes={nodes}
      nodes={testValues.nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      // edges={edges}
      edges={testValues.edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
