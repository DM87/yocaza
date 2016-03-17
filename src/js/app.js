var React = require('react');
var ReactDOM = require('react-dom');
require('../css/app.css');
var Modal = require('react-modal');
var Parse = require('parse');
Parse.initialize("lQnkbNmyR7nIjCi8T2afRofbjAu0XoiwawDoS0oj", "WDCLF1vNBUpVZmL69ObLXLjZfUeYvxdCA0luVDR7");
window.Parse=Parse;
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;
var Geosuggest = require('react-geosuggest');

var Dropzone = require('react-dropzone');
var EventEmitter = require('events');

var hub = new EventEmitter()

var DropImages = React.createClass({
    getInitialState: function () {
        return {
          parseFiles: [],
          files: [],
          background: true
        };
    },

    removeImage: function(e, x){
      e.preventDefault();
      e.stopPropagation();
      var index = x.toString()
      this.state.files.splice(index.substr(index.indexOf("$")+1,1),1);
      this.forceUpdate();
    },
    dragStart: function(e, x){
       x.dataTransfer.setData("text", e);
    },
    dragEnd: function(e, x) {
     var originIndex = x.dataTransfer.getData("text")
     var targetIndex = e
    Array.prototype.move = function (old_index, new_index) {
          if (new_index >= this.length) {
              var k = new_index - this.length;
              while ((k--) + 1) {
                  this.push(undefined);
              }
          }
          this.splice(new_index, 0, this.splice(old_index, 1)[0]);
          return this; // for testing purposes
      };
      this.state.files.move(originIndex,targetIndex)
      this.forceUpdate();


  },
    onTouchStart: function(e,x){

    },
    onTouchMove: function(e,x){
      console.log(x)
      console.log(e)
    },
    onTouchEnd: function(e,x){
      console.log(x)
      console.log(e)

    },

    onDrop: function (files) {

      this.setState({
        files: this.state.files.concat(files),
        parseFiles: this.state.parseFiles.concat(
          files.map(function(file) {
            return new Parse.File(file.name, file).save()
          })
        )
      })
    },

    onOpenClick: function () {
      this.refs.dropzone.open();
    },

    getValues: function() {
      return {
        files: this.state.files,
        parseFiles: this.state.parseFiles
      }
    },
    render: function () {
      var containerClassname = '';
      var containerBackground = '';
      if (this.state.files.length <= 2) {
        var containerClassname = 'few-images';
      }

      if(this.state.files.length > 0){
        containerBackground = "containerBackground"
      }

        var setClass = this.props.classname + " " + containerBackground

        return (
            <div className={containerClassname}>
                <Dropzone className={setClass} ref="dropzone" onDrop={this.onDrop} maxFiles={this.props.maxFiles}>
                    {this.state.files.map((file,i) => (
                      <div
                      key={i}
                      data-tag={i}
                      onTouchEnd={this.onTouchEnd.bind(this, i)}
                      onTouchMove={this.onTouchMove.bind(this, i)}
                      onTouchStart={this.onTouchStart.bind(this, i)}
                      draggable="true"
                      onDrop={this.dragEnd.bind(this, i)}
                      onDragStart={this.dragStart.bind(this, i)}
                      className='touchControl'
                      >
                        <button onClick={this.removeImage} className="deleteButton">del</button>
                        <img src={file.preview}/>

                      </div>
                    ) )}
                </Dropzone>
            </div>
        );
    }
});

