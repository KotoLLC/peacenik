import React, { useState, useEffect } from 'react'
import Graph from 'react-graph-vis'

interface iGraphNode {
  id: String,
  label: String,
  font?: String,
  title?: String,
  color?: String
}

interface iGraphEdge {
  from: String,
  to: String,
  label?: String
}

interface iGraph {
  nodes: iGraphNode[],
  edges: iGraphEdge[]
}

function NetworkGraph() {
  const [graph, setGraph] = useState<iGraph>({
    nodes: [],
    edges: []
  })

  useEffect(() => {
    async function fetchMyAPI() {
      const response = await fetch("http://localhost:8080/hubs-with-users");

      if (response.ok) {
        const data = await response.json();
        let edges: iGraphEdge[] = []
        data.hubs.forEach(hub => {
          hub.users.forEach(user => {
            edges.push({
              from: "hub_" + hub.hub,
              to: "user_" + user.id
            })
          });
        });
        setGraph({
          nodes: [...data.users.map(item => {
            return {
              id: "user_" + item?.id,
              label: "User: " + item?.full_name,
              font: {color:'white'},
              color: item.hide_identity? "red" : "blue"
            }
          }), ...data.hubs.map(item => {
            return {
              id: "hub_" + item?.hub,
              label: "Hub: " + item?.hub,
              font: {color:'white'},
              color: "green"
            }
          })],
          edges
        })
      } else {
        console.log("response error: ", response)
      }
    }
    fetchMyAPI()
  }, [])

  const options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: "#000000"
    },
    height: "1500px"
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    }
  };
  return <Graph
    graph={graph}
    options={options}
    events={events}
    getNetwork={network => {
      //  if you want access to vis.js network api you can set the state in a parent component using this property
    }}
  />
}

export default NetworkGraph;
