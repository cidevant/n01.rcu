import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol,MDBRipple } from 'mdb-react-ui-kit';

const Card = ({ post }) => {
  return (
    <MDBCol>
      <MDBCard style={{ maxWidth: '22rem' }}>
      <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
        <MDBCardImage src='https://mdbootstrap.com/img/new/standard/nature/111.webp' fluid alt='...' />
        <a>
          <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
        </a>
      </MDBRipple>
      <MDBCardBody>
        <MDBCardTitle>{post.title}</MDBCardTitle>
        <MDBCardText>
          {post.body}
        </MDBCardText>
        <MDBBtn color="success" href='#'>View</MDBBtn>
      </MDBCardBody>
    </MDBCard>
    </MDBCol>
  )
}

export default Card;