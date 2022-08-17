import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchPosts } from '../redux/actions/TwitterActions';

class Home extends Component {
    componentDidMount() {
        this.props.fetchPosts();
    }

    render() {
        return <div>APP</div>;
    }
}
Home.propTypes = {
    fetchPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    twitter: state.twitter.items,
});

export default connect(mapStateToProps, { fetchPosts })(Home);
