import React from 'react'
import ContentPageTemplate from '../../components/ContentPageTemplate';
import { useGetLegalQuery } from '../../features/api';

function Legal() {

  const {data,isLoading} = useGetLegalQuery();
   

  return (
    <ContentPageTemplate page={data?.page} isLoading={isLoading}/>
  
  )
}

export default Legal