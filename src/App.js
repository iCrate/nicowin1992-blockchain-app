/*
    author: Alexander Zolotov
    Main application class.
    It is bound to JobsList class to SearchHeader by callbacks.
    It uses JobsList to display information, received from DataProvider.
    It requests data from DataProvider, each time country or query is changed in state.
*/

import React, { Component } from 'react';
import Axios from 'axios'
import WebFont from 'webfontloader';
import { withRouter } from 'react-router-dom'
import { Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';
import { instanceOf } from 'prop-types';

import {Link} from 'react-router-dom'

import Main from './Main';

import MainMenu from '~/src/theme/routes/MainMenu';


import ConfigMain from '~/configs/main'

import ActionLink from '~/src/components/common/ActionLink'

import { withCookies, Cookies } from 'react-cookie';

import {
  openUserProfile,
  openSearchResults,
  fetchUserProfileComplete,
  fetchJobItemsComplete,
  fetchEventItemsComplete,
  fetchCourseItemsComplete,
  fetchGigItemsComplete,
  fetchResultsInitiate,
  fetchResultsComplete,
  openSignUpForm,
  closeSignUpForm,
  setUserAuthorized,
} from './redux/actions/actions'

let DataProviderIndeed = require("~/src/data_providers/indeed/DataProvider");
let DataProviderEventBrite = require("~/src/data_providers/event_brite/DataProvider");
let DataProviderUdemy = require("~/src/data_providers/udemy/DataProvider");
let DataProviderFreelancer = require("~/src/data_providers/freelancer/DataProvider");

const BackendURL = ConfigMain.getBackendURL();

class App extends Component {
  constructor(props) {
    super(props);

    this.countries = {Singapore:"sg", USA:"us", China:"cn", Germany:"de", Ukraine: "ua"};

    this.initialCountry = this.countries.Singapore;
    this.initialQuery = "";

    this.state = {
      country: "sg", 
      query : "",
      isSearchInProgress: false,
      faceBookID: null,
      linkedInID: null,
    };

    this.isSearchingJobs = false;
    this.isSearchingEvents = false;
    this.isSearchingForUdemyItems = false;
    this.isSearchingForFreelancerItems = false;

    console.log(`Config BackendURL: ${BackendURL}`);
  }

  componentWillMount() {
    this.props.cookies.getAll();
  }

  handleAuthorizeLinked(id) {
    let copy = Object.assign({}, this.state, {linkedInID: id});
    this.setState(copy);
    console.log("handleAuthorizeLinked id: " + id);
  }

  handleAuthorizeFaceBook(id) {
    let copy = Object.assign({}, this.state, {faceBookID: id});
    this.setState(copy);
    console.log("handleAuthorizeFaceBook id: " + id);
  }

  storeCurrentLocationInCookies() {
    const { cookies } = this.props;

    let dateExpire = new Date();
    dateExpire.setTime(dateExpire.getTime() + ConfigMain.getCookiesExpirationPeriod());  
        
    let options = { path: '/', expires: dateExpire};
    
    let lastLocation = this.props.history.location;

    //TODO: need more robust way for redirection. Maybe store rediret path to backend session?
    if (this.props.exactLocation && this.props.exactLocation == "RoadmapsWidgetDetails") {
      lastLocation = '/taskManagement';
    }

    cookies.set('lastLocation', lastLocation, options);
  }

  HandleSignUpFacebook() {
    this.props.closeSignUpForm();

    this.storeCurrentLocationInCookies();

    window.location.href = `${BackendURL}/auth/facebook`;
  }

  HandleSignUpLinkedIn() {
    this.props.closeSignUpForm();
    
    this.storeCurrentLocationInCookies();

    window.location.href = `${BackendURL}/auth/linkedin`;
  }

  handleStartSearch() {
    console.log("handleStartSearch!!!!!!!!!!!!!!!!!!!!!!!!!!! this.props.searchQuery: " + this.props.searchQuery);
    this.startNewSearch(this.props.searchQuery);
  }

  refreshBusyState() {
    let copy = Object.assign({}, this.state, { isSearchInProgress: (
      this.isSearchingJobs || this.isSearchingEvents || this.isSearchingForUdemyItems || this.isSearchingForFreelancerItems)});
      
      this.setState(copy);
  }

  startNewSearch(searchQuery) {
    if (!this.props.isFetchInProgress && searchQuery != "") {
      let dateExpire = new Date();
      dateExpire.setTime(dateExpire.getTime() + ConfigMain.getCookiesExpirationPeriod());
      let options = { path: '/', expires: dateExpire};
       
      this.props.cookies.set('searchQuery', searchQuery, options);

      this.isSearchingJobs = true;
      this.isSearchingEvents = true;
      this.isSearchingForUdemyItems = true;
      this.isSearchingForFreelancerItems = true;

      this.refreshBusyState();
  
      this.props.populateJobItems([]);
      this.props.populateEventItems([]);
      this.props.populateCourseItems([]);
      this.props.populateGigItems([]);
      
      let copy = Object.assign({}, this.state, {jobItems: [], eventBriteItems: [], udemyItems: [], query: searchQuery});
      this.setState(copy);
  
      this.props.fetchResultsInitiate();

      this.refreshData("jobs", searchQuery);
      this.refreshData("events", searchQuery);
      this.refreshData("courses", searchQuery);
      this.refreshData("gigs", searchQuery);
    }
  }

  dataUpdatedIndeed(items) {
    if (typeof items !== "undefined") {
      this.isSearchingJobs = false;
      
      this.props.populateJobItems(items);

      this.refreshBusyState();
    }
  }

  dataUpdatedEventBrite(items) {
    if (typeof items !== "undefined") {

      this.isSearchingEvents = false;

      this.props.populateEventItems(items);

      this.refreshBusyState();
    }
  }

  dataUpdatedUdemy(items) {
    if (typeof items !== "undefined") {

      this.isSearchingForUdemyItems = false;

      this.props.populateCourseItems(items);

      this.refreshBusyState();
    }
  }

  dataUpdatedFreelancer(items) {
    if (typeof items !== "undefined") {

      this.isSearchingForFreelancerItems = false;

      this.props.populateGigItems(items);
      
      this.refreshBusyState();
    }
  }

  refreshData(type, query) {
    switch(type) {
      case "jobs":
      {
        const PUBLISHER_ID = "4201738803816157";
        let url = `${BackendURL}/indeed/jobs?query=${query}&country=${this.state.country}`;
    
        DataProviderIndeed.requestApiData(url, (items) => this.dataUpdatedIndeed(items) , true);
        break;
      }
      case "events":
      {
        let url = `${BackendURL}/eventbrite/events?query=${query}&location=${this.state.country}`;
        DataProviderEventBrite.requestApiData(url, (items) => this.dataUpdatedEventBrite(items));
        break;
      }
      case "courses":
      {
        let url = `${BackendURL}/udemy/courses/?query=${query}`;
        DataProviderUdemy.requestApiData(url, (items) => this.dataUpdatedUdemy(items));
        break;
      }
      case "gigs":
      {
        let url = `${BackendURL}/freelancer/gigs/?query= ${query}`;
        DataProviderFreelancer.requestApiData(url, (items) => this.dataUpdatedFreelancer(items));
        break;
      }
      default:
       break;
    }
  }
  
  resetAuthentication() {
    let copy = Object.assign({}, this.state, {linkedInID: "", faceBookID: "", profule: null});
    this.setState(copy);
  }

  fetchUserInfoFromDataBase() {
    if (this.state.faceBookID || this.state.linkedInID) {
      const url = this.state.faceBookID ? `${BackendURL}/fetchUserProfile?faceBookID=${this.state.faceBookID}`
      : `${BackendURL}/fetchUserProfile?linkedInID=${this.state.linkedInID}`;
  
      Axios.get(url)
      .then((response) =>this.handleUserProfileFetchFromDB(response))
      .catch((error) =>this.handleUserProfileFetchFromDBError(error));
    }
  }

  handleUserProfileFetchFromDB(response) {
    console.log("handleUserProfileFetchFromDB: ");
    
    const responseProfile = response.data.profile;

    console.log("START response.data: ");
    console.dir(response.data);
    console.log("END response.data: ");

    let newUserProfile = {
      _id: response.data._id,
      firstName: responseProfile.firstName, 
      lastName: responseProfile.lastName, 
      interests: responseProfile.interests, //TODO: receive FaceBook advanced permissions
      skills: responseProfile.skills, //TODO: receive FaceBook advanced permissions
      experience: responseProfile.experience,
      education: responseProfile.education
    }

    this.props.fetchUserProfileComplete(newUserProfile);
    this.props.setUserAuthorized(true);
  }
    
  handleUserProfileFetchFromDBError(error) {
    console.log("Error fetching FaceBook profile: " + error);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.linkedInID != this.state.linkedInID || prevState.faceBookID != this.state.faceBookID) {
      if(!this.state.linkedInID && !this.state.faceBookID) {
        this.props.setUserAuthorized(false);
      }
      else if(this.state.linkedInID || this.state.faceBookID) {
        this.fetchUserInfoFromDataBase();
      }
    }
    if (prevState.isSearchInProgress != this.state.isSearchInProgress) {
      if (!this.state.isSearchInProgress) {
        this.props.fetchResultsComplete();
      }
    }

    if (prevProps.isFetchInProgress != this.props.isFetchInProgress) {
      if (!this.props.isFetchInProgress) {
        if (this.props.history.location.pathname != "/searchResults") {
          this.props.openSearchResults();
        }
      }
    }

    if (prevProps != this.props) {
      console.log("App props updated: ");
      console.dir(this.props);
    }

    if (this.props.cookies != prevProps.cookies) {
      console.log("Cookies has been changed");
    }
  }

  getRedirectLocation() {
    let RedirectTo = null;
    if (this.props.isOpenSearchResultsPending) {
      if (this.props.location.pathname != '/searchResults') {
        RedirectTo = <Redirect to="/searchResults" push />;
      }
    }
    else if (this.props.isOpenProfilePending) {
      if (this.props.location.pathname != '/userProfile') {
        RedirectTo = <Redirect to="/userProfile" push />;
      }
    }

    return RedirectTo;
  }

  renderProfileLink() {
    let ProfileLink = '';
    if (this.props.isAuthorized) {
      ProfileLink = <Link className='btn btn-lg btn-outline-inverse pull-right' to='/userProfile'>Your account</Link>;
    }
    else
    {
      ProfileLink = <ActionLink className="btn btn-lg btn-outline-inverse pull-right loginButton" 
          onClick={()=> this.props.openSignUpForm()}>Connect with...</ActionLink>;
    }

    return ProfileLink;
  }
  
  render() {
    let RedirectTo = this.getRedirectLocation();
    
    return (
      <div className="outer-container">
        {RedirectTo}
        <div className="col-lg-12">
          {this.renderProfileLink()}
        </div>
        <MainMenu/>
        <section id="main-content" className="clearfix">
          <Main onHandleStartSearch={() => this.handleStartSearch()} onHandleChange={(e) => this.handleChange(e)}
            onHandleSearchClicked={() => this.handleStartSearch()} isFetchInProgress={this.props.isFetchInProgress}
            onCloseSignUpModal={() => this.props.closeSignUpForm()} isSignUpFormOpen={this.props.isSignUpFormOpen}
            onAuthorizeLinkedIn={(id) => this.handleAuthorizeLinked(id)} onAuthorizeFaceBook={(id) => this.handleAuthorizeFaceBook(id)}
            onHandleSignUpFacebook={()=>this.HandleSignUpFacebook()} onHandleSignUpLinkedIn={()=>this.HandleSignUpLinkedIn()}
          />
        </section>
      </div>
    );
  }
}

