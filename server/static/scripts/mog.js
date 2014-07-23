/** @jsx React.DOM */

var TrackListRow = React.createClass({displayName: 'TrackListRow',
	render: function() {
		return (React.DOM.tr(null, React.DOM.td(null, this.props.protocol), React.DOM.td(null, this.props.id)));
	}
});

var Track = React.createClass({displayName: 'Track',
	render: function() {
		return (
			React.DOM.tr(null, 
				React.DOM.td(null, this.props.protocol), 
				React.DOM.td(null, this.props.id)
			)
		);
	}
});

var TrackList = React.createClass({displayName: 'TrackList',
	getInitialState: function() {
		return {
			tracks: []
		};
	},
	componentDidMount: function() {
		$.get('/api/list', function(result) {
			this.setState({tracks: result});
		}.bind(this));
	},
	render: function() {
		var tracks = this.state.tracks.map(function (t) {
			return Track({protocol: t[0], id: t[1], key: t[0] + '|' + t[1]});
		});
		return (
			React.DOM.table(null, 
				React.DOM.tbody(null, tracks)
			)
		);
	}
});

var Protocols = React.createClass({displayName: 'Protocols',
	getInitialState: function() {
		return {
			available: {},
			current: {},
		};
	},
	componentDidMount: function() {
		$.get('/api/protocol/get', function(result) {
			this.setState({available: result});
		}.bind(this));
		$.get('/api/protocol/list', function(result) {
			this.setState({current: result});
		}.bind(this));
	},
	render: function() {
		var keys = Object.keys(this.state.available);
		keys.sort();
		var protocols = keys.map(function(protocol) {
			return (
				React.DOM.div({key: protocol}, 
					React.DOM.h2(null, protocol)
				)
			);
		});
		return React.DOM.div(null, protocols);
	}
});

var Link = React.createClass({displayName: 'Link',
	click: function(event) {
		history.pushState(null, this.props.Name, this.props.href);
		router();
		event.preventDefault();
	},
	render: function() {
		return React.DOM.li(null, React.DOM.a({href: this.props.href, onClick: this.click}, this.props.name))
	}
});

var Navigation = React.createClass({displayName: 'Navigation',
	render: function() {
		return (
			React.DOM.ul(null, 
				Link({href: "/list", name: "List"}), 
				Link({href: "/protocols", name: "Protocols"})
			)
		);
	}
});

React.renderComponent(Navigation(null), document.getElementById('navigation'));

function router() {
	var component;
	switch (window.location.pathname) {
	case '/':
	case '/list':
		component = TrackList(null);
		break;
	case '/protocols':
		component = Protocols(null);
		break;
	default:
		alert('Unknown route');
		break;
	}
	if (component) {
		React.renderComponent(component, document.getElementById('main'));
	}
}
router();