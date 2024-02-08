import * as ROSLIB from "roslib";


const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

export default function AllTopicSub(){
    let received_topic_list=[]
  let received_node_list=[]

  /////////////////////////////// Get Publisher list
  const getNodes=()=>{
    var NodeClient = new ROSLIB.Service({
    ros : ros,
    name : '/rosapi/nodes',
    serviceType : 'rosapi/nodes'
    });

    var request = new ROSLIB.ServiceRequest();

    NodeClient.callService(request, function(result) {
    console.log("Getting nodes...");
    // reulst shape
    // string[] publishers
    // http://docs.ros.org/en/melodic/api/rosapi/html/srv/Publishers.html
    received_node_list.push(result)
    });

    return received_node_list
};

  let nodeList=getNodes();

    //set the topic list
    const setPubList=(nodeList)=>{

      for (let i=0;i<nodeList.nodes.length;i++){
        let node=nodeList.nodes[i]

        document.getElementById("node_list_length").innerHTML  =`${nodeList.nodes.length} Nodes`
        let list = document.getElementById("node_list");
        let listCoponent = document.createElement('p');
        listCoponent.innerHTML =`${node}`
        list.appendChild(listCoponent)

      }

    }


  ////////////////////////// Get Topic list
  const getTopics=()=>{
    var topicsClient = new ROSLIB.Service({
    ros : ros,
    name : '/rosapi/topics',
    serviceType : 'rosapi/Topics'
    });

    var request = new ROSLIB.ServiceRequest();

    topicsClient.callService(request, function(result) {
    console.log("Getting topics...");

    // reulst shape
    // string[] topics / string[] types
    // http://docs.ros.org/en/melodic/api/rosapi/html/srv/Topics.html
    received_topic_list.push(result)
    });

    return received_topic_list
};
  // get srv msg
  let topic_list=getTopics();

  //set the topic list
  const setTopicList=(topiclist)=>{

  for (let i=0;i<topiclist.topics.length;i++){
    let topic=topiclist.topics[i]
    let type=topiclist.types[i]

    document.getElementById("topic_list_length").innerHTML =`${topiclist.topics.length} topics`
    let list = document.getElementById("topic_list");
    let listCoponent = document.createElement('p');
    listCoponent.innerHTML =`${topic}, ${type}`
    list.appendChild(listCoponent)

  }

}
setTimeout(()=>{
        setTopicList(topic_list[0])
        setPubList(nodeList[0])
      },2000)
  return(
    <div style={{fontSize : "small"}}>
      <p>Topic list - Topic, Type
        <p id="topic_list_length"></p>
        <p id="topic_list"></p>
      </p>
      <p>Node list - Node
        <p id="node_list_length"></p>
        <p id="node_list"></p>
      </p>
    </div>
  )
}