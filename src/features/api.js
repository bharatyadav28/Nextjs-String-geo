import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuth, setAccessToken } from './authSlice';
// import { logoutUser } from './userSlice';


export const baseAddr = 'https://api.stringgeo.com/api';
// export const baseAddr = 'https://string-geo-backend-jhao.onrender.com/api';
export const vidAddr = 'https://d2n9feutzfz8ux.cloudfront.net'
export const imgAddr = 'https://dewv7gdonips4.cloudfront.net'

const baseQuery = fetchBaseQuery({
    // baseUrl: 'https://string-geo.adaptable.app/api',
    baseUrl: baseAddr,
    prepareHeaders: (headers, { getState}) => {
      const {accessToken,refreshToken} = getState().auth;
    
      
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }  
  
      return headers;
    },
  });
  

  const refreshQuery = fetchBaseQuery({
    // baseUrl: 'https://string-geo.adaptable.app/api',
    baseUrl: baseAddr,
    prepareHeaders: (headers, { getState }) => {
      const refreshToken = getState().auth.refreshToken;
      // console.log('Refresh Token:', refreshToken);
  
      if (refreshToken) {
        headers.set('Authorization', `Bearer ${refreshToken}`);
      }
    
      return headers;  
    },
  });

  const baseQueryWithReauth = async (args, api, extraOptions) => {
    const refreshToken = api.getState().auth.refreshToken;
    // console.log('Entering baseQueryWithReauth');
    if(refreshToken === null || refreshToken === undefined){
      api.dispatch(clearAuth());
       
     }

    try {
      const result = await baseQuery(args, api, extraOptions);
        
      if (result?.error?.status === 403 && refreshToken) {
        // console.log('Received 403 error, attempting reAuth');
        // console.log('refreshToken: ', refreshToken);
  
        const newAccessToken = await refreshQuery('/user/get-new-access-token', api, extraOptions);
        // const  = await refreshQuery('/user/get-new-access-token', api, extraOptions);
        // const newAccessToken = await baseQuery('/user/get-new-access-token', api, { body: { url: '/user/get-new-access-token' } });

        // console.log('Refresh Result:', newAccessToken);
  
        if (newAccessToken?.error?.status === 401 || newAccessToken?.error?.status === 404) {
          // console.log('Token refresh failed with 401, stopping request');
          api.dispatch(clearAuth());
          // toast.error(newAccessToken?.error?.data?.message);
          return result; 
        } else if (newAccessToken?.data) {
          // console.log('Token refresh successful, updating access token');
          await api.dispatch(setAccessToken(newAccessToken.data.accessToken));
          // console.log('Resending original request');
          return await baseQuery(args, api, extraOptions);
        }
      } else {
        // console.log('No 403 error, returning result');
        return result;
      }
    } catch (error) {
      // console.error('Error in baseQueryWithReauth:', error);
      // console.log(error);
      throw error; 
    }
  
  };
  

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,   
    keepUnusedDataFor: 60*60*1000,
    endpoints: (builder) => ({
        signupUser: builder.mutation({
          query: (userData) => ({
            url: '/user/register',
            method: 'POST',
            body: userData,
          }),
        }),
        verifyAccount: builder.mutation({
          query: (userData) => ({
            url: '/user/verify-account',
            method: 'POST',
            body: userData,
          }),
        }),
        sendCode: builder.mutation({
          query: (userData) => ({
            url: '/user/send-code',
            method: 'POST',
            body: userData,
          }),
        }),
        resendCode: builder.mutation({
          query: (userData) => ({
            url: '/user/resend-otp',
            method: 'POST',
            body: userData,
          }),
        }),
        validateCode: builder.mutation({
          query: (userData) => ({
            url: '/user/validate-code',
            method: 'POST',
            body: userData,
          }),     
        }),
        resetPassword: builder.mutation({
          query: (userData) => ({
            url: '/user/reset-password',
            method: 'POST',
            body: userData,
          }),
        }),
        loginUser: builder.mutation({
          query: (userData) => ({
            url: '/user/login',
            method: 'POST',
            body: userData,
          }),
        }),
        getProfile: builder.mutation({
          query: () => ({
            url: '/user/get-profile',
            method: 'GET',            
          }),
        }),
        updateProfile: builder.mutation({
          query: (userData) => ({
            url: '/user/update-profile',
            method: 'PATCH',
            body: userData,
          }),
        }),
        updateProfilePic: builder.mutation({
          query: (userData) => ({
            url: '/user/update-photo',
            method: 'PATCH',
            body: userData,
          }),
        }),
        updatePassword: builder.mutation({
          query: (userData) => ({
            url: '/user/update-password',
            method: 'PATCH',
            body: userData,
          }),
        }),
        getPlans: builder.query({
          query:()=>({
            url:'/plan/get-plans',
            method:'GET',
          }),
        }),
        createOrder: builder.mutation({
          query:(data)=>({
            url:'/order/create-order',
            method:'POST',
            body: data,
          }),
        }),
        createPaypalOrder: builder.mutation({
          query:(data)=>({
            url:'/order/create-paypal-order',
            method:'POST',
            body: data,
          }),
        }),
        createPaypalSubscription: builder.mutation({
          query:(data)=>({
            url:'/order/create-paypal-subscription',
            method:'POST',
            body: data,
          }),
        }),
        capturePaypalPayment: builder.mutation({
          query:(id)=>({
            url:`/order/capture-payment/${id}`,
            method:'POST',
            // body: data,
          }),
        }),
        getTransactionHistory: builder.mutation({
          query:()=>({
            url:'/transaction/get-transaction-history',
            method:'GET',
          }),
        }),
        getMyPlan: builder.mutation({
          query:()=>({
            url:'/user/get-my-plan',
            method:'GET',
          }),
        }),
        logoutUser: builder.mutation({
          query:(userData)=>({
            url:'/user/logout',
            method:'POST',
            body: userData,
          }),
        }),
        getAllVideos: builder.mutation({
          query:(params)=>({
            // url: params ? `/video/get-videos${params}` : '/video/get-videos',
            url: `/video/get-videos${params}`,
            method:'GET',
          }),
        }),
        addToWatchlist: builder.mutation({
          query:(data)=>({
            url: '/user/add-video-to-watchlist',
            method:'POST',
            body: data,
          }),
        }),
        removeFromWatchlist: builder.mutation({
          query:(data)=>({
            url: '/user/remove-video-from-watchlist',
            method:'POST',
            body: data,
          }),
        }),
        getWatchlist: builder.mutation({
          query:()=>({
            url: '/user/get-watchlist',
            method:'GET',
          }),
        }),
        getGenres: builder.query({
          query:()=>({
            url:'/genre/get-genres',
            method:'GET',
          }),
        }),
        getLanguages: builder.query({
          query:()=>({
            url:'/language/get-languages',
            method:'GET',
          }),
        }),
        getRecentPopularCategories: builder.mutation({
          query:()=>({
            url:'/category/get-popular-recent-categories',
            method:'GET',
          }),
        }),
        getWhateverywhere: builder.mutation({
          query:()=>({
            url:'/category/get-what-everywhere-category',
            method:'GET',
          }),
        }),
        getInnerCarousel: builder.query({
          query:()=>({
            url:'/carousel/get-inner-carousel',
            method:'GET',
          }),
        }),
        getOuterCarousel: builder.query({
          query:()=>({
            url:'/carousel/get-outer-carousel',
            method:'GET',
          }),
        }),
        getAllCategories: builder.mutation({
          query:()=>({
            url:'/category/get-categories',
            method:'GET',
          }),
        }),

        getAllCategoriesNoauth: builder.mutation({
          query:()=>({
            url:'/category/get-categories-noauth',
            method:'GET',
          }),
        }),
        getTrailer: builder.query({
          query:()=>({
            url:`/trailer/get-trailers`,
            method:'GET',
          }),
        }),
        getVideoById: builder.mutation({
          query:(id)=>({
            url:`/video/get-video/${id}`,
            method:'GET',
          }),
        }),
        getVideoPreview: builder.mutation({
          query:(id)=>({
            url:`/video/get-video-preview/${id}`,
            method:'GET',
          }),
        }),

        //--payments api---
        getKey: builder.mutation({
          query:()=>({
            url:'/order/get-key',
            method:'GET',
          }),
        }),
        verifySignature: builder.mutation({
          query:()=>({
            url:'/order/verify-signature',
            method:'POST',
          }),
        }),
        createSubscription: builder.mutation({
          query:(data)=>({
            url:'/order/create-subscription',
            method:'POST',
            body: data,
          }),
        }),
        cancelSubscription: builder.mutation({
          query:(data)=>({
            url:'order/cancel-subscription',
            method:'POST',
            body: data,
          }),
        }),



        submitQuery: builder.mutation({
          query:(data)=>({
            url:'/query/submit-query',
            method:'POST',
            body: data,
          }),
        }),



        deleteUser: builder.mutation({
          query:()=>({
            url:`/user/delete-account`,
            method:'DEL',
          }),
        }),

        //--free content----

        getAllShorts: builder.mutation({
          query:(params)=>({
            // url: params ? `/video/get-videos${params}` : '/video/get-videos',
            url: `/free-video/get-all-shorts${params}`,
            method:'GET',
          }),
        }),
        getFreeVideos: builder.mutation({
          query:(params)=>({
            // url: params ? `/video/get-videos${params}` : '/video/get-videos',
            url: `/free-video/get-videos${params}`,
            method:'GET',
          }),
        }),
        getFreeVideoById: builder.mutation({
          query:(id)=>({
            // url: params ? `/video/get-videos${params}` : '/video/get-videos',
            url: `/free-video/get-video/${id}`,
            method:'GET',
          }),
        }),

        getShortsById: builder.mutation({
          query:({id,params})=>( 
                  // console.log(id, params),
            {
            
            // url: `/free-video/get-dummy-shorts/${id}${params}`,
            url: `/free-video/get-shorts/${id}${params}`,
            method:'GET',
          }),
        }),

        //--content-pages-apis----

        getFaqs: builder.query({
          query:()=>({
            url:`/faq/get-faqs`,
            method:'GET',
            
          }),
        }),
        getPricingPolicy: builder.query({
          query:()=>({
            url:`/page/get-page/65cb46d53be67cfebee2c0f6`,
            method:'GET',
          }),
        }),
        getPrivacyPolicy: builder.query({
          query:()=>({
            url:`/page/get-page/65cb461f3be67cfebee2c0ea`,
            method:'GET',
          }),
        }),
        getRefundPolicy: builder.query({
          query:()=>({
            url:`/page/get-page/65cb46408f697afcfea1e55c`,
            method:'GET',
          }),
        }),
        getTC: builder.query({
          query:()=>({
            url:`/page/get-page/65cb45d38f697afcfea1e556`,
            method:'GET',
          }),
        }),
        getLegal: builder.query({
          query:()=>({
            url:`/page/get-page/65e83141060715a4f8365c88`,
            method:'GET',
          }),
        }),
        getContactUs: builder.query({
          query:()=>({
            url:`/contact/get-contacts`,
            method:'GET',
          }),
        }),
        getAboutUs: builder.query({
          query:()=>({
            url:`/page/get-page/65cb451651559aecf0a270b4`,
            method:'GET',
          }),
        }),
        getAboutUsImages: builder.query({
          query:()=>({
            url:`/about/get-abouts`,
            method:'GET',
          }),
        }),
        getDonatePage: builder.query({
          query:()=>({
            url:`/page/get-page/65cb46f48f697afcfea1e568`,
            method:'GET',
          }),
        }),
        getShareImage: builder.mutation({
          query:(data)=>({
            url:`/fetch-image`,
            method:'POST',
            body:data,
          }),
        }),


        // getTC: builder.query({
        //   query:()=>({
        //     url:`/page/get-page/65cb45d38f697afcfea1e556`,
        //     method:'GET',
        //   }),
        // }),


        
       
      }),
      
  });


  export const {useGetVideoPreviewMutation,useGetShareImageMutation,useGetAllShortsMutation,useCreatePaypalSubscriptionMutation,useCancelSubscriptionMutation,useCreateSubscriptionMutation,useGetShortsByIdMutation,useGetFreeVideoByIdMutation,useGetFreeVideosMutation,useGetAboutUsQuery, useGetAboutUsImagesQuery, useGetDonatePageQuery,useGetLegalQuery,useGetContactUsQuery,useGetPricingPolicyQuery,useGetRefundPolicyQuery,useGetPrivacyPolicyQuery,useGetTCQuery, useGetFaqsQuery,useGetTrailerQuery, useGetOuterCarouselQuery,useGetInnerCarouselQuery, useGetLanguagesQuery,useGetWatchlistMutation,useAddToWatchlistMutation,useRemoveFromWatchlistMutation,useResendCodeMutation,useGetWhateverywhereMutation,useGetRecentPopularCategoriesMutation,useGetGenresQuery,useCreatePaypalOrderMutation,useCapturePaypalPaymentMutation,useGetAllCategoriesMutation,useGetAllCategoriesNoauthMutation, useGetAllVideosMutation,useSubmitQueryMutation, useGetVideoByIdMutation, useUpdateProfilePicMutation, useDeleteUserMutation,useGetTransactionHistoryMutation, useGetMyPlanMutation,useVerifySignatureMutation, useGetKeyMutation, useLogoutUserMutation, useCreateOrderMutation,useSendCodeMutation,useResetPasswordMutation, useVerifyAccountMutation, useValidateCodeMutation, useGetPlansQuery, useUpdateProfileMutation, useUpdatePasswordMutation , useGetProfileMutation, useLoginUserMutation, useSignupUserMutation } = api;