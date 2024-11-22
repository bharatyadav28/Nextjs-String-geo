import React from 'react'
import { Container } from 'react-bootstrap';
import ContentTitle from './ContentTitle';
import Skeleton from 'react-loading-skeleton';

function ContentPageTemplate({page,isLoading}) {
 
   
   
    
      const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
      };
    
      return (
        <section className='account-bg py-5 content-section'>
            <ContentTitle title={page?.title} 
            // desc='Everything you need to know about the Platform and biling'
             />
        
        <Container className='text-white content-container'>
        
        {isLoading?
      <Skeleton count={50} /> 
      
      :
      

        page?.description && (
              <div dangerouslySetInnerHTML={createMarkup(page?.description)} />
            )}
        </Container>
              
        </section>
      )
}

export default ContentPageTemplate