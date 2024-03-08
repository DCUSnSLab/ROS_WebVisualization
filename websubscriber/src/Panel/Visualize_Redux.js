import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Rnd } from 'react-rnd';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { deletePanel } from 'your-action-file'; // Action to dispatch on deleting a panel
import { panelSelectList, topicSelectList } from 'your-select-list-file';
import RosbagRecord from "./RosbagRecord";
import VehicleControl from "./VehicleControl";
import ImageLR from "../Component/ImageLR";
import PCL from "../Component/PCL";
import RawMessageComponent from "../Component/RawMessageComponent";
import AllTopicSub from "./AllTopicSub"; // Import your select list components


function Visualize_Redux(){
    const CardComponent = ({ card, deleteCard }) => {

    const panelSelectList = (setSelectedPanel) => (
        <select onChange={(event) => setSelectedPanel(event.target.value)}>
            <option value="">Visualization Tools</option>
            <option value="Image">Image</option>
            <option value="PointCloud">PointCloud</option>
            <option value="Chart">Chart</option>
            <option value="RawMessage">RawMessage</option>
        </select>
    );

    const VisualizationComponent = ({panelType, topic}) => {

        switch (panelType) {
            case 'Image':
                return <ImageLR topic={topic}/>;
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

    const topicSelectList = (setSelectedTopic) => {
        return (
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
    const [selectedTopic, setSelectedTopic] = useState(card.selectedTopic);
    const [selectedPanel, setSelectedPanel] = useState(card.selectedPanel);
    const [size, setSize] = useState([card.width, card.height]);
}

      return (
        <Rnd
          className="cancel"
          default={{
            x: 0,
            y: 0,
            width: size[0],
            height: size[1]
          }}
          enableUserSelectHack={true}
          minWidth={450}
          minHeight={200}
          style={{ backgroundColor: 'white', padding: "10px" }}
          onResizeStop={(e, direction, ref) => {
            setSize([ref.offsetWidth, ref.offsetHeight]);
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
          {panelSelectList(setSelectedPanel)}
          {topicSelectList(setSelectedTopic)}
          <div className="cancel">
            {selectedTopic && selectedPanel &&
              <VisualizationComponent
                panelType={selectedPanel}
                topic={selectedTopic}
                width={size[0]}
                height={size[1]}
              />}
          </div>
        </Rnd>
      );
    };

      const [cards, setCards] = useState([]);
      const dispatch = useDispatch();
      const topicList = useSelector((state) => state.topics.topic);

      const addCard = () => {
        const newCard = {
          id: Date.now(),
          topics: [...topicList],
          selectedTopic: topicList?.[0]?.topic,
          width: 400,
          height: 200
        };

        setCards(prevCards => [...prevCards, newCard]);
      };

      const deleteCard = (id) => {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
        dispatch(deletePanel(id));
      };

      return (
        <div style={{ height: '100%', width: '80vw' }}>
          <div id="threeBtn" style={{ height: "80px", display: "block" }}>
            <RosbagRecord />
            <VehicleControl />
          </div>
          <Tabs>
            <Tab className="coloredTab" eventKey="Vehicle1" title="Vehicle1" style={{ minHeight: "100vh" }}>
              <div id="newPanelBtn" style={{ display: "inline-block" }}>
                <Button variant="primary" onClick={addCard}>
                  +
                </Button>
                {cards.map((card, index) => (
                  <CardComponent key={card.id} card={card} deleteCard={deleteCard} />
                ))}
              </div>
            </Tab>
            <Button variant="primary" onClick={addCard}>Add New Panel</Button>
          </Tabs>
        </div>
      );
    };


}
export default Visualize_Redux;