var Wording = React.createClass({
  suggestSelected: function(x){
    this.setState({address:x})
  },
  getValues: function(e) {
    var fields = ["price","bed","bath","description"]
    var that = this;
    var values = {}
    fields.map(
        function(field) {
        values[field] = that.refs[field].value;
        });
  //   console.log(this.state.address.placeId)
  //   if (!this.state.address.placeId) {
  //   this.refs.address.focus()
  //   this.stopPropagation();
  // } else {}
    values.homeAddress = this.state.address
    return values

  },
  render: function(){
    var label = function(suggest){
      var format = suggest.description.split(',')[0] + "," + suggest.description.split(',')[1]
    return (format)
    };
    return (
      <form className='moreinfo'>
        <div><Geosuggest onSuggestSelect={this.suggestSelected} ref='address' getSuggestLabel={label} placeholder="ie. 148 Kohler Street" /></div>
        <div className="SameLine">
          <div><input type='text' className="price" ref="price" defaultValue="$285,000" maxLength="20"/></div>
          <label className="labelBathAndBed">Bedrooms:<input type='text' ref="bed" defaultValue="3" className="beds" maxLength="1"/></label>
          <label className="labelBathAndBed">Bathrooms:<input type='text' ref="bath" defaultValue="2" className="baths" maxLength="1"/></label>
        </div>
        <div><textarea className="description" ref="description" defaultValue="Facing green space and gardens this end unit is a one of a kind executive town home with its modern and luxury finishings. The beautiful home has colonial trim through out and tile flooring in foyer.

The fully finished basement is tile with a full bathroom and laundry room. Attractive kitchen with good cupboard & counter space and 3 appliances. All three bathrooms, and garage have been  updated. Hardwood floors on main level as well as 2nd level. Master bedroom has cheater door to main bath.

Nicely sized secondary bedrooms. Fully finished lower level with family room & full bath! Private yard contains privately landscaped gardens & is fully fenced. Spacious, renovated, open concept end unit condo is located directly in front of a Park and community gardens. 20 minutes to downtown and in proximity of schools."></textarea></div>
      </form>
      )
  }
})

var ContactCard = React.createClass({
  getValues: function() {
    var fields = ["heading","name","role","email","phone","other"]
    var that = this;
    var values = {}
    fields.map(
        function(field) {
        values[field] = that.refs[field].value;
        });
    return values
  },
  render: function(){
    return (
      <form className="contactcard">
        <div><input type='text' className="heading" ref="heading" defaultValue="For more information, please contact:"/></div>
        <div><input type='text' className="name" ref="name" defaultValue="Daniel Joseph"/></div>
        <div><input type='text' className="other" ref="role" defaultValue="Sales Representative"/></div>
        <div><input type='email' className="email" ref="email" defaultValue="danieljames@email.com"/></div>
        <div><input type='text' className="phone" ref="phone" defaultValue="(514) 555-2345"/></div>
        <div><input type='text' className="other" ref="other" defaultValue="148kohlerst.com"/></div>
      </form>
      )
  }
})


// A simple navigation component

var Navigation = React.createClass({
  render: function() {
    return (
      <nav className="main-menu">
        <ul>
          <li>
            <Link to="/Order">Order</Link>
          </li>
          <li>
            <Link to="/Choose">Choose</Link>
          </li>
          <li>
            <Link to="/Custom">Custom</Link>
          </li>
        </ul>
      </nav>
    );
  }
});

