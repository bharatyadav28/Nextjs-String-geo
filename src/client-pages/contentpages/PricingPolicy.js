import React from 'react'
import { useGetPricingPolicyQuery } from '../../features/api'
import ContentPageTemplate from '../../components/ContentPageTemplate'

function PricingPolicy() {

  const {data,isLoading} = useGetPricingPolicyQuery();
   

  return (
    <ContentPageTemplate page={data?.page} isLoading={isLoading}/>
  )
}

export default PricingPolicy