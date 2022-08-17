import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../redux/actions/TwitterActions';

class Home extends Component {
    componentDidMount() {
        // this.props.fetchPosts();
    }

    render() {
        return <NavBar />;
    }
}
Home.propTypes = {
    // fetchPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    // twitter: state.twitter.items,
});

export default connect(mapStateToProps, { fetchPosts })(Home);

function NavBar() {
    return (
        <div className="d-flex">
            <div className="p-2">Flex item</div>
            <div className="p-2">Flex item</div>
            <div className="ml-auto p-2">Flex item</div>
        </div>
    );
}
