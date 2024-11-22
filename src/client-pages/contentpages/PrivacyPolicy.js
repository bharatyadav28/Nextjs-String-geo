import React from 'react'

import { useGetPrivacyPolicyQuery } from '../../features/api';
import ContentPageTemplate from '../../components/ContentPageTemplate';

function PrivacyPolicy() {

  const {data,isLoading} = useGetPrivacyPolicyQuery();

       

  return (
    <ContentPageTemplate page={data?.page} isLoading={isLoading}/>
  )
}

export default PrivacyPolicy