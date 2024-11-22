import React from 'react'
import { Col, Row } from 'react-bootstrap'
import VideoCard from './VideoCard'

function VideoMapper({data}) {


  return (
    <Row xs={2}  md={3}  className="mx-md- px-lg-1 videos-mapper">
        {data?.map((video, index) => (
          <Col key={index} className="p-md-2 d-flex p-1 align-items-center justify-content-center">
            <VideoCard
            video={video}
            />
          </Col>
        ))}
      </Row>
  )
}

export default VideoMapper