
/**
 * Manages the contents of the event table, and its filter
 */

/**
 * Generate each of the rows in the table
 */
var EventList = React.createClass({
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
	componentDidMount: function () {
		this.getEvents();
	},
	render: function () {
		// Loop through the events, JSON object and print out the table
		
		console.log(this.state);
		if(!this.state || !this.state.events) {
			console.log("No events found");
			return <span>Loading events...</span>
		}
		var events = this.state.events.map(function (event, index) {

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
		return { author: '', text: '' };
	},
	handleFilterChange: function (e) {
		this.setState({ text: e.target.value });
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if (!text || !author) {
			return;
		}
		// TODO: send request to the server
		this.setState({ author: '', text: '' });
	},
	render: function () {
		return (
			<form className="filterForm" onSubmit={this.handleSubmit}>
				<input type="text"
					value={this.state.city}
					placeholder="City" />
				<input type="date"
					value={this.state.date}
					placeholder="Start Date" />
				<input type="date"
					value={this.state.date}
					placeholder="End Date" />
				<input type="text"
					value={this.state.topics}
					placeholder="Topics" />
				<input type="number"
					value={this.state.paging}
					placeholder="Paging" />
				<input type="submit" value="Update!" />
				<input type="submit" value="Save" />
			</form>
		);
	}
});

// Build our entire page here:
var EventViewer = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Sample Event Viewer Application</h1>
        <FilterForm />
        <EventList />
      </div>
    );
  }
});
// Now add all our react components to the screen:
ReactDOM.render(<EventViewer />, document.getElementById('root'));
