
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

	getInitialState: function () {
		return {};
	},
	handleSubmit: function (e) {
		e.preventDefault();
		this.props.updateFilter();
	},
	handleSave: function (e) {
		e.preventDefault();
		this.props.saveCurrentFilter();
	},
	handleChange: function (name, event) {
		this.props.handleFilterChange(name, event);
	},
	render: function () {
		console.log("rendering filter", this.props.filters);

		var savedFilters = this.props.filters.map(function (filter, index) {
			return (
				<option value={filter.filterName}>{filter.filterName}</option>
			);
		});

		return (
			<form onSubmit={this.handleSubmit}>
				<div>
					<label>Choose a saved filter: </label>
					<select onChange={this.props.handleSavedFilterChange}>
						<option value="none">none</option>
						{savedFilters}
					</select>
				</div>

				<label>Cities: </label>
				<input type="text"
					onChange={this.handleChange.bind(this, 'cities') }
					placeholder="Cities"
					value={this.props.currentFilter.cities} />
				<label>Start Date: </label>
				<input type="date"
					onChange={this.handleChange.bind(this, 'startDate') }
					placeholder="Start Date"
					value={this.props.currentFilter.startDate} />
				<label>End Date: </label>
				<input type="date"
					onChange={this.handleChange.bind(this, 'endDate') }
					placeholder="End Date"
					value={this.props.currentFilter.endDate} />
				<label>Topics: </label>
				<input type="text"
					onChange={this.handleChange.bind(this, 'topics') }
					placeholder="Topics"
					value={this.props.currentFilter.topics} />
				<label>Paging: </label>
				<input type="number"
					onChange={this.handleChange.bind(this, 'paging') }
					placeholder="Number of events"
					value= {this.props.currentFilter.paging}/>
				<input type="submit" value="Update!" />

				<div>
					<label>Save as: </label>
					<input type="text"
						onChange={this.handleChange.bind(this, 'filterName') }
						placeholder="Filter Name"
						value={this.props.currentFilter.filterName}/>
					<input type="button" onClick={this.handleSave} value="Save" />
				</div>
			</form>
		);
	}
});

/**
 * Our parent class, handling the data binding between filter and table
 */
var EventViewer = React.createClass({
    getInitialState: function () {
        return {
            events: [],
            filters: [],
			currentFilter: []
        };
    },

	componentDidMount: function () {
		this.getEvents();
		this.getFilters();
	},
	//Get list of unfiltered events
	getEvents: function () {
		var xhttp = new XMLHttpRequest();
		var _this = this;
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(JSON.parse(xhttp.response).events);
				//TODO: check JSON before parsing
				_this.setState({ events: JSON.parse(xhttp.response).events });
			}
		};
		xhttp.open("GET", "/event", true);
		xhttp.send();
	},
	//Get list of initial filters
	getFilters: function () {
		var xhttp = new XMLHttpRequest();
		var _this = this;
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(JSON.parse(xhttp.response).filters);
				//TODO: check JSON before parsing
				_this.setState({ filters: JSON.parse(xhttp.response).filters });
			}
		};
		xhttp.open("GET", "/filter", true);
		xhttp.send();
	},
	// Save the current filter, server side
	saveCurrentFilter: function () {
		this.sendFilterUpdate(true);
	},
	//Send a POST request back to the server, updating the EventList with the new Filters
	sendFilterUpdate: function (isSave) {
		var xhttp = new XMLHttpRequest();
		var _this = this;
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log("response", JSON.parse(xhttp.response));
				//TODO: check JSON before parsing
				if (JSON.parse(xhttp.response).events) {
					_this.setState({ events: JSON.parse(xhttp.response).events });
				}
				if (JSON.parse(xhttp.response).filters) {
					_this.setState({ filters: JSON.parse(xhttp.response).filters });
				}
			}
		};
		console.log("is save", isSave);
		if (isSave) {
			xhttp.open("POST", "/filter", true);
		} else {
			xhttp.open("POST", "/event", true);
		}
		console.log("state", this.state);
		var params = "";
		if (this.state.currentFilter.cities) {
			if (params) params += "&";
			params += "cities=" + this.state.currentFilter.cities
		};
		if (this.state.currentFilter.startDate) {
			if (params) params += "&";
			params += "startDate=" + this.state.currentFilter.startDate
		};
		if (this.state.currentFilter.endDate) {
			if (params) params += "&";
			params += "endDate=" + this.state.currentFilter.endDate
		};
		if (this.state.currentFilter.topics) {
			if (params) params += "&";
			params += "topics=" + this.state.currentFilter.topics
		};
		if (this.state.currentFilter.paging) {
			if (params) params += "&";
			params += "paging=" + this.state.currentFilter.paging
		};
		if (this.state.currentFilter.filterName && isSave) {
			if (params) params += "&";
			params += "filterName=" + this.state.currentFilter.filterName
		};
		xhttp.send(params);
	},
	handleSavedFilterChange: function (event) {
		console.log("load filter", event.target.value);

		for (var i = 0; i < this.state.filters.length; i++) {
			var filter = this.state.filters[i];
			console.log("filter", filter);
			if (filter.filterName == event.target.value) {
				console.log("found filter", filter);
				var currentFilter = [];
				for (var key in filter) {
					currentFilter[key] = filter[key];
				}
				this.setState({ currentFilter: currentFilter });
			}
		}
	},
	handleFilterChange: function (name, event) {
		console.log(event.target.value, name);
		console.log("current", this.state.currentFilter);
		var currentFilter = this.state.currentFilter;
		currentFilter[name] = event.target.value.substr(0, 255);
		this.setState({ currentFilter: currentFilter });
	},
	render: function () {
		return (
			<div>
				<h1>Sample Event Viewer Application</h1>
				<FilterForm filters={this.state.filters} updateFilter={this.sendFilterUpdate} saveCurrentFilter={this.saveCurrentFilter}
					handleSavedFilterChange={this.handleSavedFilterChange} handleFilterChange={this.handleFilterChange} currentFilter={this.state.currentFilter}/>
				<EventList events={this.state.events}/>
			</div>
		);
	}
});

// Now add all our react components to the screen:
ReactDOM.render(<EventViewer />, document.getElementById('root'));
