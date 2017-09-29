/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

class ThemeInviteMeContainer extends React.Component {
  render() {
    return (<div><div className="container">
		<hr/>
		<div className="row centered">
			<div className="col-lg-6 col-lg-offset-3">
				<form className="form-inline" role="form">
				  <div className="form-group">
				    <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter your email address"/>
				  </div>
				  <button type="submit" className="btn btn-warning btn-lg">Invite Me!</button>
				</form>					
			</div>
			<div className="col-lg-3"></div>
		</div>
		<hr/>
	</div></div>
    );
  }

}

export default ThemeInviteMeContainer;