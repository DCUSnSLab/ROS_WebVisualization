FROM node:20.9.0

WORKDIR /ROS_WebVisualization-AutonomousMonitor/ROS_WebVisualization-Prototype

RUN npm install -g npm@10.8.2

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY ./websubscriber/package.json .

RUN npm install --legacy-peer-deps

COPY . /ROS_WebVisualization-AutonomousMonitor/ROS_WebVisualization-Prototype

WORKDIR /ROS_WebVisualization-AutonomousMonitor/ROS_WebVisualization-Prototype/websubscriber

CMD ["npm", "start"]

EXPOSE 3000