// The main application layout
// this.props.children will be set by React Router depending on the current route
var App = React.createClass({
  componentDidMount(){
    hub.addListener("save", this.openModal);
  },
  componentWillUnmount(){
    hub.removeListener("save", this.openModal);
  },
    getInitialState: function() {
    return {
      modalIsOpen: false,
      parseId: ''

      // Name: "Enter your name on the Feature Sheet",
      // Email: "Enter your email on the Feature Sheet",
      // Mainimage: "Enter your image on the Feature Sheet"
    };
  },

  openModal: function(featureSheet) {
    console.log(featureSheet);
    if (!featureSheet.agentContactInfo.email){
      ReactDOM.findDOMNode(this.refs.featuresheetpage.refs.cc.refs.email).focus()
    } else if (!featureSheet.homeDetails.homeAddress){
      ReactDOM.findDOMNode(this.refs.featuresheetpage.refs.hd.refs.address).focus()
      alert("Enter your address before proceeding.")
    } else if (!featureSheet.mainImage.files[0]){
      alert("Enter your images before proceeding.")
    }
    else {
    this.setState({
      houseData: featureSheet,
      modalIsOpen: true,
      Email: featureSheet.agentContactInfo.email,
      Mainimage: featureSheet.mainImage.files[0].preview
    });
    }
  },
  closeModal: function() {
    this.setState({
      modalIsOpen: false
    });
  },
  saveHouse: function() {

    var that = this;
    Parse.Promise.when(
      this.state.houseData.mainImage.parseFiles[0],
      Parse.Promise.when(this.state.houseData.otherImages.parseFiles)
    ).then(function(mainImage, otherImages){
      Parse.Cloud.run('savePdf', {
        agentContact: that.state.houseData.agentContactInfo,
        homeDetails: that.state.houseData.homeDetails,
        mainImage: mainImage,
        otherImages: otherImages
      }).then(function(res){
        console.log("ID IS BEING ASSIGNED")
        that.setState({
          parseId: "www.yocaza.heroku.com/house/" + res.id
        })
      })
    })
  },
  render: function() {

    if (!this.state.Mainimage === false){
      var backgroundFromImage = "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('"+ this.state.Mainimage +"')";
    } else {
      var backgroundFromImage = "white";
    }

    const customStyles = {
      content : {
        color                 : 'white',
        fontSize              : '1em',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        backgroundSize        : "cover",
        background            : backgroundFromImage,
        textAlign             : "center",
        padding               : "50px"
      }
};  console.log(this.state.parseId);



    return (
      <main>
      <ToolBar />
      <div id="Mobileheader">
        <h1 id="Mobilelogo">yocaza tools</h1>
        <h2 id="Mobiletagline">feature sheet generator</h2>
      </div>
      <page id="A4">
       <FeatureSheet ref="featuresheetpage"/>
      </page>
          <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles} >
              <br />
              <h2>Publish feature sheet?</h2>
              <br />
              <button onClick={this.saveHouse}>Publish</button>
              <button onClick={this.closeModal}>Cancel</button>
              <br />
              {this.state.parseId ? <div id="pageLink" ><input type='text' value={this.state.parseId} readOnly /></div> : null}
              <br />
          </Modal>
      </main>
    );
  }
});

var FeatureSheet = React.createClass({
  componentDidMount(){
    hub.addListener("data-request", this.onSave);
  },
  componentWillUnmount(){
    hub.removeListener("data-request", this.onSave);
  },
  onSave: function() {
    var featureSheet = {
      agentContactInfo: this.refs.cc.getValues(),
      homeDetails: this.refs.hd.getValues(),
      mainImage: this.refs.mi.getValues(),
      otherImages: this.refs.oi.getValues()
    };
    hub.emit("save", featureSheet);
  },

  render: function() {

    return (
      <div>
        <DropImages classname="mainImg" maxFiles="1" ref='mi'/>
        <div className="contentBody">
          <DropImages classname="imageContainer" ref='oi' />
            <div className="details">
              <Wording ref='hd' />
              <ContactCard ref="cc" />
            </div>
       </div>
      </div>
    );
  }
});

var ToolBar = React.createClass({
  onTheEvent: function(e){
        e.preventDefault();
        hub.emit("data-request");
  },
  onPrint: function(e){
      e.preventDefault();
      window.print();
  },
  render: function(){
    return (
      <div id="toolbar">
        <div id='logo'><h1>yocaza tools</h1><h2>feature sheet generator</h2></div>
        <div className="options">
          <button className="printButton" onClick={this.onPrint}>Print</button>
          <button className="submitButton" onClick={this.onTheEvent}>Publish & Share</button>
        </div>
      </div>
    );
  }
})

////MODAL/////




// not found "page"
var NotFound = React.createClass({
  render: function() {
    return (
      <div>Not Found!</div>
    );
  }
});

/*
The routes. This section says:
  - If the route starts with /, load the App component
  - If the route IS /, load the Home component INSIDE App as this.props.children
  - If the route is /about, load the About component INSIDE App as this.props.children
  - If the route is /team, load the Team component INSIDE App as this.props.children
  - If the route is /about, load the About component INSIDE App as this.props.children
  - If the route is anything else, load the NotFound component INSIDE App as this.props.children

The whole process lets us create **complex, nested user interfaces** with minimal effort,
by simply nesting `Route` components.
*/


var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={FeatureSheet}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

// If this line of code is not here, nothing gets displayed!
ReactDOM.render(routes, document.querySelector('#app'));
