import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';
import {ObjectSamped} from zed_interfaces.msg;
import 'numjs';



const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});



function Bbox_feature (){
  const nj = require('numjs');

  this.line_id = 0;
  this.box_publisher = new rospy.Publisher("bounding_boxes", MarkerArray, {"queue_size": 10});
  this.box_subscriber = new rospy.Subscriber("/zed2/zed_node/obj_det/objects", ObjectsStamped, this.callback);

  const draw_box = (cube1, line_id) => {
    var box_points, d, line_list, markerArray, p;
    line_list = ([new Marker()] * 13);
    markerArray = new MarkerArray();
    box_points = np.array([cube1[0], cube1[1], cube1[2], cube1[3], cube1[0], cube1[4], cube1[5], cube1[6], cube1[7], cube1[4]]);
    for (var l = 0, _pj_a = line_list.length; (l < _pj_a); l += 1) {
      line_list[l].header.stamp = rospy.Time.now();
      line_list[l] = new Marker();
      line_list[l].action = new Marker().ADD;
      line_list[l].header.frame_id = "zed2_left_camera_frame";
      line_list[l].ns = ("line_" + l.toString());
      line_list[l].pose.orientation.w = 1.0;
      line_list[l].type = new Marker().LINE_STRIP;
      line_list[l].id = line_id;
      line_list[l].scale.x = 0.05;
      line_list[l].color.b = 1.0;
      line_list[l].color.g = 1.0;
      line_list[l].color.a = 1.0;
      line_list[l].lifetime.secs = 1;
    }
    for (var i = 1, _pj_a = 5; (i < _pj_a); i += 1) {
      p = new Point();
      d = new Point();
      d.x = box_points[[(i - 1), 0]];
      d.y = box_points[[(i - 1), 1]];
      d.z = box_points[[(i - 1), 2]];
      p.x = box_points[[i, 0]];
      p.y = box_points[[i, 1]];
      p.z = box_points[[i, 2]];
      line_list[(i - 1)].points.append(p);
      line_list[(i - 1)].points.append(d);
    }
    for (var i = 6, _pj_a = 10; (i < _pj_a); i += 1) {
      p = new Point();
      d = new Point();
      d.x = box_points[[(i - 1), 0]];
      d.y = box_points[[(i - 1), 1]];
      d.z = box_points[[(i - 1), 2]];
      p.x = box_points[[i, 0]];
      p.y = box_points[[i, 1]];
      p.z = box_points[[i, 2]];
      line_list[(i - 2)].points.append(d);
      line_list[(i - 2)].points.append(p);
    }
    for (var i = 0, _pj_a = 5; (i < _pj_a); i += 1) {
      p = new Point();
      d = new Point();
      d.x = box_points[[i, 0]];
      d.y = box_points[[i, 1]];
      d.z = box_points[[i, 2]];
      p.x = box_points[[(i + 5), 0]];
      p.y = box_points[[(i + 5), 1]];
      p.z = box_points[[(i + 5), 2]];
      line_list[(i + 7)].points.append(d);
      line_list[(i + 7)].points.append(p);
    }
    return line_list;
  }
  const callback = (data) => {
    var max_len, raw_point;
    max_len = data.objects.length;
    raw_point = np.empty([max_len, 8, 3]);
    for (var i = 0, _pj_a = max_len; (i < _pj_a); i += 1) {
      for (var j = 0, _pj_b = 8; (j < _pj_b); j += 1) {
        raw_point[[i, j, 0]] = data.objects[i].bounding_box_3d.corners[j].kp[0];
        raw_point[[i, j, 1]] = data.objects[i].bounding_box_3d.corners[j].kp[1];
        raw_point[[i, j, 2]] = data.objects[i].bounding_box_3d.corners[j].kp[2];
        this.line_id = data.objects[i].label_id;
      }
      console.log("raw_point: \n", raw_point[i]);
      console.log("label_id: ", data.objects[i].label_id);
      this.box_publisher.publish(this.draw_box(raw_point[i], data.objects[i].label_id));
    }
  }
}
function main() {
  new Bbox_feature();
  rospy.init_node("bounding_box_publisher");
  rospy.spin();
}
if ((__name__ === "__main__")) {
  while ((! rospy.is_shutdown())) {
    main();
  }
  return(
    <div>

    </div>
  );
}


