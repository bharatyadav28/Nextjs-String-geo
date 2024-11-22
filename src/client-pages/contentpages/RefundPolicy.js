import React from 'react'
import { useGetRefundPolicyQuery } from '../../features/api';
import ContentPageTemplate from '../../components/ContentPageTemplate';

function RefundPolicy() {


  const {data,isLoading} = useGetRefundPolicyQuery();


  return (
    <ContentPageTemplate page={data?.page} isLoading={isLoading}/>
  )
}

export default RefundPolicy