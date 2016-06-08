
/**
 * Manages the contents of the event table, and its filter
 */

/**
 * Generate each of the rows in the table
 */
var EventList = React.createClass({
	render: function () {
		// Loop through the events, JSON object and print out the table

		console.log("rendering table", this.props);
		if (!this.props || !this.props.events) {
			console.log("No events found");
			return <span>Loading events...</span>
		}
		var events = this.props.events.map(function (event, index) {

			//Parse the JSON so it is usable by our HTML
			var tableData = [];
			for (var key in event) {
				// Special case for location, as it is an object
				if (key == "location") {
					for (var locationKey in event[key]) {
						tableData.push(<li className='ul--li--location'>{event[key][locationKey]}</li>);
					}
				} else {
					tableData.push(<li className='ul--li'>{event[key]}</li>);
				}
			}

			return (
				<ul className="ul" key={index}>
					{tableData}
				</ul>
			);
		});

		return (
			<div>
				{events}
			</div>
		);
	}
});

/**
 * Generate the filter bar
 */
var FilterForm = React.createClass({
	getFilters: function () {
		var xhttp = new XMLHttpRequest();
		var _this = this;
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(JSON.parse(xhttp.response).filters);
				//TODO: check JSON before parsing
				_this.setState({ events: JSON.parse(xhttp.response).filters });
			}
		};
		xhttp.open("GET", "/filter", true);
		xhttp.send();
	},
	saveCurrentFilter: function () {
		var xhttp = new XMLHttpRequest();
		var _this = this;
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log("Filter saved successfully");
			}
		};
		xhttp.open("POST", "/filter", true);

		var params = "city=" + this.state.city;
		xhttp.send(params);
	},
	getInitialState: function () {
		return {};
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.updateFilter();
	},
	handleSave: function (e) {
		console.log("save	");
		e.preventDefault();
		this.saveCurrentFilter();
	},
	handleChange: function (name, event) {
		this.props.handleFilterChange(name, event);
	},
	render: function () {
		return (
			<form onSubmit={this.handleSubmit}>
				<input type="text"
					value={this.state.city}
					onChange={this.handleChange.bind(this, 'city') }
					placeholder="City" />
				<input type="date"
					value={this.state.startDate}
					onChange={this.handleChange.bind(this, 'startDate') }
					placeholder="Start Date" />
				<input type="date"
					value={this.state.endDate}
					onChange={this.handleChange.bind(this, 'endDate') }
					placeholder="End Date" />
				<input type="text"
					value={this.state.topics}
					onChange={this.handleChange.bind(this, 'topics') }
					placeholder="Topics" />
				<input type="number"
					value={this.state.paging}
					onChange={this.handleChange.bind(this, 'paging') }
					placeholder="Paging" />
				<input type="submit" value="Update!" />

				<input type="number"
					value={this.state.filterName}
					onChange={this.handleChange.bind(this, 'filterName') }
					placeholder="Filter Name" />
				<input type="button" onClick={this.handleSave} value="Save" />
			</form>
		);
	}
});

/**
 * Our parent class, handling the data binding between filter and table
 */
var EventViewer = React.createClass({
    getInitialState: function () {
		this.getEvents();
        return {
            events: [],
            filter: []
        };
    },
	
	componentDidMount: function () {
		this.getEvents();
	},
	//Get list of unfiltered events
	getEvents: function () {
		var xhttp = new XMLHttpRequest();
		var _this = this;
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(JSON.parse(xhttp.response).events);
				//TODO: check JSON before parsing
				_this.setState({ events: JSON.parse(xhttp.response).events })
			}
		};
		xhttp.open("GET", "/events", true);
		xhttp.send();
	},

	//Send a POST request back to the server, updating the EventList with the new Filters
	handleFilterUpdate: function () {
		var xhttp = new XMLHttpRequest();
		var _this = this;
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(JSON.parse(xhttp.response).events);
				//TODO: check JSON before parsing
				_this.setState({ events: JSON.parse(xhttp.response).events });
			}
		};
		xhttp.open("POST", "/events", true);

		console.log("state", this.state);
		var params = "";
		if (this.state.cityFilter) {
			if (params) params += "&";
			params += "city=" + this.state.cityFilter
		};
		if (this.state.startDateFilter) {
			if (params) params += "&";
			params += "startDate=" + this.state.startDateFilter
		};
		if (this.state.endDateFilter) {
			if (params) params += "&";
			params += "endDate=" + this.state.endDateFilter
		};
		if (this.state.topicsFilter) {
			if (params) params += "&";
			params += "topics=" + this.state.topicsFilter
		};
		if (this.state.pagingFilter) {
			if (params) params += "&";
			params += "paging=" + this.state.pagingFilter
		};
		//TODO: add remaining filters here
		xhttp.send(params);
	},
	handleFilterChange: function (name, event) {
		console.log(event.target.value, name);

		var newStateObject = function () {
			var newObj = {};
			newObj[name + "Filter"] = event.target.value.substr(0, 255);
			return newObj;
		}.bind(event)();

		this.setState(newStateObject);
		console.log(newStateObject);
	},
	render: function () {
		return (
			<div>
				<h1>Sample Event Viewer Application</h1>
				<FilterForm updateFilter={this.handleFilterUpdate} handleFilterChange={this.handleFilterChange}/>
				<EventList events={this.state.events}/>
			</div>
		);
	}
});
// Now add all our react components to the screen:
ReactDOM.render(<EventViewer />, document.getElementById('root'));
