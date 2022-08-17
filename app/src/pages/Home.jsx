import React, { Component } from 'react'
import Card from '../components/Card'
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit"
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchPosts } from '../Redux/Actions/TwitterActions'


class Home extends Component {
    componentDidMount() {
        this.props.fetchPosts();
    }
    render() {
        return (
            <div>
                <MDBContainer>
                    <MDBRow>
                        {this.props.twitter && this.props.twitter.map(x => {
                            return (
                                <MDBCol lg="4">
                                    <Card post={x} />
                                </MDBCol>
                            )
                        })}
                    </MDBRow>
                </MDBContainer>
            </div>
        )
    }
}
Home.propTypes = {
    fetchPosts: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    twitter: state.twitter.items
});

export default connect(mapStateToProps, { fetchPosts })(Home)