"use strict";
/**
 * Manages the contents of the event table, and its filter
 */

/**
 * Generate each of the rows in the table
 */
var EventList = React.createClass({
	render: function () {
		// Loop through the events, JSON object and print out the table
		if (!this.props || !this.props.events) {
			return (
				<div>Loading events...</div>
			);
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
		var savedFilters = this.props.filters.map(function (filter, index) {
			return (
				<option value={filter.filterName}>{filter.filterName}</option>
			);
		});

		return (
			<form onSubmit={this.handleSubmit}>
				<div>
					<label>Choose a saved filter: </label>
					<select defaultValue="none" onChange={this.props.handleSavedFilterChange}>
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
				_this.setState({ filters: JSON.parse(xhttp.response).filters });
			}
		};
		xhttp.open("GET", "/filter", true);
		xhttp.send();
	},
	// Save the current filter on the server side
	saveCurrentFilter: function () {
		this.sendFilterUpdate(true);
	},
	//Send a POST request back to the server, updating the EventList according to the new Filters
	sendFilterUpdate: function (isSave) {
		var xhttp = new XMLHttpRequest();
		var _this = this;
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				if (JSON.parse(xhttp.response).events) {
					_this.setState({ events: JSON.parse(xhttp.response).events });
				}
				if (JSON.parse(xhttp.response).filters) {
					_this.setState({ filters: JSON.parse(xhttp.response).filters });
				}
			}
		};
		if (isSave) {
			xhttp.open("POST", "/filter", true);
		} else {
			xhttp.open("POST", "/event", true);
		}
		var params = "";
		if (this.state.currentFilter.cities) {
			if (params) params += "&";
			params += "cities=" + JSON.stringify(this.state.currentFilter.cities);
		};
		if (this.state.currentFilter.startDate) {
			if (params) params += "&";
			params += "startDate=" + this.state.currentFilter.startDate;
		};
		if (this.state.currentFilter.endDate) {
			if (params) params += "&";
			params += "endDate=" + this.state.currentFilter.endDate;
		};
		if (this.state.currentFilter.topics) {
			if (params) params += "&";
			params += "topics=" + JSON.stringify(this.state.currentFilter.topics);
		};
		if (this.state.currentFilter.paging) {
			if (params) params += "&";
			params += "paging=" + this.state.currentFilter.paging;
		};
		if (this.state.currentFilter.filterName && isSave) {
			if (params) params += "&";
			params += "filterName='" + this.state.currentFilter.filterName + "'";
		};
		xhttp.send(params);
	},
	handleSavedFilterChange: function (event) {
		for (var i = 0; i < this.state.filters.length; i++) {
			var filter = this.state.filters[i];
			if (filter.filterName == event.target.value) {
				var currentFilter = [];
				for (var key in filter) {
					currentFilter[key] = filter[key];
				}
				this.setState({ currentFilter: currentFilter });
			}
		}
	},
	handleFilterChange: function (name, event) {
		var newValue = event.target.value;
		var currentFilter = this.state.currentFilter;
		//Convert cities and topics from CSV to array format
		if (name == "cities" || name == "topics") {
			newValue = newValue.split(',');
		}
		currentFilter[name] = newValue;
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
