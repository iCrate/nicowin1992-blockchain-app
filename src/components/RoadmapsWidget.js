/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import "../css/roadmapsWidget.css"

//TODO: remove, as soon as layout is fixed
const MAX_SKILLS_AMOUNT = 4;

class RoadmapsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.renderRoadmaps = this.renderRoadmaps.bind(this);

    this.state = {addedRoadmaps: [], isViewingMentor: false};
  }

  handleAdd(e) {
      let roadmapId = e.target.id;

      if (this.state.addedRoadmaps.indexOf(roadmapId) == -1) {
        let copy = Object.assign(this.state, {}, {addedRoadmaps: this.state.addedRoadmaps.concat(roadmapId)})
        this.setState(copy);
      }
  }

  handleViewMentor(e) {
    console.log("HandleViewMentor: " + e.target.id);

    let copy = Object.assign(this.state, {}, {isViewingMentor: true});
    this.setState(copy);
  }

  handleViewDefault(e) {
    console.log("HandleViewDefault: " + e.target.id);

    let copy = Object.assign(this.state, {}, {isViewingMentor: false});
    this.setState(copy);
  }

  renderRoadmapsControls(roadmapId) {
      const addControlClassName = this.state.addedRoadmaps.indexOf(String(roadmapId)) != -1 ? "	glyphicon glyphicon-ok roadmapControl" 
      : "glyphicon glyphicon-plus roadmapControl";
      return (<span className="roadmapControls">
          <span className="glyphicon glyphicon-eye-open roadmapControl" id={roadmapId} onClick={(e)=> this.handleViewMentor(e)}></span>
          <span className={addControlClassName} id={roadmapId} onClick={(e)=> this.handleAdd(e)}></span>
      </span>);
  }
  
  renderRoadmaps() {
    if (this.props.roadmaps.length > 0 && !this.props.isFetchInProgress) {
        let that = this;
        return (
            <span>
              {this.props.roadmaps.map(function(roadmap, i){
                  let roadmapControls = that.renderRoadmapsControls(i);
                  return (
                  <div className="col-lg-2" key={i}> 
                      <div className="container roadMap">
                          <h4>{roadmap.name}</h4>
                          {roadmapControls}
                          <div className="row">
                            {roadmap.skills.map(function(skill, i) {
                                if (i < MAX_SKILLS_AMOUNT) {
                                    return<div className="col-lg-2 skillTag" key={i}>{skill}</div>;
                                }
                                else {
                                    return null;
                                }
                            })}
                          </div>
                      </div>
                  </div>);
                })}
            </span>
            );
    }
    else {
        if (this.props.isFetchInProgress) {
            return <h2>Searching for roadmaps...</h2>;
        }
        else {
            return <h2>No roadmaps found yet...</h2>;
        }
    }
  }

  render() {
      if (this.state.isViewingMentor) {
        return(<div className="col-lg-12">
                <div className="mentor_widget" onClick={(e)=> this.handleViewDefault(e)}><h2>Mentor coming soon... Click to go back</h2></div>
            </div>);
      }
      else {
        return(<div className="roadmaps_widget">
        {this.renderRoadmaps()}
        </div>);
    }
  }
}

RoadmapsWidget.propTypes = {
  roadmaps: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetchInProgress: PropTypes.bool.isRequired,
}

export default withRouter(RoadmapsWidget);