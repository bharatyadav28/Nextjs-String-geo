import React from 'react'
import {  useGetDonatePageQuery } from '../../features/api'
import ContentPageTemplate from '../../components/ContentPageTemplate'

function DonatePage() {

  const {data,isLoading} = useGetDonatePageQuery();
   

  return (
    <ContentPageTemplate page={data?.page} isLoading={isLoading}/>
  )
}

export default DonatePage