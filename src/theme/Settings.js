import React, { Component } from 'react';

import LeftNav from '~/src/theme/components/homepage/LeftNav';
import RightSection from '~/src/theme/components/homepage/RightSection';

const profilePic = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isThemeClose: true,
      themeActive: false,
      theme: 'Dark',
      themeToggle: 'block',
      isVisibilityClose: true,
      visibilityActive: false,
      visibility: 'Public',
      visibilityToggle: 'none',
      isAutoAcceptClose: true,
      autoAcceptActive: false,
      autoAccept: 'No',
      autoAcceptToggle: 'none',
      IsLondon: 'none',
      IsDropDownOpen: 'none',
      IsAccountOpen: 'block',
      IsPrivacyOpen: 'none',
      IsCommOpen: 'none',
    };
    this.toggleAutoAccept = this.toggleAutoAccept.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);

    this.toggleAccountOption = this.toggleAccountOption.bind(this);
    this.togglePrivacyOption = this.togglePrivacyOption.bind(this);
    this.toggleCommunicationOption = this.toggleCommunicationOption.bind(this);
  }

  toggleTheme() {
    this.state.themeToggle == 'none'
      ? this.setState({ themeToggle: 'block' })
      : this.setState({ themeToggle: 'none' });
  }

  toggleVisibility() {
    this.state.visibilityToggle == 'none'
      ? this.setState({ visibilityToggle: 'block' })
      : this.setState({ visibilityToggle: 'none' });
  }

  toggleAutoAccept() {
    this.state.autoAcceptToggle == 'none'
      ? this.setState({ autoAcceptToggle: 'block' })
      : this.setState({ autoAcceptToggle: 'none' });
  }

  toggleAccountOption() {
    this.setState({ IsAccountOpen: 'block', IsPrivacyOpen: 'none', IsCommOpen: 'none' });
  }

  togglePrivacyOption() {
    this.setState({ IsAccountOpen: 'none', IsPrivacyOpen: 'block', IsCommOpen: 'none' });
  }

  toggleCommunicationOption() {
    this.setState({ IsAccountOpen: 'none', IsPrivacyOpen: 'none', IsCommOpen: 'block' });
  }

  toggleThemeState() {
    this.setState({
      isThemeClose: !this.state.isThemeClose,
      themeActive: !this.state.themeActive
    });
  }

  selectTheme(theme) {
    this.setState({
      isThemeClose: !this.state.isThemeClose,
      themeActive: !this.state.themeActive,
      theme: theme
    });
  }

  renderTeamSelect(options) {
    return (
      <div>
        <div className="custom-select" style={{ display: this.state.themeToggle }}>
          <select>
            {options.map((team, i) => {
              return(
                <option value={ team.value } key={ i }>{ team.label }</option>
              )
            })}
          </select>
          <div
            className={ this.state.themeActive ? 'select-selected select-arrow-active' : 'select-selected' }
            onClick={ () => this.toggleThemeState() }>
            { this.state.theme }
          </div>

          <div
            className={ this.state.isThemeClose ? 'select-items select-hide' : 'select-items' }>
            {options.map((team, i) => {
              return(
                <div
                  onClick={ () => this.selectTheme(team.label) } key={ i }>
                  { team.label }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }

  toggleVisibilityState() {
    this.setState({
      isVisibilityClose: !this.state.isVisibilityClose,
      visibilityActive: !this.state.visibilityActive
    });
  }

  selectVisibility(visibility) {
    this.setState({
      isVisibilityClose: !this.state.isVisibilityClose,
      visibilityActive: !this.state.visibilityActive,
      visibility: visibility
    });
  }

  renderVisibilitySelect(options) {
    return (
      <div>
        <div className="custom-select" style={{ display: this.state.visibilityToggle }}>
          <select>
            {options.map((team, i) => {
              return(
                <option value={ team.value } key={ i }>{ team.label }</option>
              )
            })}
          </select>
          <div
            className={ this.state.visibilityActive ? 'select-selected select-arrow-active' : 'select-selected' }
            onClick={ () => this.toggleVisibilityState() }>
            { this.state.visibility }
          </div>

          <div
            className={ this.state.isVisibilityClose ? 'select-items select-hide' : 'select-items' }>
            {options.map((team, i) => {
              return(
                <div
                  onClick={ () => this.selectVisibility(team.label) } key={ i }>
                  { team.label }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }

  toggleAutoAcceptState() {
    this.setState({
      isAutoAcceptClose: !this.state.isAutoAcceptClose,
      autoAcceptActive: !this.state.autoAcceptActive
    });
  }

  selectAutoAccept(autoAccept) {
    this.setState({
      isAutoAcceptClose: !this.state.isAutoAcceptClose,
      autoAcceptActive: !this.state.autoAcceptActive,
      autoAccept: autoAccept
    });
  }

  renderAutoAcceptSelect(options) {
    return (
      <div>
        <div className="custom-select" style={{ display: this.state.autoAcceptToggle }}>
          <select>
            {options.map((team, i) => {
              return(
                <option value={ team.value } key={ i }>{ team.label }</option>
              )
            })}
          </select>
          <div
            className={ this.state.autoAcceptActive ? 'select-selected select-arrow-active' : 'select-selected' }
            onClick={ () => this.toggleAutoAcceptState() }>
            { this.state.autoAccept }
          </div>

          <div
            className={ this.state.isAutoAcceptClose ? 'select-items select-hide' : 'select-items' }>
            {options.map((team, i) => {
              return(
                <div
                  onClick={ () => this.selectAutoAccept(team.label) } key={ i }>
                  { team.label }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="dark-theme-wrapper profile-wrapper settings-wrapper main-bg">
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="row">
                <LeftNav userProfile={this.props.userProfile} profilePic={this.props.userProfile.pictureURL ? this.props.userProfile.pictureURL : profilePic} />

                <RightSection />

                <div className="col-middle ml-fixed">
                  <div className="col-box-wp mb-20 p-0">
                    <ul className="tab-wp">
                      <li className={this.state.IsAccountOpen == 'block' ? 'active' : ''}><a href="javascript:;" onClick={this.toggleAccountOption}>Account</a></li>
                      <li className={this.state.IsPrivacyOpen == 'block' ? 'active' : ''}><a href="javascript:;" onClick={this.togglePrivacyOption}>Privacy</a></li>
                      <li className={this.state.IsCommOpen == 'block' ? 'active' : ''}><a href="javascript:;" onClick={this.toggleCommunicationOption}>Communication</a></li>
                    </ul>
                  </div>
                  <div id="account" className="theme-box-right" style={{ display: this.state.IsAccountOpen }}>
                    <div className="box">
                      <div className="devider-box">
                        <h3>
                          Color Theme
                          <span>
                            <a href="javascript:;" className="change-btn" onClick={this.toggleTheme}>
                              <i className="fa fa-pencil"></i> Change
                            </a>
                          </span>
                        </h3>
                        <p></p>
                        { this.renderTeamSelect([{value: "Dark", label: "Dark"}, {value: "Light", label: "Light"}]) }
                      </div>
                    </div>
                  </div>
                  <div id="privacy" className="theme-box-right" style={{ display: this.state.IsPrivacyOpen }}>
                    <div className="box">
                      <div className="devider-box">
                        <h3>
                          Who sees my tasks?
                          <span>
                            <a href="javascript:;" className="change-btn" onClick={this.toggleVisibility}>
                              <i className="fa fa-pencil"></i> Change
                            </a>
                          </span>
                        </h3>
                        <p>Users flagged with public will see tasks from all users in the platform. Users flagged with private will see tasks from only friends</p>
                        { this.renderVisibilitySelect([{value: "Public", label: "Public"}, {value: "Private", label: "Private"}]) }
                      </div>
                      <div className="devider-box">
                        <h3>
                          Auto send / Accept Facebook Friends?
                          <span>
                            <a href="javascript:;" className="change-btn" onClick={this.toggleAutoAccept}>
                              <i className="fa fa-pencil"></i> Change
                            </a>
                          </span>
                        </h3>
                        <p>If flagged yes, the users will automatically add all facebook friends that join the system. The users will also auto accept requests from facebook friends</p>
                        { this.renderAutoAcceptSelect([{value: "Yes", label: "Yes"}, {value: "No", label: "No"}]) }
                      </div>
                    </div>
                  </div>
                  <div id="communication" className="theme-box-right" style={{ display: this.state.IsCommOpen }}>
                    <div className="box">
                      <div className="devider-box">
                        <h3>This is the communication tab</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;