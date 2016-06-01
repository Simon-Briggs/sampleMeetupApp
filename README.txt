A sample web app using React.js to display a list of events, according to a user's filters.

Assume there is a pre-existing service for user management, including registration, login, logout and a data storage system for registered users.

The event contains
1 - event name
2 - start date
3 - location
4 - topics of interest

For the filter, the user can specify the following:
1 - Name of City: 0 - many (Future API Improvement: Search within certain mile radius of a location)
2 - Start Date: null for all dates, or a specified start date and/or end date
3 - Topic of interest: 0 - many

A save function saves the user's selected city, date and topic filters to a list of favorite filters.

