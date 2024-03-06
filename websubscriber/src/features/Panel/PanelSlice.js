import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Rnd} from "react-rnd";
import {Button} from "react-bootstrap";
import AllTopicSub from "../../Panel/AllTopicSub";
import ImageLR from "../../Component/ImageLR";
import PCL from "../../Component/PCL";
import RawMessageComponent from "../../Component/RawMessageComponent";

export const PanelSlice = () => {

    const topicList = useSelector((state) => state.TopicList.topics.topic);
    const selectedTopics = useSelector(state => state.TopicList.selectedTopics);  // store에서 선택된 토픽을 가져옴

    const dispatch = useDispatch();

    const [cards, setCards] = useState([]);


    const panelSelectList = (setSelectedPanel) => (
        <select onChange={(event) => setSelectedPanel(event.target.value)}>
            <option value="">Visualization Tools</option>
            <option value="Image">Image</option>
            <option value="PointCloud">PointCloud</option>
            <option value="Chart">Chart</option>
            <option value="RawMessage">RawMessage</option>
        </select>
    );
   const topicSelectList = (setSelectedTopic) => {
        return(
            <div>
                <AllTopicSub/>
                <select onChange={(event) => setSelectedTopic(event.target.value)}>
                    <option value="">Published Topic</option>
                    {topicList.map((state, index) => (
                        <option key={index} value={state.topic}>
                            {state.topic}
                        </option>
                    ))}
                </select>
            </div>
        )
    }


    const VisualizationComponent = ({ panelType, topic, width, height }) => {
        let w = width;
        let h = height;
        switch (panelType) {
            case 'Image':
                return <ImageLR topic={topic} height={h} width={w}/>;
            case 'PointCloud':
                return <PCL className="cancel" topic={topic}/>;
            case 'Chart':
                // return <Chart/>;
            case 'RawMessage':
                return <RawMessageComponent topic={topic}/>;
            default:
                return null;
        }
    };

    const deleteCard = (id) => {
        setCards(prevCards => prevCards.filter(card => card.id !== id))
    };

  return (
    <div>
      {cards.map((card, index) => (
            <Rnd
                 cancel=".cancel"
                default={{
                    x: 0,
                    y: 0,
                    width: card.width,
                    height: card.height,
                }}
                enableUserSelectHack="true"
                minWidth={450}
                minHeight={200}
                style={{backgroundColor: 'white', padding: "10px"}}
                onResizeStop={(e, direction, ref) => {
                    card.setSize(ref.offsetWidth, ref.offsetHeight);
                }}
            >
                <Button
                    variant="danger"
                    onClick={() => deleteCard(card.id)}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        padding: '5px',
                        fontSize: '16px',
                        lineHeight: '1',
                        width: 'auto',
                        height: 'auto',
                    }}
                >
                    X
                </Button>
                {panelSelectList(card.setSelectedPanel)}
                {topicSelectList(card.setSelectedTopic)}
                <div className="cancel">
                {card.selectedTopic && card.selectedPanel && <VisualizationComponent panelType={card.selectedPanel} topic={card.selectedTopic} width={card.width} height={card.height} />}
                </div>
            </Rnd>
        ))}
    </div>
  )
}