App.propTypes = {
  isOpenProfilePending: PropTypes.bool.isRequired,
  isOpenSearchResultsPending: PropTypes.bool.isRequired,
  isFetchInProgress: PropTypes.bool.isRequired,
  isSignUpFormOpen: PropTypes.bool.isRequired,
  cookies: instanceOf(Cookies).isRequired,
  searchQuery: PropTypes.string.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  exactLocation: PropTypes.string.isRequired,
  
  fetchUserProfileComplete: PropTypes.func.isRequired,
  openUserProfile: PropTypes.func.isRequired,
  openSearchResults: PropTypes.func.isRequired,
  populateJobItems: PropTypes.func.isRequired,
  populateEventItems: PropTypes.func.isRequired,
  populateCourseItems: PropTypes.func.isRequired,
  populateGigItems: PropTypes.func.isRequired,
  fetchResultsInitiate: PropTypes.func.isRequired,
  fetchResultsComplete: PropTypes.func.isRequired,
  openSignUpForm: PropTypes.func.isRequired,
  closeSignUpForm: PropTypes.func.isRequired,
  setUserAuthorized: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  openUserProfile: bindActionCreators(openUserProfile, dispatch),
  openSearchResults: bindActionCreators(openSearchResults, dispatch),
  populateJobItems: bindActionCreators(fetchJobItemsComplete, dispatch),
  populateEventItems: bindActionCreators(fetchEventItemsComplete, dispatch),
  populateCourseItems: bindActionCreators(fetchCourseItemsComplete, dispatch),
  populateGigItems: bindActionCreators(fetchGigItemsComplete, dispatch),
  fetchUserProfileComplete: bindActionCreators(fetchUserProfileComplete, dispatch),
  fetchResultsInitiate: bindActionCreators(fetchResultsInitiate, dispatch),
  fetchResultsComplete: bindActionCreators(fetchResultsComplete, dispatch),
  openSignUpForm: bindActionCreators(openSignUpForm, dispatch),
  closeSignUpForm: bindActionCreators(closeSignUpForm, dispatch),
  setUserAuthorized: bindActionCreators(setUserAuthorized, dispatch),
})

const mapStateToProps = state => ({
  isOpenProfilePending: state.isOpenProfilePending,
  isOpenSearchResultsPending: state.isOpenSearchResultsPending,
  isFetchInProgress: state.isFetchInProgress,
  isSignUpFormOpen: state.isSignUpFormOpen,
  searchQuery: state.searchQuery,
  isAuthorized: state.isAuthorized,
  exactLocation: state.exactLocation,
  //TODO: entire store is not needed here, remove after more robust debugging approach is found
  store: state,
})


//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withCookies(App)));