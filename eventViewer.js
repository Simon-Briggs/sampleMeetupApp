
/**
 * Manages the contents of the event table
 */

/**
 * Generate each of the rows in the table
 */
var EventList = React.createClass({
	render: function () {
		// Loop through the events, JSON object and print out the table
		var events = this.props.events.map(function (event, index) {
			var tableData = [];
			for(var key in event) {
				// Special case for location, as it is an object
				if(key == "location") {
					for (var locationKey in event[key]) {
						tableData.push(<li>{event[key][locationKey]}</li>);
					}
				} else {
					tableData.push(<li>{event[key]}</li>);
				}
			}
			return (
				<ul key={index}>
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

// TODO: Use mock data provider
var events = [
	{
		eventId: "1",
		eventName: "Ruby meetup",
		startDate: "2016-06-23T19:00:00+09:00",
		endDate: "2016-06-23T19:00:00+09:00",
		location: {
			"address1": "Derry St",
			"address2": "Kensington",
			"address3": "",
			"city": "London",
			"county": "",
			"postCode": "W8 5HY",
			"country": "UK"
		},
		relevantTopics: [
			"Topic 1",
			"Topic 2",
			"Topic 3"
		]
	},
	{
		eventId: "2",
		eventName: "Java meetup",
		startDate: "2016-06-23T19:00:00+09:00",
		endDate: "2016-06-23T19:00:00+09:00",
		location: {
			"address1": "Derry St",
			"address2": "Kensington",
			"address3": "",
			"city": "London",
			"county": "",
			"postCode": "W8 5HY",
			"country": "UK"
		},
		relevantTopics: [
			"Topic 1",
			"Topic 2",
			"Topic 3"
		]
	},
	{
		eventId: "3",
		eventName: "Javascript meetup",
		startDate: "2016-06-23T19:00:00+09:00",
		endDate: "2016-06-23T19:00:00+09:00",
		location: {
			"address1": "Derry St",
			"address2": "Kensington",
			"address3": "",
			"city": "London",
			"county": "",
			"postCode": "W8 5HY",
			"country": "UK"
		},
		relevantTopics: [
			"Topic 1",
			"Topic 2",
			"Topic 3"
		]
	}
];

ReactDOM.render(<EventList events={events} />, document.getElementById('root'));