A sample web app using React.js to display a list of events, according to a user's filters.

Assume there is a pre-existing service for user management, including registration, login, social login, logout and a data storage system for registered users.
File serving system for assets such as images, with optimised filepaths to store no more than 100 files per directory.

An event contains the following information:
1 - unique event ID
2 - event name
3 - start date
4 - location
5 - topics of interest

Out of scope:
- Event images
- Registering for event/ Viewing users registered for an event

For the filter, the user can specify the following:
1 - Name of City: Array of 0 - 100 values (Future API Improvement: Search within certain mile radius of a location)
2 - Start Date: null for all dates, or a timestamp
3 - End date: null for no end date, or a timestamp
4 - Topics of interest: Array of 0 - 100 values
5 - Paging: default 25, unless another value is specified

A save function saves the user's selected city, date and topic filters to a list of favorite filters.
The save function requires an additional parameter to the filter described above:
- filterName

2 databases will be used:
A database to store events, format similar to sampleEvent.json
A database to store a user's filters, format similar to sampleFilter.json, with an extra parent array so each user's filters are stored.

Queries should ideally take under 1 second end to end.
Searching could initially be done via SQL, but a search implementation will need to be added once the website scales.
Caching will be used for filters, to cache results of searches, with a maximum of a 15 minute lifetime for cached results.
Pre-caching will be done when the server first starts up, re-running searches using a list of the filters in cache from before the reboot.

REST API for App:

GET /events
Gets a list of unfiltered events, limited to the first 25 results

POST /events
body contains filter
Gets a list of filtered events

GET /filter
Get a list of the user's saved filters
 
POST /filter
body will contain new filter to save
Add current filter to list of saved filters

Beyond scope of this basic implementation, remaining CRUD operations on the collection level, as well as CRUD on the item level:
PUT DELETE /events
PUT DELETE /filter
GET PUT POST DELETE /topics

GET PUT POST DELETE /events/eventName
GET PUT POST DELETE /filter/filterName
GET PUT POST DELETE /topics/topicName

The header of all requests will contain the authentication token returned by the user management service. 

Translations:
This app will only support English