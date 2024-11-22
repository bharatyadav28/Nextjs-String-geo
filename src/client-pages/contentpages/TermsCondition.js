import React from 'react'
import ContentTitle from '../../components/ContentTitle'
import QueAns from '../../components/QueAns'
import { Container } from 'react-bootstrap'
import ContentPageTemplate from '../../components/ContentPageTemplate';
import { useGetTCQuery } from '../../features/api';

function TermsCondition() {

  const {data,isLoading} = useGetTCQuery();
  


  return (
    <ContentPageTemplate page={data?.page} isLoading={isLoading}/>
  )
}

export default TermsCondition